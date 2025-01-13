const PayOS = require("@payos/node");
const Order = require('../models/order');

const payos = new PayOS(process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY);


const createPaymentUrl = async (req, res) => {
    const { orderCode, amount, description } = req.body;

    if (!orderCode || !description) {
        return res.status(400).json({ error: "orderCode and description must not be undefined or null." });
    }
    const requestData = {
        orderCode,
        amount,
        description,
        cancelUrl: "http://localhost:3001/cart",
        returnUrl: "http://localhost:3001/cart",
    };
    try {
        const paymentUrl = await payos.createPaymentLink(requestData);
        res.json(paymentUrl);
    } catch (error) {
        console.error("Error creating payment link:", error);
        console.log(amount, orderCode, description);
        res.status(500).json({ error: error.message });
    }

}
const getPaymentInformation = async (req, res) => {
    let orderCode = req.params.orderCode;
    try {
        const paymentInformation = await payos.getPaymentLinkInformation(orderCode);
        res.json(paymentInformation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const receiveHook = async (req, res) => {
   console.log(req.body);
  };
module.exports = {
    createPaymentUrl,
    getPaymentInformation,
    receiveHook
}