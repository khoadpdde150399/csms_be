const express = require('express');
const orderScheduleController = require('../controllers/OrderScheduleController');
const router = express.Router();
const jwtAuth = require('../midlewares/jwtAuth');
// Tạo lịch trình cho một đơn hàng
// router.post('/', OrderScheduleController.createOrderSchedule); // Thêm middleware jwtAuth

// Lấy danh sách lịch trình của một đơn hàng
router.get('/:order_id', orderScheduleController.listOrderSchedules); // Thêm middleware jwtAuth

// Cập nhật lịch trình của một đơn hàng
router.put('/:schedule_id', orderScheduleController.updateOrderSchedule); // Thêm middleware jwtAuth

// Xóa lịch trình của một đơn hàng
router.delete('/:schedule_id', orderScheduleController.deleteOrderSchedule); // Thêm middleware jwtAuth

// Lấy danh sách đơn hàng cho shipper
router.get('/shipper', orderScheduleController.listOrdersForShipper); // Thêm middleware jwtAuth

module.exports = router;