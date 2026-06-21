const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');
const { jwtAuthentication } = require('../middlewares/passport.middleware');

// Webhook PayOS (không cần auth, phải đặt trước các route có auth)
router.post('/webhook', paymentController.webhook);

// Tạo đơn thanh toán
router.post('/create-order', jwtAuthentication, paymentController.createOrder);

// Kiểm tra trạng thái đơn (polling từ frontend)
router.get('/check/:orderCode', jwtAuthentication, paymentController.checkStatus);

module.exports = router;
