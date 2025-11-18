import { createMovement, getMovements, updateMovement, getMovementsByPart,deleteMovement } from "../controllers/movements.controller";
import {Router} from 'express'
import { authMiddleware } from "../middlewares/auth.middleware";

const route = Router();
route.get('/', authMiddleware,getMovements);
route.get('/by-part/:partId', authMiddleware, getMovementsByPart);
route.post('/', authMiddleware,createMovement);
route.delete('/:id', authMiddleware, deleteMovement);
route.put('/:id',authMiddleware, updateMovement);

export default route;