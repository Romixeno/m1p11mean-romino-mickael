import Payment from "../models/payementModels.js";

export const createPayment = async (req, res) => {
    try {
        const { client, service, amount } = req.body;

        const newPayment = new Payment({ client , service, amount });

        await newPayment.save();

        res.status(201).json(newPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();

        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};