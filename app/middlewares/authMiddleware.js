import { JWT_EXPIRE_TIME } from "../config/config.js";
import { tokenSign, tokenVerify } from "../utility/tokenUtility.js";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies["Token"];
        if (!token) {
            throw new Error(`invalid token`);
        }

        const decoded = tokenVerify(token);
        if (!decoded) {
            throw new Error(`invalid token`);
        }
        req.student = decoded;
        //refresh token
        const refreshToken = tokenSign(req.student.email, req.student.id);
        res.cookie("Token", refreshToken, {
            maxAge: JWT_EXPIRE_TIME * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        next();
    } catch (error) {
        return res.status(403).json({ message: error.message });
    }
};
