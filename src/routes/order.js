const express = require('express');

const OrderController = require('../controllers/OrderController');
const jwtAuth = require('../midlewares/jwtAuth');
const orderScheduleController = require('../controllers/OrderScheduleController');
let router = express.Router();

router.post('/create', jwtAuth, OrderController.create);

router.get('/admin/list', OrderController.listAdminSide);

router.get('/customer/list', jwtAuth, OrderController.listCustomerSide);

router.get('/customer/notification', jwtAuth, OrderController.listNotification);

router.get('/customer/notificationall', jwtAuth, OrderController.listNotificationAll);

router.put('/customer/notification/change-status/:id', OrderController.changeStatusNotification);

router.get('/detail/:order_id', jwtAuth, OrderController.detailCustomerSide);

router.get('/admin/detail/:order_id', OrderController.detailAdminSide);

router.put('/change-status/:order_id/:state_id', OrderController.changeStatus);

router.get('/checkdiscount/:code', OrderController.checkDiscount);

router.get('/totalPrice', OrderController.totalPrice);

router.get('/totalOrder', OrderController.totalOrder);

router.get('/totalOrderPerDay', OrderController.totalOrderPerDay);

router.get('/totalRevenuePerDay', OrderController.totalRevenuePerDay);

router.get('/shipper', orderScheduleController.listOrdersForShipper); // Thêm middleware jwtAuth

router.get('/delivered', orderScheduleController.listOrdersForShipperDeliver);

router.post('/createschedule', orderScheduleController.createOrderSchedule); // Thêm middleware jwtAuth

// Lấy danh sách lịch trình của một đơn hàng
router.get('/history/:order_id', orderScheduleController.listOrderSchedules); // Thêm middleware jwtAuth

// Cập nhật lịch trình của một đơn hàng
router.put('/updateschedule/:schedule_id', orderScheduleController.updateOrderSchedule);

router.put('/updatestate/:order_id', orderScheduleController.updateOrderState);
// Xóa lịch trình của một đơn hàng
router.delete('/deleteschedule/:schedule_id', orderScheduleController.deleteOrderSchedule); // Thêm middleware jwtAuth


module.exports = router;
