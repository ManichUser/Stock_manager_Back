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
  try {
    const id = Number(req.params.id);

    const brandExists = await prisma.brand.findUnique({ where: { id } });
    if (!brandExists) {
      return res.status(404).json({ message: "Marque introuvable." });
    }

    await prisma.brand.delete({ where: { id } });
    return res.json({ message: "Marque supprimée avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return res.status(500).json({ message: "Erreur serveur." });
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
