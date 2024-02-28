import Payment from "../models/payementModels.js";
import { captureOrder, createOrder } from "../utils/payment.js";

export const createPayment = async (req, res) => {
  try {
    // const { client, service, amount } = req.body;
    const { client, appointmentId, amount, transactionId } = req.body;

    const newPayment = new Payment({
      client,
      appointmentId,
      amount,
      transactionId,
    });

    await newPayment.save();

    res.status(201).json(newPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: "client",
      select: {
        firstName: 1,
        lastName: 1,
        _id: 0,
      },
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const order = async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

export const capture = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};
