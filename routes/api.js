import express from 'express';
import { login, register } from "../app/controllers/authController.js";
import {  fileDelete, fileGet, fileUpload, getProfile , updateProfile, } from '../app/controllers/studentController.js';
import { authMiddleware } from '../app/middlewares/authMiddleware.js';
const router = express.Router();

// student registration and login api routes
router.post('/register', register);
router.post('/login', login);

// profile and fileOperation api routes
router.get('/get-profile',authMiddleware, getProfile);
router.post('/update-profile',authMiddleware, updateProfile);

router.post('/file-upload',authMiddleware, fileUpload);
router.delete("/file-delete/:file",authMiddleware,fileDelete);
router.get("/file-get/:file",authMiddleware,fileGet);

export default router