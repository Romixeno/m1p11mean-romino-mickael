import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import Client from '../models/clientModels.js'
import Employee from '../models/employeeModels.js'
import Manager from '../models/managerModels.js'
import Joi from 'joi'

const registerSchema = Joi.object({

    name: Joi.string().not('').required(),
    lastname: Joi.string().not('').required(),
    numberPhone: Joi.string().pattern(/^[0-9]+$/).required(),
    email: Joi.string().email().not('').required(),
    password: Joi.string().not('').min(8).max(70).required(),
    confirmation: Joi.string().valid(Joi.ref('password')).required()

})

export const register = async (req, res) => {
    try {
        const roles = req.params.roles;
        const { error, value } = registerSchema.validate(req.body)
        if (error) {
            req.flash('error', error.message)
            return res.status(400).json({ error: error.message })
        }

        const { name, lastname, numberPhone, email, password, confirmation } = value
        const hashedPassword = await bcrypt.hash(password, 8);

        const emailExists = await isEmailRegistered(email, roles);
        
        delete value.confirmation

        if (emailExists) {
            return res.status(409).json({ error: 'Invalide email' });
        }

        let newUser;

        switch (roles) {
            case 'client':
                newUser = new Client({ name, lastname, password: hashedPassword, email, confirmation, numberPhone });
                break;
            case 'employee':
                newUser = new Employee({ name, lastname, password: hashedPassword, email, confirmation, numberPhone });
                break;
            case 'manager':
                newUser = new Manager({ name, lastname, password: hashedPassword, email, confirmation, numberPhone });
                break;
            default:
                return res.status(400).json({ error: 'Invalid role' });
        }
        
        await newUser.save();

        console.log('user save succesfull');
        res.status(201).json({ message: `${roles} registered successfully`, user: newUser.toObject() });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    // validation e-mail

    async function isEmailRegistered(email, roles) {
        let user;

        switch (roles) {
            case 'client':
                user = await Client.findOne({ email });
                break;
            case 'employee':
                user = await Employee.findOne({ email });
                break;
            case 'manager':
                user = await Manager.findOne({ email });
                break;
            default:
                throw new Error('Invalid role');
        }

        return !!user;
    }
}

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

export const login = async ( req ,res)=>{
    try {
        const { error, value } = signInSchema.validate(req.body);
        
        if (error) {
          return res.status(400).json({ error: error.message });
        }
       
        const {email ,password}=value
        const roles = req.params.roles

        //les choix des roles
        let userRole
        switch(roles){
            case 'client':
                userRole = Client
                break
            case 'employee':
                userRole = Employee
                break
            case 'manager':
                userRole = Manager
                break  
            default:
                return res.status(400).json({error:'Invalide role'})  
        }
        //validation user
        const user = await userRole.findOne({email})
        if(!user){
            return res.status(401).json({error:"Invalide credentials"})
        }
        //validation password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        //jeton jwt
        delete user.password

        try {
            const token = jwt.sign({userId: user._id, roles}, "secret", {expiresIn: "30d"});
        
            res.cookie("rdi", token, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                secure: true, 
            });
        
            res.status(200).json({user: user});
        } catch (error) {
            console.error('Error creating token or setting cookie:', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const logout = (req ,res)=>{
    return res.status(200).clearCookie("rdi").json({message:'logout_user'})
}

export const profil = (req ,res)=>{
    return res.status(200).json({user:req.user})
}
