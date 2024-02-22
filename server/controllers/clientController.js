import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Client from "../models/clientModels.js";
import Joi from "joi";

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
