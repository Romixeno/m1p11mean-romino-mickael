import Employer from "../models/employeeModels.js";
import Joi from "joi";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//create employer
const employerSchema = Joi.object({
  specialty: Joi.string().required(),
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
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginEmployee = async (req, res) => {
  try {
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      req.flash("error", error.message);
      return res.status(400).json({ error: error.message });
    }

    const employee = await Employer.findOne({ email: value.email });
    if (!employee) {
      return res.status(404).send("User not found");
    }

    const verifyPassword = await bcrypt.compare(
      value.password,
      employee.password
    );
    if (!verifyPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    delete employee.password;
    try {
      const token = jwt.sign(
        { userId: employee._id, userType: employee.userType },
        "secret",
        { expiresIn: "30d" }
      );
      res.cookie("rdi", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
      });

      res.status(200).send(employee);
    } catch (error) {
      console.error("Error creating token or setting cookie:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutEmployee = async (req, res) => {
  return res
    .status(200)
    .clearCookie("rdi")
    .json({ message: "logout_employee" });
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const imagesDir = path.join("public", "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    const employee = await Employer.findById(req.params._id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    if (req.files && req.files.image) {
      const { image } = req.files;
      const newFileName =
        "/images/IMG-" +
        Date.now() +
        crypto.randomInt(1000, 999999) +
        path.extname(image.name);
      image.mv(path.join("public", newFileName), (e) => {
        if (e) {
          console.log(e);
          return res.status(500).json({ error: "Error during file upload" });
        }

        fs.unlinkSync(path.join("public", employee.image));

        employee.image = newFileName;
        employee.set(req.body);
        employee
          .save()
          .then((updatedEmployee) => res.json(updatedEmployee))
          .catch((updateError) =>
            res
              .status(500)
              .json({ error: "Error during Employee update", updateError })
          );
      });
    } else {
      employee.set(req.body);
      employee
        .save()
        .then((updatedEmployee) => res.json(updatedEmployee))
        .catch((updateError) =>
          res
            .status(500)
            .json({ error: "Error during Employee update", updateError })
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
