import { createPart, updatePart, deletePart, getParts } from "../controllers/part.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {Router} from 'express'

const route = Router();

route.post('/part',authMiddleware,createPart);
route.get('/parts',authMiddleware,getParts);
route.put('/part/:id',authMiddleware,updatePart);
route.delete('/part/:id',authMiddleware,deletePart);

export default route;