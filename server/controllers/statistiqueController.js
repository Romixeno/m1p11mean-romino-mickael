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
// Calcul du chiffre d'affaires par jour
export const getRevenuePerDay = async (req, res) => {
    try {
        const { date } = req.params;
        const appointments = await Appointment.find({ date: { $gte: new Date(date), $lt: new Date(date + 'T23:59:59') } }); // Récupérer tous les rendez-vous pour cette journée
        let totalRevenue = 0;
        
        appointments.forEach(appointment => {
            totalRevenue += appointment.price;
        });

        res.json({ date, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Calcul du chiffre d'affaires par mois
export const getRevenuePerMonth = async (req, res) => {
    try {
        const { month, year } = req.params; 
        const firstDayOfMonth = new Date(year, month - 1, 1); 
        const lastDayOfMonth = new Date(year, month, 0); 
        const appointments = await Appointment.find({ date: { $gte: firstDayOfMonth, $lt: lastDayOfMonth } }); 
        
        let totalRevenue = 0;
        
        appointments.forEach(appointment => {
            totalRevenue += appointment.price; 
        });

        res.json({ month, year, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}