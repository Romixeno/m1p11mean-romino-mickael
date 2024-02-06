import express from "express"
import expressEjsLayouts from "express-ejs-layouts"
import fileUpload  from "express-fileupload"
import session from "express-session"
import flash from 'connect-flash'
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { mongooseConnect } from "./config/database.js"
import securityRoute from "./ressources/securityRoute.js"
import serviceRoute from "./ressources/serviceRoute.js"
import preferenceRoute from "./ressources/preferenceRoute.js"
import remindRoute from "./ressources/remindRoute.js"
import payementRoute from "./ressources/payementRoute.js"

const app = express()

app.use(expressEjsLayouts)
app.use(bodyParser.urlencoded({extended:false}))
app.set(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload())
app.use(express.static(path.resolve('public')))
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge:30*24*3600*1000
    }
}))
app.use(flash())

//middleware

app.use((req ,res ,next)=>{
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    res.locals.user = req.user ? req.user:null
    next()
})

//connection a la base de donner

mongooseConnect().then(()=>{

    app.use('/',securityRoute)
    app.use('/',serviceRoute)
    app.use('/',preferenceRoute)
    app.use('/',remindRoute)
    app.use('/',payementRoute)

    app.listen(3001,()=>{
        console.log('http://localhost:3001');
    })
})
