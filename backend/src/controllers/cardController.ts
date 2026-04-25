import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import prisma from "../utils/db";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../middleware/verifyJWT";
import { validate as isUuid } from "uuid";

//=> Verify card
export const verifyCard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { unique_code } = req.query;

  try {
    if (!unique_code) {
      res
        .status(403)
        .json({ message: "You're not allowed without a card code" });
      return;
    }

    const card = await prisma.card.findUnique({
      where: { unique_code: unique_code as string },
      include: { sold_service: true },
    });

    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    // Card is unclaimed — send anyone (owner or stranger) to signup to claim it
    if (!card.sold_service?.client_id) {
      res.status(200).json({
        message: "Go to signup",
        type: card.nfc_type,
        cardId: card.id,
        uniqueCode: card.unique_code,
      });
      return;
    }

    // Card is claimed — verify the linked client exists
    const client = await prisma.client.findUnique({
      where: { id: card.sold_service.client_id },
    });

    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    // Card is claimed and client exists — send anyone to the service demo
    res.status(200).json({
      message: "success",
      name: client.first_name,
      cardId: card.sold_service.id,
      cardType: card.nfc_type,
    });
  } catch (err) {
    next(new Error("❌ Error in verifyCard"));
  }
};

//=> Get all cards
export const getAllCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await prisma.card.findMany({
      include: { client: true, sold_service: true },
    });
    res.status(200).json({ cards });
  } catch (err) {
    const error = new Error(`❌ Error in get all cards`);
    next(error);
  }
};

//=> Get one card
export const getOneCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const param = req.params;

  if (!isUuid(param?.id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  try {
    const card = await prisma.card.findUnique({
      where: { id: String(param.id) },
    });

    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    res.status(200).json({ card });
  } catch (err) {
    const error = new Error(`❌ Error in get one card`);
    next(error);
  }
};

//=> Create card
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  if (!body.nfc_shap || !body.nfc_type) {
    res.status(404).json({ message: "All fields require when creating card" });
    return;
  }

  try {
    const card = await prisma.card.create({
      data: {
        nfc_shap: body.nfc_shap,
        nfc_type: body.nfc_type,
        client_id: body.client_id || null,
      },
    });

    res.status(201).json({ card });
  } catch (err) {
    const error = new Error(`❌ Error in create card`);
    next(error);
  }
};

//=> Update card
export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;
  const id = req?.params?.id;

  if (!isUuid(id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }
  try {
    const card = await prisma.card.update({ where: { id: id }, data: body });

    res.status(200).json({ card });
  } catch (err) {
    const error = new Error(`❌ Error in update card`);
    next(error);
  }
};
//=> deactivate card
export const deactivateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { unique_code } = req.params;

  if (!unique_code) {
    res.status(400).json({ message: "Missing Card unique code" });
    return;
  }
  console.log("unique is ", unique_code);

  const card = await prisma.card.findUnique({ where: { unique_code } });

  if (!card?.unique_code) {
    res.status(404).json({ message: "Card not found" });
    return;
  }
  console.log("card is ", card);

  try {
    await prisma.soldService.deleteMany({
      where: { card_id: card?.id },
    });
    await prisma?.client?.delete({
      where: { id: card?.client_id as string },
    });
    await prisma.card.update({
      where: { unique_code },
      data: {
        client: {
          disconnect: true,
        },
      },
    });

    res.status(200).json({ message: "Card has deactivated successfully" });
  } catch (err) {
    const error = new Error(`❌ Error in deactivate card`);
    next(error);
  }
};
//=> delete card
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { unique_code } = req.params;

  if (!unique_code) {
    res.status(400).json({ message: "Missing Card unique code" });
    return;
  }
  console.log("unique is ", unique_code);

  const card = await prisma.card.findUnique({ where: { unique_code } });

  if (!card?.unique_code) {
    res.status(404).json({ message: "Card not found" });
    return;
  }
  console.log("card is ", card);

  try {
    await prisma.soldService.deleteMany({
      where: { card_id: card?.id },
    });

    await prisma.card.delete({
      where: { unique_code },
    });

    res.status(200).json({ message: "Card has delete successfully" });
  } catch (err) {
    const error = new Error(`❌ Error in delete card`);
    next(error);
  }
};
