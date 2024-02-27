import AppointmentModel from "../models/appointmentModel.js";
import EmployeeModel from "../models/employeeModels.js";
import ServiceModel from "../models/serviceModels.js";
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
    const allAppointments = await AppointmentModel.find()
      .populate({
        path: "services",
        populate: [
          { path: "employeeId", model: EmployeeModel },
          { path: "serviceIds", model: ServiceModel },
        ],
      })
      .exec();
    console.log(allAppointments);
    return res.status(200).json(allAppointments);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getOneAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }

    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getClientAppointment = async (req, res) => {
  try {
    const clientId = req.params.id;

    const appointment = await AppointmentModel.find({
      clientId: clientId,
    }).populate({
      path: "services",
      populate: [
        {
          path: "employeeId",
          model: EmployeeModel,
          select: ["firstName", "lastName"],
        },
        {
          path: "serviceIds",
          model: ServiceModel,
          select: "name",
        },
      ],
    });

    if (!appointment) {
      return res.status(404).send("No appointment scheduled for this client");
    }

    return res.status(200).send(appointment);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getEmployeeTasks = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const tasks = await AppointmentModel.find({
      "services.employeeId": employeeId,
    })
      .populate({
        path: "services",
        populate: [
          {
            path: "serviceIds",
            model: ServiceModel,
            select: { name: 1, _id: 0 },
          },
        ],
      })
      .populate({
        path: "clientId",
        select: { firstName: 1, lastName: 1, _id: 0 },
      });

    if (!tasks) {
      return res.status(404).send("no tasks found");
    }

    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
