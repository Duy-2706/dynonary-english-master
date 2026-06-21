const { db, COLLECTIONS } = require('../configs/firebase.config');
const jwt = require('jsonwebtoken');
const { KEYS, ACCOUNT_TYPES } = require('../constant');
const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

const accountsCol = db.collection(COLLECTIONS.ACCOUNTS);
const usersCol = db.collection(COLLECTIONS.USERS);

// ─── helpers ────────────────────────────────────────────────────────────────

async function getUserByAccountId(accountId) {
  const accountDoc = await accountsCol.doc(accountId).get();

  if (!accountDoc.exists) return null;

  const accountData = accountDoc.data();

  if (accountData.isLocked) {
    return {
      locked: true,
      accountId,
    };
  }

  const snap = await usersCol
    .where('accountId', '==', accountId)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const data = snap.docs[0].data();

  if (data.isLocked) {
    return {
      locked: true,
      accountId,
    };
  }

  return {
    id: snap.docs[0].id,
    username: data.username,
    name: data.name,
    avt: data.avt,
    favoriteList: data.favoriteList || [],
    coin: data.coin,
    role: data.role,
    classroomId: data.classroomId || '',
    classroomName: data.classroomName || '',
    dob: data.dob || '',
    accountId,
  };
}

// ─── JWT middleware ───────────────────────────────────────────────────────────

/** Requires a valid JWT — blocks request if missing/invalid */
exports.jwtAuthentication = async (req, res, next) => {
  try {
    res.locals.isAuth = false;
    const token = req.cookies ? req.cookies[KEYS.JWT_TOKEN] : null;

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      const user = await getUserByAccountId(accountId);

        if (user?.locked) {
          res.clearCookie(KEYS.JWT_TOKEN);

          return res.status(403).json({
            message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.',
          });
        }

        if (user) {
          res.locals.isAuth = true;
          req.user = user;
        }
    }

    next();
  } catch (error) {
    console.error('Authentication with JWT ERROR: ', error);
    return res.status(401).json({ message: 'Unauthorized.', error });
  }
};

/** Allows requests with or without a JWT (optional auth) */
exports.jwtOptional = async (req, res, next) => {
  try {
    res.locals.isAuth = false;
    const token = req.cookies ? req.cookies[KEYS.JWT_TOKEN] : null;

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      const user = await getUserByAccountId(accountId);

      if (user?.locked) {
        res.clearCookie(KEYS.JWT_TOKEN);
        next();
        return;
      }

      if (user) {
        res.locals.isAuth = true;
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Token error → allow request to continue without auth
    next();
  }
};


exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }
  next();
};

// ─── Google OAuth2 ───────────────────────────────────────────────────────────

passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        if (!Boolean(profile)) {
          done(null, null);
          return;
        }

        const {
          given_name: givenName,
          family_name: familyName,
          email,
          picture,
          id,
        } = profile._json;

        done(null, {
          type: ACCOUNT_TYPES.GOOGLE,
          name: `${givenName} ${familyName}`,
          email,
          avt: picture,
          id,
        });
      } catch (error) {
        done(error, null);
      }
    },
  ),
);



// ─── Facebook OAuth2 ─────────────────────────────────────────────────────────

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      fbGraphVersion: 'v3.0',
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        if (!Boolean(profile)) {
          done(null, null);
          return;
        }

        const { name, email, id } = profile._json;

        done(null, {
          type: ACCOUNT_TYPES.FACEBOOK,
          name,
          email,
          avt: profile.photos[0]?.value,
          id,
        });
      } catch (error) {
        done(error, null);
      }
    },
  ),
);