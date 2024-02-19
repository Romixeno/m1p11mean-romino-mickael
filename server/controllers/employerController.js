import Employer from "../models/employeeModels.js";
import Joi from "joi";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcrypt";
//create employer
const employerSchema = Joi.object({
  specialty: Joi.string().valid("Hair", "Nail", "Makeup", "Skin").required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  workingHours: Joi.string().required(),
  commission: Joi.number().required(),
});

export const createEmployee = async (req, res) => {
  try {
    console.log(req.body);
    const { error, value } = employerSchema.validate(req.body);
    console.log(value);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!fs.existsSync("public")) {
      fs.mkdir("public", (err) => {
        if (err) {
          console.error("Error creating directory:", err);
        }
      });
    }
    if (!req.files) {
      return res.status(400).json({ error: "fields images is required" });
    }
    const { image } = req.files;
    const newFileName =
      "/employer/IMG-" +
      Date.now() +
      crypto.randomInt(1000, 999999) +
      path.extname(image.name);
    image.mv("public" + newFileName, (e) => {
      if (e) {
        console.log(e);
      }
    });
    value.image = newFileName;
    //---------------------------- employee will always have 123 password in the beginning they can change it in their profile
    const firstPassword = "123";
    const hashedPassword = bcrypt.hashSync(firstPassword, 8);
    // ---------------------------------------------------------------------------------------------------------
    const workingHours = JSON.parse(value.workingHours);
    // ---------------------------------------------------------------------------------------------------------
    const realValue = {
      ...value,
      workingHours: workingHours,
      password: hashedPassword,
    };
    console.log(realValue);
    const data = new Employer({
      ...realValue,
    });

    const newEmployee = await data.save();

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Lire les détails d'un employé
export const getOneEmployee = async (req, res) => {
  try {
    const { _id } = req.params;
    const employee = await Employer.findById(_id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//get all
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employer.find();

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//update
export const updateEmployee = async (req, res) => {
  try {
    const { error, value } = employerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const workingHours = JSON.parse(value.workingHours);
    const realValue = {
      ...value,
      workingHours: workingHours,
    };

    const imagesDir = path.join("public", "employer");

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const employee = await Employer.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Service not found" });
    }

    if (req.files && req.files.image) {
      const { image } = req.files;
      const newFileName =
        "/employer/IMG-" +
        Date.now() +
        crypto.randomInt(1000, 999999) +
        path.extname(image.name);

      image.mv(path.join("public", newFileName), (e) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ error: "Error during file upload" });
        }

        fs.unlinkSync(path.join("public", employee.image)); // Supprimer l'ancienne image
        employee.image = newFileName;

        employee.set(realValue);
        employee
          .save()
          .then((updatedEmployee) => res.json(updatedEmployee))
          .catch((updateError) =>
            res
              .status(500)
              .json({ error: "Error during service update", updateError })
          );
      });
    } else {
      employee.set(realValue);
      employee
        .save()
        .then((updatedEmployee) => res.json(updatedEmployee))
        .catch((updateError) =>
          res
            .status(500)
            .json({ error: "Error during service update", updateError })
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//delete
// Supprimer un employé
export const deleteEmployee = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedEmployee = await Employer.findByIdAndDelete(_id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
