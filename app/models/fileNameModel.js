import mongoose from 'mongoose';

const fileNameSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const fileNameModel = mongoose.model("fileNames",fileNameSchema);

export default fileNameModel;