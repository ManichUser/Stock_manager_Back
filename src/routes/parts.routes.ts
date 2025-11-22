import { createPart, updatePart, deletePart, getParts } from "../controllers/part.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {Router} from 'express'

const route = Router();


route.post('/', authMiddleware, createPart);   // POST /parts
route.get('/', authMiddleware, getParts);      // GET /parts
route.put('/part/:id', authMiddleware, updatePart); // PUT /parts/:id
route.delete('/part/:id', authMiddleware, deletePart); // DELETE /parts/:id


export default route;