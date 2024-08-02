import { signIn, signUp } from "../controllers/authentication_controllers.js";
import { adminBoard, removeSupervisor, addSupervisor} from "../controllers/admin_controllers.js";
import {supervisorBoard} from "../controllers/supervisor_controllers.js";
import userBoard from "../controllers/user_controllers.js";
import { homeBoard } from "../controllers/shared_controllers.js";
import {

validatePassword,
checkIfEmailIsAlreadyUsed,
verifyJwtToken,
checkIfSupervisor,
checkIfAdmin,
} from "../middlewares/middlewaresFunctions.js";

// Define routes and apply middleware
const routes = (app) => {
  app.post(
    "/api/signUp",
    [validatePassword, checkIfEmailIsAlreadyUsed],
    signUp
  );

  // Sign-in route
  app.post("/api/signIn", signIn);

  // Home page route
  app.get("/api/homeBoard", homeBoard);

  // User board route, requires JWT token verification
  app.get("/api/userBoard", verifyJwtToken, userBoard);

  // Supervisor board route, requires JWT token and supervisor role verification
  app.get(
    "/api/supervisorBoard",
    [verifyJwtToken, checkIfSupervisor],
    supervisorBoard
  );

  // Admin board route, requires JWT token and admin role verification
  app.get(
    "/api/adminBoard",
    [verifyJwtToken, checkIfAdmin],
    adminBoard
  );

  // Add supervisor role route, requires JWT token and admin role verification
  app.put(
    "/api/addSupervisor",
    [verifyJwtToken, checkIfAdmin],
    addSupervisor
  );

  // Remove supervisor role route, requires JWT token and admin role verification
  app.put(
    "/api/removeSupervisor",
    [verifyJwtToken, checkIfAdmin],
    removeSupervisor
  );
};

export default routes;
