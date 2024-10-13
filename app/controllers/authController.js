import studentModel from "../models/studentModel.js";
import bcrypt from "bcrypt";
import { tokenSign } from "../utility/tokenUtility.js";
import { JWT_EXPIRE_TIME } from "../config/config.js";

export const register = async (req, res) => {
    try {
        const studentExist = await studentModel.findOne({
            email: req.body.email,
        });
        if (studentExist) {
            throw new Error(`this user already exist. login`);
        }
        if(!req.body.name || !req.body.email || !req.body.password || !req.body.age || !req.body.roll){
            throw new Error(`All fields are required : name, email, password, age, roll`);
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const data = await studentModel.create(req.body);
        if (!data) {
            throw new Error(`something wrong. registration not successful`);
        }
        res.json({ status: "success", data });
    } catch (error) {
        return res.json({ status: false, error: error.message});
    }
};

export const login = async (req, res) => {
    try {
        if(!req.body.email || !req.body.password){
            throw new Error(`email and password are required`);
        }
        const userAggregation = await studentModel.aggregate([
            {
                $match: {
                    email: req.body.email,
                },
            },
            {
                $project: {
                    email: 1,
                    password: 1,
                },
            },
        ]);
        if (userAggregation.length === 0) {
            throw Error(`user not found`)
        }

        const isMatch = await bcrypt.compare(
            req.body.password,
            userAggregation[0].password
        );
        if (!isMatch) {
            throw Error(`invalid password`)
        }
        const token = tokenSign(
            userAggregation[0]["email"],
            userAggregation[0]["_id"]
        );

        res.cookie("Token", token, {
            maxAge: JWT_EXPIRE_TIME * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.json({
            status: "success",
            message: "login successful",
            token: token,
            tokenMadeBy: `email: ${userAggregation[0]["email"]},_id: ${userAggregation[0]["_id"]}`,
        });
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
};
