import Appointment from '../models/remindAppointmentModels.js';

export const getAverageWorkTimeForEmployees = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const appointments = await Appointment.find({ employer: employeeId });

        const employeeWorkTimes = {};

        appointments.forEach(appointment => {
            if (!employeeWorkTimes[employeeId]) {
                employeeWorkTimes[employeeId] = {
                    totalWorkTime: 0,
                    appointmentCount: 0
                };
            }

            const workTime = appointment.endTime - appointment.startTime;
            employeeWorkTimes[employeeId].totalWorkTime += workTime;
            employeeWorkTimes[employeeId].appointmentCount++;
        });

        const averageWorkTimes = {};
        for (const employeeId in employeeWorkTimes) {
            averageWorkTimes[employeeId] = employeeWorkTimes[employeeId].totalWorkTime / employeeWorkTimes[employeeId].appointmentCount;
        }

        res.json(averageWorkTimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}