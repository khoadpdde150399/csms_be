const { Op } = require("sequelize");

const Coupon = require('../models/codediscount');

let create = async (req, res, next) => {
    let code = req.body.code;
    if (code === undefined) return res.status(400).send('The code field does not exist.');
    let status = req.body.status;
    if (status === undefined) return res.status(400).send(' status not exists');
    let money = parseInt(req.body.money);
    if (money === undefined) return res.status(400).send(' money not exists');
    let end_at = req.body.end_at;
    if (end_at === undefined) return res.status(400).send(' end_at not exists');
    let quantity = parseInt(req.body.quantity);
    if (quantity === undefined) return res.status(400).send(' quantity not exists');
    try {
        let newProduct = await Coupon.create({ code, status, money, end_at, quantity });
        return res.send(newProduct);
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
}

let listAdminSide = async (req, res, next) => {
    let listCoupon = await Coupon.findAll({
        attributes: ['id','code', 'money', 'status', 'created_at', 'end_at', 'quantity'],
        order: [['created_at', 'DESC']]
    });
    return res.send(listCoupon);
}

let listCustomer = async (req, res, next) => {
    let whereClause = {};
    whereClause.status = 1;
    let listCoupon = await Coupon.findAll({
        attributes: ['id','code', 'money', 'status', 'created_at','end_at', 'quantity'],
        order: [['created_at', 'DESC']],
        where: whereClause
    });
    return res.send(listCoupon);
}

let onStatus = async (req, res, next) => {
    try {
        let id = req.body.id;
        if (id === undefined) return res.status(400).send(' id not exists');
        await Coupon.update(
            { status: 1 },
            { where: { id: id } }
        )
        return res.send({ message: 'Disable coupon success!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error');
    }
}

let offStatus = async (req, res, next) => {
    try {
        let id = req.body.id;
        if (id === undefined) return res.status(400).send(' id not exists');
        await Coupon.update(
            { status: 0 },
            { where: { id: id } }
        )
        return res.send({ message: 'Active coupon success!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error');
    }
}


let deleteCoupon = async (req, res, next) => {
    let id = req.body.id;
    if (id === undefined) return res.status(400).send(' id not exists');
    try {
        await Coupon.destroy(
            { where: { id: id } }
        )
        return res.send({ message: 'Delete Product Variant success' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error');
    }
}

let update = async (req, res, next) => {
        let id = parseInt(req.body.id);
        if (id === undefined) return res.status(400).send(' id not exists');
        let money = parseInt(req.body.money);
        if (money === undefined) return res.status(400).send(' money not exists');
        let code = req.body.code;
        if (code === undefined) return res.status(400).send(' code not exists');
        let end_at = req.body.end_at;
        if (end_at === undefined) return res.status(400).send(' end_at not exists');
        let quantity = parseInt(req.body.quantity);
        if (quantity === undefined) return res.status(400).send(' quantity not exists');
        try {
            await Coupon.update(
                { money: money, code: code ,end_at:end_at,quantity:quantity },
                { where: { id: id } }
            )
            return res.send({ message: 'Update success!' })
        } catch (err) {
            console.log(err)
            return res.status(500).send('Error');
        }
}

let detailAdminSide = async (req, res, next) => {
    let id = req.params.id;
    if (id === undefined) return res.status(400).send(' id not exists');

    try {
        let couponDetail = await Coupon.findOne({
            attributes: ['id', 'money', 'code','end_at', 'quantity' ],
            where: { id },
        });
        if (couponDetail) {
            return res.send(couponDetail);
        } else {
            return res.status(400).send('Counpo not exists');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Error');
    }
}

module.exports = {
    create,
    listAdminSide,
    listCustomer,
    onStatus,
    offStatus,
    deleteCoupon,
    update,
    detailAdminSide
};