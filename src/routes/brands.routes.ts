import { createBrand, updateBrand, deleteBrand, getBrands } from "../controllers/brand.controller";
import {Router} from 'express'
import { authMiddleware } from "../middlewares/auth.middleware";

const route = Router();

route.post('/', authMiddleware,createBrand);
route.get('/', authMiddleware,getBrands);
route.put('/b/:id', authMiddleware,updateBrand);
route.delete('/brand/:id', authMiddleware,deleteBrand);
export default route;