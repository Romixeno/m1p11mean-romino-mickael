import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import User from '../models/usersModels.js'
import Joi from 'joi'

const registerSchema = Joi.object({

    name: Joi.string().not('').required(),
    lastname: Joi.string().not('').required(),
    numberPhone: Joi.string().pattern(/^[0-9]+$/).required(),
    email: Joi.string().email().not('').required(),
    password: Joi.string().not('').min(8).max(70).required(),
    confirmation: Joi.string().valid(Joi.ref('password')).required(),
    userType: Joi.string().valid('Client', 'Employee', 'Manager').default('Client').required(),
})

export const register = async (req, res) => {
    try {

        const { error, value } = registerSchema.validate(req.body)
        if (error) {
            req.flash('error', error.message)
            return res.status(400).json({ error: error.message })
        }
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(value.password, 8);


        delete value.confirmation

        const newClient = new User({
            name: value.name,
            lastname: value.lastname,
            email: value.email,
            password: hashedPassword,
            numberPhone: value.numberPhone,
            userType: value.userType,
        });

        const savedClient = await newClient.save();

        res.status(201).json(savedClient);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const login = async (req, res) => {
    try {
        const { error, value } = signInSchema.validate(req.body);

        if (error) {
            req.flash('error', error.message);
            return res.status(400).json({ error: error.message });
        }
        //validation user
        const user = await User.findOne({ email: value.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        //validation password
        const passwordMatch = await bcrypt.compare(value.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        //jeton jwt
        delete user.password

        try {
            const token = jwt.sign({ userId: user._id, userType: user.userType }, "secret", { expiresIn: "30d" });

            res.cookie("rdi", token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true,
            });

            res.status(200).json({ user: user });
        } catch (error) {
            console.error('Error creating token or setting cookie:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const logout = (req, res) => {
    return res.status(200).clearCookie("rdi").json({ message: 'logout_user' })
}

export const profil = (req, res) => {
    return res.status(200).json({ user: req.user })
}
