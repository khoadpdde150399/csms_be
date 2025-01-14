const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/database');
const Order = require('./order');

const OrderSchedule = sequelize.define('OrderSchedule', {
    schedule_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    order_id: { type: DataTypes.CHAR(14), allowNull: false, references: { model: Order, key: 'order_id' } },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    estimated_delivery_time: { type: DataTypes.DATE, allowNull: true },
    actual_delivery_time: { type: DataTypes.DATE, allowNull: true },
    shipper_name: { type: DataTypes.STRING, allowNull: true },
    shipper_contact: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.STRING, allowNull: true },
}, {
    timestamps: false,
});

OrderSchedule.belongsTo(Order, {
    foreignKey: { name: 'order_id', type: DataTypes.CHAR(14), allowNull: false }
});
Order.hasMany(OrderSchedule, {
    foreignKey: { name: 'order_id', type: DataTypes.CHAR(14), allowNull: false }
});

module.exports = OrderSchedule;