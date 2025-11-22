import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le nom de la marque est requis." });
    }

    const brand = await prisma.brand.create({
      data: { name },
    });

    return res.status(201).json(brand);
  } catch (error) {
    console.error("Erreur lors de la création de la marque :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

export const getBrands = async (_: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany();
    return res.json(brands);
  } catch (error) {
    console.error("Erreur lors de la récupération des marques :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      //  Récupérer toutes les pièces liées à la marque
      const parts = await tx.part.findMany({
        where: { brandId: Number(id) },
        select: { id: true },
      });

      const partIds = parts.map(p => p.id);

      //  Supprimer tous les mouvements liés à ces pièces
      if (partIds.length > 0) {
        await tx.movement.deleteMany({
          where: { partId: { in: partIds } },
        });
      }

      //  Supprimer toutes les pièces liées à la marque
      await tx.part.deleteMany({
        where: { brandId: Number(id) },
      });

      //  Supprimer la marque
      await tx.brand.delete({
        where: { id: Number(id) },
      });
    });

    res.status(200).json({ message: "Marque, pièces et mouvements associés supprimés" });
  } catch (err: any) {
    console.error("Erreur suppression marque :", err);
    res.status(400).json({ message: "Erreur lors de la suppression", error: err.message || err });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    const brandExists = await prisma.brand.findUnique({ where: { id } });
    if (!brandExists) {
      return res.status(404).json({ message: "Marque introuvable." });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { name },
    });

    return res.json(brand);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};
