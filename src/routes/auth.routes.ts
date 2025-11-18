import { Router } from "express";
import { login, register,deleteUser,getUsers} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.delete("/delete/:id/",authMiddleware,deleteUser);
router.post("/getUsers",authMiddleware,getUsers)


export default router;