import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createPart = async (req: Request, res: Response) => {
  const part = await prisma.part.create({ data: req.body });
  res.json(part);
};

export const getParts = async (_: Request, res: Response) => {
  const parts = await prisma.part.findMany({ include: { brand: true } });
  res.json(parts);
};

export const updatePart = async (req: Request, res: Response) => {
    const { id } = req.params;
    const part = await prisma.part.update({
        where: { id: Number(id) },
        data: req.body,
    });
    res.json(part);
}
export const deletePart = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.part.delete({ where: { id: Number(id) } });
    res.json({ message: "Part deleted" });
}

