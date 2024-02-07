import Service from '../models/serviceModels.js';
import Employee from '../models/employeeModels.js';

// Fonction pour la recherche de services par nom
export const searchServices = async (query) => {
    try {
        const services = await Service.find({ name: { $regex: query, $options: 'i' } });
        return services;
    } catch (error) {
        console.error('Error searching services:', error);
        throw new Error('Internal Server Error');
    }
};

// Fonction pour la recherche d'employés par nom
export const searchEmployees = async (query) => {
    try {
        const employees = await Employee.find({ name: { $regex: query, $options: 'i' } });
        return employees;
    } catch (error) {
        console.error('Error searching employees:', error);
        throw new Error('Internal Server Error');
    }
};