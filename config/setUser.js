import { jwt } from "jsonwebtoken";

export const setUser = (req, res ,next)=>{
    if (req.cookies) {
        const { rdi } = req.cookies
        if (rdi) {
            try {
                const payload = jwt.verify(rdi, "secret")
                req.user = payload
    
            } catch (error) {
                res.clearCookie("rdi")
            }
        }
        next()
    }
}