import { JWT_KEY } from "../config/config.js";
import jwt from "jsonwebtoken";

export const tokenSign = (email, id) => {
    const token = jwt.sign({ email: email, id: id }, JWT_KEY);
    return token;
};

export const tokenVerify = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        if (!decoded) {
            throw new Error("Invalid token");
        }
        return decoded;
    } catch (error) {
        return null;
    }
};
