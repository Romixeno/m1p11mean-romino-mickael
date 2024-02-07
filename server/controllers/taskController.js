import Task from "../models/taskModels.js";
import Joi from "joi"
import mongoose from "mongoose";

const taskSchema = Joi.object({
    clientId: Joi.string().required(),
    serviceId: Joi.string().required(),
    description: Joi.string().required(),
    commissionPercentage: Joi.number().required()
});
// Contrôleur pour créer une nouvelle tâche

export const createTask = async (req, res) => {
    try {
        const { error, value } = taskSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { clientId, serviceId, description, commissionPercentage } = value;
        const newTask = new Task({ clientId, serviceId, description, commissionPercentage });
        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Contrôleur pour mettre à jour une tâche existante

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = taskSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const { clientId, serviceId, description, commissionPercentage } = value;
        const updatedTask = await Task.findByIdAndUpdate(id, {
            clientId,
            serviceId,
            description,
            commissionPercentage
        }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};