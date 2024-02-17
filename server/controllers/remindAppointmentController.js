import Appointment from "../models/remindAppointmentModels.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import "dotenv/config";

// Fonction pour créer un nouveau rendez-vous
export const createAppointment = async (req, res) => {
  try {
    const { date, _serviceId, _employeeId, _clientId } = req.body;
    const newAppointment = new Appointment({
      client: _clientId,
      date,
      _serviceId,
      _employeeId,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const sendReminderEmail = async (appointment) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "kamirakoto2001@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.RFT,
        accessToken: process.env.ACT,
      },
    });

    const mailOptions = {
      from: "kamirakoto2001@gmail.com",
      to: appointment.client.email,
      subject: "Rappel de rendez-vous",
      text: `Rappel: Vous avez un rendez-vous prévu le ${appointment.date}.`,
      html: ` <div style="background-color:black;width:400px;height:400px">
            <p style="color: aliceblue;">votre rendez vous apres 24h</p>
        </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Reminder email sent:", info.response);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
};

cron.schedule("0 * * * *", async () => {
  try {
    const appointments = await Appointment.find({ sentEmail: false });

    appointments.forEach(async (appointment) => {
      const oneHourBefore = new Date(
        appointment.date.getTime() - 60 * 60 * 1000
      );
      const now = new Date();
      if (now >= oneHourBefore && now < appointment.date) {
        await sendReminderEmail(appointment);
        appointment.sentEmail = true;
        await appointment.save();
      }
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
  }
});
