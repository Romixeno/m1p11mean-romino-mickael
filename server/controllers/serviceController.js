import Joi from 'joi'
import clientId from '../models/clientModels.js'
import Employee from '../models/employeeModels.js'
import Service from '../models/serviceModels.js'

export const serviceSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    duration: Joi.number().min(1).required(),
    commission: Joi.number().min(0).required(),
    image: Joi.string().allow(''),
    clientId: Joi.string().allow('').guid(), 
    employeeId: Joi.string().allow('').guid(), 
});

export const addService = async (req, res) => {
    try {
        const { name, price, duration, commission, image, clientId, employeeId } = req.body;

        // Validation des données avec Joi
        const { error, value } = serviceSchema.validate({ name, price, duration, commission, image, clientId, employeeId });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        // Ajout du service dans la base de données
        const newService = new Service(value);
        await newService.save();

        res.status(201).json({ message: 'Service added successfully',service: newService });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getService = async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des services' });
    }
  };
  
  //  récupérer un service par ID
  export const getServiceById = async (req, res) => {
    try {
      const serviceId = req.params.serviceId;
      const service = await Service.findOne({ serviceId });
  
      if (!service) {
        return res.status(404).json({ error: 'Service non trouvé' });
      }
  
   return res.json(service);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération du service par ID' });
    }
  };