import { JWT_KEY } from "../config/config.js";
import jwt from "jsonwebtoken"
import { tokenVerify } from "../utility/tokenUtility.js";

export const authMiddleware = (req, res, next) =>{
    const token = req.cookies["Token"];
    if(!token){
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try {
        const decoded = tokenVerify(token);
        req.student = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message:"invalid_token"});
    }
}