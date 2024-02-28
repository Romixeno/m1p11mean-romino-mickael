import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Client from "../models/clientModels.js";
import Joi from "joi";
import path from "path";
import fs from "fs";
import crypto from "crypto";
const registerSchema = Joi.object({
  firstName: Joi.string().not("").required(),
  lastName: Joi.string().not("").required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  image: Joi.string().default("/images/noavatar.jpg"),
  email: Joi.string().email().not("").required(),
  password: Joi.string().not("").min(4).max(70).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  userType: Joi.string()
    .valid("Client", "Employee", "Manager")
    .default("Client"),
});

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      req.flash("error", error.message);
      return res.status(400).json({ error: error.message });
    }
    const existingClient = await Client.findOne({ email: value.email });
    if (existingClient) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(value.password, 8);

    delete value.confirmation;

    const newClient = new Client({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      image: value.image,
      password: hashedPassword,
      phoneNumber: value.phoneNumber,
      userType: value.userType,
    });

    const savedClient = await newClient.save();

    res.status(201).json(savedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const login = async (req, res) => {
  try {
    const { error, value } = signInSchema.validate(req.body);

    if (error) {
      req.flash("error", error.message);
      return res.status(400).json({ error: error.message });
    }
    //validation user
    const client = await Client.findOne({ email: value.email });

    if (!client) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //validation password
    const passwordMatch = await bcrypt.compare(value.password, client.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    //jeton jwt
    delete client.password;

    try {
      const token = jwt.sign(
        { userId: client._id, userType: client.userType },
        "secret",
        { expiresIn: "30d" }
      );

      res.cookie("rdi", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
      });

      res.status(200).json({ user: client });
    } catch (error) {
      console.error("Error creating token or setting cookie:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  return res.status(200).clearCookie("rdi").json({ message: "logout_user" });
};

export const getClientProfile = async (req, res) => {
  try {
    const { _id } = req.params;
    const client = await Client.findById(_id);

    if (!client) {
      return res.status(404).send("Client not found");
    }
    delete client.password;

    return res.status(200).send(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    const safeClients = clients.map((client) => {
      delete client.password;
      return client;
    });
    return res.status(200).send(safeClients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const imagesDir = path.join("public", "images");
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const client = await Client.findById(req.params._id);

    if (!client) {
      return res.status(404).send("Client not found");
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

        if (client.image && !client.image.includes("noavatar.jpg")) {
          if (fs.existsSync(path.join("public", client.image))) {
            fs.unlinkSync(path.join("public", client.image));
          }
        }

        client.image = newFileName;
        client.set(req.body);
        client
          .save()
          .then((updatedClient) => res.json(updatedClient))
          .catch((updateError) =>
            res
              .status(500)
              .json({ error: "Error during Client update", updateError })
          );
      });
    } else {
      client.set(req.body);
      client
        .save()
        .then((updatedClient) => res.json(updatedClient))
        .catch((updateError) =>
          res
            .status(500)
            .json({ error: "Error during Client update", updateError })
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const clientId = req.params._id;
    const client = await Client.findById(clientId);
    console.log(client);
    if (!client) {
      return res.status(404).send("Client not found");
    }

    const verifyPassword = await bcrypt.compare(
      req.body.currentPassword,
      client.password
    );

    if (!verifyPassword) {
      return res.status(401).send("Unauthorized");
    }

    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);

    client
      .set({
        password: hashedPassword,
      })
      .save()
      .then((update) => res.status(200).json(update))
      .catch((error) => res.status(500).send("Error during password update"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const addRemoveEmployeePreference = async (req, res) => {
  try {
    const clientId = req.params._clientId;
    const employeeId = req.body.employeeId;

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(401).send("Not authorized");
    }

    const isEmployeeFavorite =
      client.preferences.favoriteEmployee.includes(employeeId);

    if (!isEmployeeFavorite) {
      client.preferences.favoriteEmployee.push(employeeId);

      await client.save();

      return res.status(200).send(client.preferences);
    } else {
      const index = client.preferences.favoriteEmployee.indexOf(employeeId);

      client.preferences.favoriteEmployee.splice(index, 1);

      await client.save();
      return res.status(200).send(client.preferences);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const addRemoveServicePreference = async (req, res) => {
  try {
    const clientId = req.params._clientId;
    const serviceId = req.body.serviceId;

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(401).send("Not authorized");
    }

    const isServiceFavorite =
      client.preferences.favoriteService.includes(serviceId);

    if (!isServiceFavorite) {
      client.preferences.favoriteService.push(serviceId);

      await client.save();

      return res.status(200).send(client.preferences);
    } else {
      const index = client.preferences.favoriteService.indexOf(serviceId);

      client.preferences.favoriteService.splice(index, 1);

      await client.save();
      return res.status(200).send(client.preferences);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getClientPreference = async (req, res) => {
  try {
    const clientId = req.params._clientId;

    const clientPreference = await Client.findById(clientId).select({
      preferences: 1,
      _id: 0,
    });

    if (!clientPreference) {
      return res.status(404).send("Client not found");
    }
    let { preferences } = clientPreference;
    return res.status(200).json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
