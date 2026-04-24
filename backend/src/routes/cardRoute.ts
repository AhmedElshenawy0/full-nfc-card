import { verifyJWT } from "./../middleware/verifyJWT";
import express from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  getOneCard,
  updateCard,
  verifyCard,
  deactivateCard,
} from "../controllers/cardController";
import { verifyAdmin } from "../middleware/verifyAdmin";

const router = express.Router();

router.route("/verifyCard").get(verifyCard);

router.route("/").get(getAllCards).post(createCard);

router.route("/:id").get(verifyJWT, getOneCard).put(updateCard);

router.route("/deactivate/:unique_code").delete(verifyAdmin, deactivateCard);

router.route("/delete/:unique_code").delete(verifyAdmin, deleteCard);

export default router;
