const bcrypt = require('bcryptjs');
const { MAX } = require('../constant');

// @fn: create an username for user by email, account id
// @ex: dyno2000@email.com, id: 127391212 => dyno200012739
exports.createUsername = (email = '', id = '') => {
  const idStr = id.toString();
  return (
    email.toString().split('@')[0] + idStr.slice(idStr.length - 5, idStr.length)
  );
};

exports.generateVerifyCode = (numberOfDigits) => {
  const n = parseInt(numberOfDigits);
  const number = Math.floor(Math.random() * Math.pow(10, n)) + 1;
  let numberStr = number.toString();
  const l = numberStr.length;
  for (let i = 0; i < MAX.VERIFY_CODE - l; ++i) {
    numberStr = '0' + numberStr;
  }
  return numberStr;
};

exports.hashPassword = async (password = '') => {
  const saltRounds = parseInt(process.env.SALT_ROUND);
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
};

// ─── Vietnamese name helpers ─────────────────────────────────────────────────

const VN_MAP = {
  à:'a',á:'a',ả:'a',ã:'a',ạ:'a',
  ă:'a',ắ:'a',ặ:'a',ằ:'a',ẵ:'a',ẳ:'a',
  â:'a',ấ:'a',ầ:'a',ẩ:'a',ẫ:'a',ậ:'a',
  è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',
  ê:'e',ế:'e',ề:'e',ể:'e',ễ:'e',ệ:'e',
  ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
  ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',
  ô:'o',ố:'o',ồ:'o',ổ:'o',ỗ:'o',ộ:'o',
  ơ:'o',ớ:'o',ờ:'o',ở:'o',ỡ:'o',ợ:'o',
  ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',
  ư:'u',ứ:'u',ừ:'u',ử:'u',ữ:'u',ự:'u',
  ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',
  đ:'d',
};

/** Remove Vietnamese diacritics and return lowercase ASCII */
exports.normalizeVN = (str = '') =>
  str.toLowerCase().split('').map((c) => VN_MAP[c] || c).join('').replace(/[^a-z0-9]/g, '');

/**
 * Generate teacher email from full name.
 * "Nguyễn Thị Dương" → "duongntgv@gmail.com"
 */
exports.generateTeacherEmail = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return `gv${Date.now()}@gmail.com`;
  const norm = exports.normalizeVN;
  const lastName = norm(parts[parts.length - 1]);
  const initials = parts.slice(0, parts.length - 1).map((p) => norm(p)[0] || '').join('');
  return `${lastName}${initials}gv@gmail.com`;
};

/**
 * Generate student email from full name + date of birth.
 * "Hoàng Thị Ngân" + "21/10/2011" → "nganht211011@gmail.com"
 * dob format: "dd/mm/yyyy" or "dd-mm-yyyy"
 */
exports.generateStudentEmail = (fullName = '', dob = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const norm = exports.normalizeVN;
  const lastName = parts.length > 0 ? norm(parts[parts.length - 1]) : 'hs';
  const initials = parts.slice(0, parts.length - 1).map((p) => norm(p)[0] || '').join('');
  const dobParts = dob.replace(/-/g, '/').split('/');
  let dobSuffix = '';
  if (dobParts.length === 3) {
    const dd = dobParts[0].padStart(2, '0');
    const mm = dobParts[1].padStart(2, '0');
    const yy = dobParts[2].slice(-2);
    dobSuffix = `${dd}${mm}${yy}`;
  }
  return `${lastName}${initials}${dobSuffix}@gmail.com`;
};

/**
 * Generate default student password from dob.
 * "21/10/2011" → "TCA@21102011"
 */
// exports.generateStudentPassword = (dob = '') => {
//   const parts = dob.replace(/-/g, '/').split('/');
//   if (parts.length === 3) {
//     const dd = parts[0].padStart(2, '0');
//     const mm = parts[1].padStart(2, '0');
//     const yyyy = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
//     return `TCA@${dd}${mm}${yyyy}`;
//   }
//   return 'TCA@123456';
// };
exports.generateStudentPassword = () => '12345678a';
