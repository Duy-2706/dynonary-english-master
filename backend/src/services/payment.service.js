const PayOS = require('@payos/node');
const { admin, db, COLLECTIONS, docToObj } = require('../configs/firebase.config');

const paymentsCol = db.collection(COLLECTIONS.PAYMENTS);
const enrollmentsCol = db.collection(COLLECTIONS.ENROLLMENTS);
const coursesCol = db.collection(COLLECTIONS.COURSES);

function getPayOSClient() {
  if (!process.env.PAYOS_CLIENT_ID) {
    throw new Error('PayOS chưa được cấu hình. Vui lòng thêm PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY vào .env');
  }
  return new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY,
  );
}

// Tạo mã orderCode duy nhất (12 chữ số)
function generateOrderCode() {
  const ts = String(Date.now()).slice(-8);
  const rand = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return Number(ts + rand);
}

// Xây dựng URL QR ảnh VietQR từ thông tin ngân hàng của PayOS
function buildVietQRUrl({ bin, accountNumber, accountName, amount, description }) {
  const base = `https://img.vietqr.io/image/${bin}-${accountNumber}-compact2.png`;
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: description,
    accountName,
  });
  return `${base}?${params.toString()}`;
}

// Tạo đơn thanh toán PayOS + enrollment pending
exports.createOrder = async (courseId, student) => {
  // Lấy thông tin khóa học
  const courseDoc = await coursesCol.doc(courseId).get();
  if (!courseDoc.exists) return { error: 'Không tìm thấy khóa học.' };
  const course = docToObj(courseDoc);

  if (course.status !== 'published') return { error: 'Khóa học chưa được phát hành.' };
  if (course.isFree) return { error: 'Khóa học này miễn phí, không cần thanh toán.' };

  const amount = course.price || 0;
  if (amount < 2000) return { error: 'Học phí không hợp lệ (tối thiểu 2.000 VNĐ).' };

  // Kiểm tra enrollment/payment đã tồn tại chưa
  const existEnrollSnap = await enrollmentsCol
    .where('courseId', '==', courseId)
    .where('studentAccountId', '==', student.accountId)
    .limit(1)
    .get();

  if (!existEnrollSnap.empty) {
    const existEnroll = docToObj(existEnrollSnap.docs[0]);
    if (existEnroll.status === 'active') return { error: 'Bạn đã đăng ký khóa học này rồi.' };

    // Nếu đang pending, tìm payment record cũ còn hiệu lực
    const existPaySnap = await paymentsCol
      .where('courseId', '==', courseId)
      .where('studentAccountId', '==', student.accountId)
      .where('status', '==', 'PENDING')
      .limit(1)
      .get();

    if (!existPaySnap.empty) {
      const existPay = docToObj(existPaySnap.docs[0]);
      const qrImageUrl = buildVietQRUrl({
        bin: existPay.bin,
        accountNumber: existPay.accountNumber,
        accountName: existPay.accountName,
        amount: existPay.amount,
        description: existPay.description,
      });
      return {
        orderCode: existPay.orderCode,
        qrImageUrl,
        checkoutUrl: existPay.checkoutUrl,
        amount: existPay.amount,
        description: existPay.description,
        bank: {
          accountNumber: existPay.accountNumber,
          accountName: existPay.accountName,
          bin: existPay.bin,
        },
        alreadyExists: true,
      };
    }
  }

  // Tạo đơn PayOS mới
  const payos = getPayOSClient();
  const orderCode = generateOrderCode();
  const description = `KH${courseId.slice(-4).toUpperCase()}`;
  const returnUrl = process.env.PAYOS_RETURN_URL || `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success`;
  const cancelUrl = process.env.PAYOS_CANCEL_URL || `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`;

  let paymentLink;
  try {
    paymentLink = await payos.createPaymentLink({
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
      expiredAt: Math.floor(Date.now() / 1000) + 30 * 60, // hết hạn sau 30 phút
      items: [{ name: course.title.slice(0, 50), quantity: 1, price: amount }],
      buyerName: student.name || '',
    });
  } catch (err) {
    console.error('PayOS createPaymentLink error:', err);
    return { error: 'Không thể tạo đơn thanh toán. Vui lòng thử lại.' };
  }

  const { bin, accountNumber, accountName, checkoutUrl, qrCode } = paymentLink;

  // Tạo enrollment pending (nếu chưa có)
  let enrollmentId;
  if (existEnrollSnap.empty) {
    const enrollRef = await enrollmentsCol.add({
      courseId,
      studentAccountId: student.accountId,
      studentName: student.name || '',
      paymentStatus: 'pending',
      status: 'pending',
      totalLessons: course.totalLessons || 0,
      progressPercent: 0,
      completedLessons: 0,
      enrolledAt: new Date(),
      completedAt: null,
    });
    enrollmentId = enrollRef.id;
  } else {
    enrollmentId = existEnrollSnap.docs[0].id;
  }

  // Lưu payment record
  await paymentsCol.add({
    orderCode,
    courseId,
    enrollmentId,
    studentAccountId: student.accountId,
    studentName: student.name || '',
    amount,
    description,
    status: 'PENDING',
    bin,
    accountNumber,
    accountName,
    checkoutUrl: checkoutUrl || '',
    qrCode: qrCode || '',
    createdAt: new Date(),
    paidAt: null,
  });

  const qrImageUrl = buildVietQRUrl({ bin, accountNumber, accountName, amount, description });

  return {
    orderCode,
    qrImageUrl,
    checkoutUrl,
    amount,
    description,
    bank: { accountNumber, accountName, bin },
  };
};

// Kiểm tra trạng thái thanh toán (polling từ frontend)
exports.checkStatus = async (orderCode, studentAccountId) => {
  const numCode = Number(orderCode);

  // Tìm payment record trong Firestore
  const paySnap = await paymentsCol
    .where('orderCode', '==', numCode)
    .limit(1)
    .get();

  if (paySnap.empty) return { status: 'NOT_FOUND' };
  const payment = docToObj(paySnap.docs[0]);

  // Chỉ cho phép student của đơn này truy vấn
  if (payment.studentAccountId !== studentAccountId) return { status: 'FORBIDDEN' };

  // Nếu đã paid, trả về ngay không cần gọi PayOS
  if (payment.status === 'PAID') return { status: 'PAID' };
  if (payment.status === 'CANCELLED') return { status: 'CANCELLED' };
  if (payment.status === 'EXPIRED') return { status: 'EXPIRED' };

  // Gọi PayOS để kiểm tra
  let payosInfo;
  try {
    const payos = getPayOSClient();
    payosInfo = await payos.getPaymentLinkInformation(numCode);
  } catch (err) {
    console.error('PayOS getPaymentLinkInformation error:', err);
    return { status: 'PENDING' };
  }

  const newStatus = payosInfo.status; // 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'

  if (newStatus === 'PAID') {
    // Kích hoạt enrollment
    await Promise.all([
      paymentsCol.doc(payment._id).update({ status: 'PAID', paidAt: new Date() }),
      enrollmentsCol.doc(payment.enrollmentId).update({
        status: 'active',
        paymentStatus: 'paid',
        paidAt: new Date(),
      }),
      coursesCol.doc(payment.courseId).update({
        totalStudents: admin.firestore.FieldValue.increment(1),
      }),
    ]);
    return { status: 'PAID' };
  }

  if (newStatus !== 'PENDING') {
    await paymentsCol.doc(payment._id).update({ status: newStatus });
  }

  return { status: newStatus };
};

// Xử lý webhook PayOS (tự động khi có thanh toán thành công)
exports.handleWebhook = async (webhookBody) => {
  const payos = getPayOSClient();

  let data;
  try {
    data = payos.verifyPaymentWebhookData(webhookBody);
  } catch (err) {
    console.error('PayOS webhook verify error:', err);
    return { success: false };
  }

  if (!data || data.code !== '00') return { success: true }; // Ping test từ PayOS

  const orderCode = Number(data.orderCode);

  const paySnap = await paymentsCol
    .where('orderCode', '==', orderCode)
    .limit(1)
    .get();

  if (paySnap.empty) return { success: true };
  const payment = docToObj(paySnap.docs[0]);

  if (payment.status === 'PAID') return { success: true }; // đã xử lý rồi

  await Promise.all([
    paymentsCol.doc(payment._id).update({ status: 'PAID', paidAt: new Date() }),
    enrollmentsCol.doc(payment.enrollmentId).update({
      status: 'active',
      paymentStatus: 'paid',
      paidAt: new Date(),
    }),
    coursesCol.doc(payment.courseId).update({
      totalStudents: admin.firestore.FieldValue.increment(1),
    }),
  ]);

  return { success: true };
};
