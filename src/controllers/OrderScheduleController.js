const OrderSchedule = require('../models/orderschedule');
const Order = require('../models/order');
const User = require('../models/user');
const Customer = require('../models/customer_info')
const dayjs = require('dayjs');
const { sequelize } = require('../configs/database');
const Order_Status_Change_History = require('../models/order_status_change_history');
// Tạo lịch trình cho một đơn hàng

let createOrderSchedule = async (req, res, next) => {
    const { order_id, status, estimated_delivery_time, actual_delivery_time, notes } = req.body;

    const user_id = req.body.admin_id;
    console.log("user_id",user_id);

    const order = await Order.findOne({ where: { order_id } });
    if (!order) return res.status(404).send({ message: 'Order not found' });

    const user = await Customer.findOne({ where: { user_id } });
    if (!user) return res.status(404).send({ message: 'User not found' });

    try {
        const newSchedule = await OrderSchedule.create({
            order_id,
            timestamp: dayjs().toISOString(),
            status,
            estimated_delivery_time,
            actual_delivery_time,
            shipper_name: user.customer_name, // Dùng tên từ đối tượng user
            shipper_contact: user.phone_number, // Dùng thông tin liên hệ từ đối tượng user
            notes,
        });

        return res.status(201).send(newSchedule);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error creating order schedule' });
    }
};

module.exports = { createOrderSchedule };

// Lấy danh sách lịch trình của một đơn hàng
let listOrderSchedules = async (req, res, next) => {
    const { order_id } = req.params;

    try {
        const schedules = await OrderSchedule.findAll({
            where: { order_id },
            order: [['timestamp', 'DESC']] // Thêm điều kiện sắp xếp theo timestamp giảm dần
        });
        return res.send(schedules);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching order schedules' });
    }
};
let updateOrderSchedule = async (req, res, next) => {
    const { schedule_id } = req.params;
    const updateData = req.body;

    try {
        const [updated] = await OrderSchedule.update(updateData, { where: { schedule_id } });

        if (updated) {
            const updatedSchedule = await OrderSchedule.findOne({ where: { schedule_id } });
            return res.send(updatedSchedule);
        }

        return res.status(404).send({ message: 'Schedule not found' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating order schedule' });
    }
};

let deleteOrderSchedule = async (req, res, next) => {
    const { schedule_id } = req.params;

    try {
        const deleted = await OrderSchedule.destroy({ where: { schedule_id } });

        if (deleted) {
            return res.send({ message: 'Schedule deleted successfully' });
        }

        return res.status(404).send({ message: 'Schedule not found' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting order schedule' });
    }
};

let listOrdersForShipper = async (req, res, next) => {
    const user_id = req.query.admin_id; // Lấy admin_id từ params
    
    if (!user_id) {
        return res.status(400).send({ message: 'Admin ID not provided' });
    }

    try {
        const admin = await User.findOne({ where: { user_id } }); // Tìm user dựa trên admin_id
        if (admin == null) {
            return res.status(400).send('Admin not found');
        }
    console.log ("admin.role_id",admin.role_id);
        // Kiểm tra role của shipper
        let shippingUnit = null;
        // Giả sử bạn có triển khai phân quyền cho admin ở đây
        // Ví dụ: 
        if (admin.role_id === 4) {
            shippingUnit = 'J&T express';
        } else if (admin.role_id === 5) {
            shippingUnit = 'Viettel';
        } else {
            return res.status(403).send('Access denied');
        }

        // Lấy danh sách đơn hàng
        const orders = await Order.findAll({
            where: { 
                shipping: shippingUnit 
            },
            attributes: [
                'order_id', 
                'customer_name', 
                'total_order_value', 
                'address', 
                'phone_number',
                [sequelize.fn('MAX', sequelize.col('Order_Status_Change_Histories.created_at')), 'created_at']
            ],
            include: [{
                model: Order_Status_Change_History,
                attributes: ['state_id', 'created_at'],
                required: true
            }],
            group: [
                'Order.order_id', 
                'Order.customer_name', 
                'Order.total_order_value', 
                'Order.address', 
                'Order.phone_number'
            ],
            having: sequelize.literal('MAX(Order_Status_Change_Histories.state_id) = 3'),
            order: [[sequelize.fn('MAX', sequelize.col('Order_Status_Change_Histories.created_at')), 'DESC']]
        });
    console.log("orders",orders);
        return res.send(orders);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching orders for shipper' });
    }
};
let listOrdersForShipperDeliver = async (req, res, next) => {
    // const user_id = req.token.customer_id; // Lấy user_id từ token
    const user_id = req.query.admin_id; // Lấy admin_id từ params

    console.log('admin_id', user_id);
    
    if (!user_id) {
        return res.status(400).send({ message: 'Invalid Access Token' });
    }

    try {
        const user = await User.findOne({ where: { user_id } });
        if (user == null) {
            return res.status(400).send('User not found');
        }
        
console.log ("user.role_id",user.role_id);
        // Kiểm tra role của shipper
        let shippingUnit = null;
        if (user.role_id === 4) {
            shippingUnit = 'J&T express';
        } else if (user.role_id === 5) {
            shippingUnit = 'Viettel';
        } else {
            return res.status(403).send('Access denied');
        }

        // Lấy danh sách đơn hàng
        const orders = await Order.findAll({
            where: { 
                shipping: shippingUnit 
            },
            attributes: [
                'order_id', 
                'customer_name', 
                'total_order_value', 
                'address', 
                'phone_number',
                [sequelize.fn('MAX', sequelize.col('Order_Status_Change_Histories.created_at')), 'created_at']
            ],
            include: [{
                model: Order_Status_Change_History,
                attributes: ['state_id', 'created_at'],
                required: true
            }],
            group: [
                'Order.order_id', 
                'Order.customer_name', 
                'Order.total_order_value', 
                'Order.address', 
                'Order.phone_number'
            ],
            having: sequelize.literal('MAX(Order_Status_Change_Histories.state_id) = 4'),
            order: [[sequelize.fn('MAX', sequelize.col('Order_Status_Change_Histories.created_at')), 'DESC']]
        });

        return res.send(orders);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error fetching orders for shipper' });
    }
};
let updateOrderState = async (req, res, next) => {
    const { order_id } = req.params;
    const new_state_id = 4; // Trạng thái "Delivered"

    try {
        const latestStatusChange = await Order_Status_Change_History.findOne({
            where: { order_id },
            order: [['created_at', 'DESC']]
        });

        if (!latestStatusChange) {
            return res.status(404).send({ message: 'Order status history not found' });
        }

        // Tạo một bản ghi mới với trạng thái mới
        await Order_Status_Change_History.create({
            order_id,
            state_id: new_state_id,
            created_at: new Date()
        });
        return res.send({ message: 'Order state updated successfully to Delivered' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating order state' });
    }
};
module.exports = {
    createOrderSchedule,
    listOrderSchedules,
    updateOrderSchedule,
    deleteOrderSchedule,
    listOrdersForShipper,
    updateOrderState,
    listOrdersForShipperDeliver
};