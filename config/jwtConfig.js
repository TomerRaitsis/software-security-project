import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Access JWT secret from environment variables
const jwtConfig = process.env.SECRET;

export default jwtConfig ;