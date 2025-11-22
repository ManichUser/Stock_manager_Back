import { Request, Response } from "express"; 
import bcrypt from "bcryptjs";
import Jwt  from "jsonwebtoken";
import {prisma} from "../config/prisma";
import { notifylogin } from "../websocket";

export const register = async (req: Request, res:Response)=>{
    const {username, password}=req.body

    const exists = await prisma.user.findUnique({ where:{ username}})

    if(exists) return res.status(400).json({message: "Username already exists"})
    
        const hashed=await bcrypt.hash(password, 10)
        const user= await prisma.user.create({
            data:{
                username,
                password: hashed
            }
        })
        res.status(201).json({message: "User created", user: { id: user.id, username: user.username }})
}

export const login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
     
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return res.status(400).json({ message: "User not found" });
  
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(400).json({ message: "Password is incorrect" });
  
      // Exclure le mot de passe avant de créer le token
      const { password: _, ...userWithoutPassword } = user;

      const token = Jwt.sign(userWithoutPassword, process.env.JWT_SECRET!, { expiresIn: "3d" });
  
      // Notification des clients pour le login
      notifylogin();
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 7 jours
      }); 
      res.status(200).json({ message: "Login successful", userId: user.id, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const getUsers = async (_: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true }
    });
    res.json(users);
}
export const deleteUser = async (req:Request, res: Response)=>{
    const {id}=req.params
    await prisma.user.delete({ where: { id:Number(id) }})
    res.json({message:"user deleted"})
    
}