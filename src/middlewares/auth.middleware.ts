import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
    user?: {id:number};
}

export const authMiddleware=(req: AuthRequest, res: Response, next: NextFunction)=>{
    const token=req.headers.authorization?.split(" ")[1]; // Récupère le token depuis le header Authorization
    if (!token) return res.status(401).json({ message: "Token manquant" });
    
    try {
        const decoded =jwt.verify(token, process.env.JWT_SECRET as string);
        req.user= decoded as {id:number}; // Ajoute l'ID de l'utilisateur décodé à la requête
        next();
    }catch(err){
        return res.status(401).json({ message: "Token invalide" });
    }
}