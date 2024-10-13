import studentModel from "../models/studentModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import fileNameModel from "./../models/fileNameModel.js";
const ObjectId = mongoose.Types.ObjectId;

// fileUpload modules
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// define path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getProfile = async (req, res) => {
    const email = req.student.email;
    try {
        const studentData = await studentModel.aggregate([
            {
                $match: {
                    email,
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    email: 1,
                    age: 1,
                    roll: 1,
                },
            },
        ]);

        return res.json({ status: true, data: studentData[0] });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        if (req.body.email) {
            throw new Error(`you can not change your email`);
        }
        if (req.body.password && req.body.password.length > 0) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const newData = req.body;
        const updatedStudent = await studentModel.findOneAndUpdate(
            {
                email: req.student.email,
            },
            {
                $set: newData,
            },
            {
                new: true,
                projection: { _id: 0, name: 1, email: 1, age: 1, roll: 1 },
            }
        );
        return res.json({ status: true, data: updatedStudent });
    } catch (error) {
        return res.json({ status: false, message: error.toString() });
    }
};

export const fileUpload = async (req, res) => {
    try {
        if (!req.files.file) {
            throw new Error(`attach your file first`);
        }
        const file = req.files.file;
        const uniqueId =
            Date.now() + "-" + (Math.floor(Math.random() * 900) + 100) + "-";
        const pathToUpload = path.join(
            __dirname,
            "../uploads",
            uniqueId + file.name
        );

        const filePath = pathToUpload;
        const fileType = req.files.file.mimetype;
        const user = req.student.email;

        const fileInfoInDB = await fileNameModel.create({
            fileName: uniqueId + file.name,
            filePath,
            fileType,
            user,
        });
        if (!fileInfoInDB) {
            throw new Error(`file not uploaded on Database`);
        }

        file.mv(pathToUpload, (err) => {
            if (err) throw new Error(`upload failed to server`);
        });
        return res.json({
            status: true,
            message: "file uploaded successfully",
        });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
};

export const fileDelete = async (req, res) => {
    try {
        const filename = req.params.file;
        const fileNameOnDB = await fileNameModel.findOneAndDelete({ fileName :filename });
        if(!fileNameOnDB){
            throw new Error(`File does not exist on database `)
        }

        const filePath = path.join(__dirname, "../uploads", filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                throw new Error(`file deletion failed`);
            }
        });
        
        return res.json({
            status: true,
            message: "file deleted successfully from server and also from database",
        });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
};

export const fileGet = async(req, res) => {
    try {
        const filename = req.params.file;
        const fileNameOnDB = await fileNameModel.findOne({fileName:filename});
        if(!fileNameOnDB){
            throw new Error(`File does not exist on database`)
        }
        const filePath = path.join(__dirname, "../uploads", filename);
        return res.sendFile(filePath);
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
};
