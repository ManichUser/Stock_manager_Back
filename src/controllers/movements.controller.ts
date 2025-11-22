import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Prisma } from "@prisma/client";
import { notifyMovementsUpdated, notifyPartsUpdated } from "../websocket";

export const createMovement = async (req: AuthRequest, res: Response) => {
  try {
    const { partId, type, quantity } = req.body;

    const movement = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const part = await tx.part.findUnique({ where: { id: partId } });
      if (!part) throw new Error("Pièce introuvable");

      const newStock = type === "ENTREE"
        ? part.stock + quantity
        : part.stock - quantity;

      if (newStock < 0) throw new Error("Stock insuffisant");

      await tx.part.update({
        where: { id: partId },
        data: { stock: newStock }
      });
      
      notifyPartsUpdated()
      
      return tx.movement.create({
        data: {
          type,
          quantity,
          partId,
          userId: req.user!.id
        }
      });
    });
    notifyMovementsUpdated()
    res.json(movement);
  } catch (error: any) {
    console.error("Erreur création mouvement :", error.message || error);
    res.status(400).json({ error: error.message || "Erreur serveur" });
  }
};

export const getMovements = async (_: Request, res: Response) => {
  try {
    const movements = await prisma.movement.findMany({
      include: {
        part: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(movements);
  } catch (error: any) {
    console.error("Erreur récupération mouvements :", error.message || error);
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

export const getMovementsByPart = async (req: Request, res: Response) => {
  try {
    const { partId } = req.params;
    const movements = await prisma.movement.findMany({
      where: { partId: Number(partId) },
      include: {
        user: {
          select: { id: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(movements);
  } catch (error: any) {
    console.error("Erreur récupération mouvements par pièce :", error.message || error);
    res.status(500).json({ error: error.message || "Erreur serveur" });
  }
};

export const deleteMovement = async (req: Request, res: Response) => {
  
  try {
    const { id } = req.params;
    await prisma.movement.delete({ where: { id: Number(id) } });
    res.json({ message: "Mouvement supprimé" });
  } catch (error: any) {
    console.error("Erreur suppression mouvement :", error.message || error);
    res.status(400).json({ error: error.message || "Erreur serveur" });
  }
};
export const freebd = async (_req: Request, res: Response) => {
  try {
    await prisma.movement.deleteMany(); // supprime tous les mouvements
    res.status(200).json({ message: "Entrées/sorties totalement supprimées" });
  } catch (err: any) {
    console.error("Erreur suppression globale :", err.message || err);
    res.status(400).json({ error: err.message || "Erreur serveur" });
  }
};
export const updateMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movement = await prisma.movement.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(movement);
  } catch (error: any) {
    console.error("Erreur mise à jour mouvement :", error.message || error);
    res.status(400).json({ error: error.message || "Erreur serveur" });
  }
};
