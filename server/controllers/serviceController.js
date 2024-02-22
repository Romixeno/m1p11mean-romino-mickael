import Joi from "joi";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import mongoose from "mongoose";
import Service from "../models/serviceModels.js";

export const serviceSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  duration: Joi.number().min(1).required(),
  description: Joi.string().required(),
  commission: Joi.number().min(0).required(),
});

export const addService = async (req, res) => {
  try {
    // Validation des données avec Joi
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    // value._clientId = value._clientId
    //   ? mongoose.Types.ObjectId(value._clientId)
    //   : null;
    // value._employeeId = value._employeeId
    //   ? mongoose.Types.ObjectId(value._employeeId)
    //   : null;

    if (!fs.existsSync("public")) {
      fs.mkdir("public", (err) => {
        if (err) {
          console.error("Error creating directory:", err);
        }
      });
    }
    if (!req.files) {
      return res.status(400).json({ error: "Image is required" });
    }
    const { image } = req.files;
    const newFileName =
      "/images/IMG-" +
      Date.now() +
      crypto.randomInt(1000, 999999) +
      path.extname(image.name);
    image.mv("public" + newFileName, (e) => {
      if (e) {
        console.log(e);
      }
    });
    value.image = newFileName;
    const data = new Service({
      ...value,
    });

    const saveService = await data.save();

    res.status(201).json(saveService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//service par Id
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//  récupérer un service par ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//update service

export const updateService = async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const imagesDir = path.join("public", "images");

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
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

        fs.unlinkSync(path.join("public", service.image)); // Supprimer l'ancienne image
        service.image = newFileName;
        service.set(value);
        service
          .save()
          .then((updatedService) => res.json(updatedService))
          .catch((updateError) =>
            res
              .status(500)
              .json({ error: "Error during service update", updateError })
          );
      });
    } else {
      service.set(value);
      service
        .save()
        .then((updatedService) => res.json(updatedService))
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

//delete service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    fs.unlinkSync(path.join("public", service.image));

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const serviceTypeSchema = Joi.object({
  name: Joi.string().required(),
});
export const addServiceType = async (req, res) => {
  try {
    const { error, value } = serviceTypeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const serviceTypeVerify = ServiceType.findOne({ name: value.name });
    if (serviceTypeVerify) {
      return res.status(403).send("This serviceType already exists");
    }

    const data = new ServiceType({ name: value.name });

    const savedServiceType = await data.save();
    res.status(201).send(savedServiceType);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getAllServiceTypes = async (req, res) => {
  try {
    const servicesType = await ServiceType.find();

    res.status(200).send(servicesType);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
