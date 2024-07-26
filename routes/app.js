import { signIn, signUp } from "../controllers/authentication_controllers.js";
import { adminBoard, removeSupervisor, addSupervisor, getAllSupervisors, getAllRoles } from "../controllers/admin_controllers.js";
import {supervisorBoard, getAllUsers} from "../controllers/supervisor_controllers.js";
import userBoard from "../controllers/user_controllers.js";
import { updateProfile, homeBoard } from "../controllers/shared_controllers.js";
import {

validatePassword,
checkIfEmailIsAlreadyUsed,
verifyJwtToken,
checkIfSupervisor,
checkIfAdmin,
} from "../middlewares/middlewaresFunctions.js";

const routes = (app) => {
  app.post(
    "/api/signUp",
    [validatePassword, checkIfEmailIsAlreadyUsed],
    signUp
  );

  app.post("/api/signIn", signIn);

  app.get("/api/homeBoard", homeBoard);

  app.get("/api/userBoard", verifyJwtToken, userBoard);

  app.get(
    "/api/supervisorBoard",
    [verifyJwtToken, checkIfSupervisor],
    supervisorBoard
  );

  app.get(
    "/api/adminBoard",
    [verifyJwtToken, checkIfAdmin],
    adminBoard
  );

  app.put(
    "/api/updateProfile",
    [verifyJwtToken, checkIfEmailIsAlreadyUsed],
    updateProfile
  );

  app.get(
    "/api/getAllUsers",
    [verifyJwtToken, checkIfSupervisor],
    getAllUsers
  );

  app.get(
    "/api/getAllRoles",
    [verifyJwtToken, checkIfAdmin],
    getAllRoles
  );

  app.get(
    "/api/getAllSupervisors",
    [verifyJwtToken, checkIfAdmin],
    getAllSupervisors
  );

  app.put(
    "/api/addSupervisor",
    [verifyJwtToken, checkIfAdmin],
    addSupervisor
  );

  app.put(
    "/api/removeSupervisor",
    [verifyJwtToken, checkIfAdmin],
    removeSupervisor
  );
};

export default routes;
