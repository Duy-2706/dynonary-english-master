const paymentService = require('../services/payment.service');

exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'Thiếu courseId.' });

    const student = req.user;
    const result = await paymentService.createOrder(courseId, student);

    if (result.error) return res.status(400).json({ message: result.error });
    return res.status(200).json(result);
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ message: err.message || 'Lỗi server.' });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const result = await paymentService.checkStatus(orderCode, req.user.accountId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('checkStatus error:', err);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

// Webhook từ PayOS (không cần JWT auth)
exports.webhook = async (req, res) => {
  try {
    const result = await paymentService.handleWebhook(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error('webhook error:', err);
    return res.status(200).json({ success: false }); // Luôn trả 200 cho PayOS
  }
};
