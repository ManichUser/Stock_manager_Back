import { Request, Response } from "express"; 
import bcrypt from "bcryptjs";
import Jwt  from "jsonwebtoken";
import {prisma} from "../config/prisma";

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

export const login = async (req:Request,res:Response) =>{
    const {username, password}=req.body

    const user= await prisma.user.findUnique({ where:{ username}})

    if(!user) return res.status(400).json({message: "Not found User"})

    const isValid= await bcrypt.compare(password, user.password)

    if(!isValid) return res.status(400).json({message: "password is incorrect"})

    // Generate JWT token (implementation not shown here)
    const token = Jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(200).json({message: "Login successful", token})
}
 
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