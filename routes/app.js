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
