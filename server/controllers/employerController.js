import Employer from "../models/employeeModels.js";
import Joi from 'joi'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

//create employer
const employerSchema = Joi.object({

    name: Joi.string().not('').required(),
    lastname: Joi.string().not('').required(),
    workingHours: Joi.string().not('').required(),
    numberPhone: Joi.string().pattern(/^[0-9]+$/).required(),
    email: Joi.string().email().not('').required(),
})
export const createEmployee = async (req, res) => {
    try {
        const { error, value } = employerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        value.clientId = value.clientId ? mongoose.Types.ObjectId(value.clientId) : null;
        value.employeeId = value.employeeId ? mongoose.Types.ObjectId(value.employeeId) : null;
        if (!fs.existsSync('public')) {
            fs.mkdir('public', (err) => {
                if (err) {
                    console.error('Error creating directory:', err);
                }
            });
        }
        if (!req.files) {
            return res.status(400).json({ message: ' fields images is requires' })
        }
        const { image } = req.files
        const newFileName = '/employer/IMG-' + Date.now() + crypto.randomInt(1000, 999999) + path.extname(image.name)
        image.mv('public' + newFileName, (e) => {
            if (e) {
                console.log(e);
            }
        })
        value.image = newFileName
        const data = new Employer({
            ...value,
        })

        const newEmployee = await data.save()

        res.status(201).json(newEmployee)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Lire les détails d'un employé
export const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employer.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//get all
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employer.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//update
export const updateEmployee = async (req, res) => {
    try {
        const { error, value } = employerSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: error.message });
        }
  
        const imagesDir = path.join('public', 'employer');
    
        if (!fs.existsSync(imagesDir)) {
          fs.mkdirSync(imagesDir, { recursive: true });
        }
    
        const employee = await Employer.findById(req.params.id);
        if (!employee) {
          return res.status(404).json({ error: 'Service not found' });
        }
    
        if (req.files && req.files.image) {
          const { image } = req.files;
          const newFileName =
            '/employer/IMG-' + Date.now() + crypto.randomInt(1000, 999999) + path.extname(image.name);
    
          image.mv(path.join('public', newFileName), (e) => {
            if (e) {
              console.log(e);
              return res.status(500).json({ error: 'Error during file upload' });
            }
    
            fs.unlinkSync(path.join('public', employee.image)); // Supprimer l'ancienne image
            employee.image = newFileName;
            employee.set(value);
            employee.save()
              .then((updatedEmployee) => res.json(updatedEmployee))
              .catch((updateError) => res.status(500).json({ error: 'Error during service update', updateError }));
          });
        } else {
          service.set(value);
          service.save()
            .then((updatedEmployee) => res.json(updatedEmployee))
            .catch((updateError) => res.status(500).json({ error: 'Error during service update', updateError }));
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//delete
// Supprimer un employé
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await Employer.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};