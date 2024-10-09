import express from 'express';
import { login, register } from "../app/controllers/authController.js";
import { deleteProfileImage, getProfile, getProfileImage, updateProfile, uploadProfileImage } from '../app/controllers/studentController.js';
import { authMiddleware } from '../app/middlewares/authMiddleware.js';
import {upload} from '../app/middlewares/fileUpload.js';
const router = express.Router();

// student registration and login api routes
router.post('/register', register);
router.post('/login', login);

// profile and fileOperation api routes
router.get('/get-profile',authMiddleware, getProfile);
router.post('/update-profile',authMiddleware, updateProfile);
router.post('/profile/upload',authMiddleware, upload.single('file'),uploadProfileImage);   
router.delete('/profile/delete-file/:fileName',authMiddleware,deleteProfileImage);   
router.get('/profile/get-profile-image/:fileName',authMiddleware,getProfileImage);   

export default router