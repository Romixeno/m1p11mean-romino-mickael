import AppointmentModel from "../models/appointmentModel.js";
export const createAppointment = async (req, res) => {
  try {
    const newAppointment = new AppointmentModel(req.body);

    const savedNewAppointment = await newAppointment.save();

    return res.status(201).send(savedNewAppointment);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllAppointment = async (req, res) => {
  try {
    const allAppointments = await AppointmentModel.find();
    return res.status(200).json(allAppointments);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getOneAppointment = async (req, res) => {};