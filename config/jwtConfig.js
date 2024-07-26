import dotenv from "dotenv";

dotenv.config();
const jwtConfig = process.env.SECRET;

export default jwtConfig ;