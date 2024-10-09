import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Name is mandatory
            trim: true,
        },
        email: {
            type: String,
            required: true, // Email is mandatory
            unique: true, // Ensure the email is unique
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true, // Password is mandatory
            minlength: 6, // Minimum length for security
        },
        age: {
            type: Number,
            required: true, // Age is mandatory
            min: 1, // Minimum value for age
        },
        roll: {
            type: Number,
            required: true, // Age is mandatory
            min: 1, // Minimum value for roll
        },
        dateRegistered: {
            type: Date,
            default: Date.now, // Automatically set the registration date
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const studentModel = mongoose.model("students",studentSchema);

export default studentModel;