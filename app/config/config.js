import dotenv from "dotenv";

dotenv.config();

const {PORT,DATABASE,JWT_KEY,JWT_EXPIRE_TIME} = process.env;


export {PORT,DATABASE,JWT_KEY,JWT_EXPIRE_TIME};