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

  try {
    await prisma.$transaction(async (tx) => {
      // Supprimer tous les mouvements liés
      await tx.movement.deleteMany({
        where: { partId: Number(id) },
      });

      // Supprimer la pièce
      await tx.part.delete({
        where: { id: Number(id) },
      });
    });

    res.status(200).json({ message: "Partie et mouvements associés supprimés" });
  } catch (err: any) {
    console.error("Erreur suppression pièce :", err);
    res.status(400).json({ message: "Erreur lors de la suppression", error: err.message || err });
  }
};


