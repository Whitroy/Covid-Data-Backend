import { Router } from "express";
import { getContinents } from "../controllers/continent.controller";

const router = Router();

router.get("/", getContinents);

export default router;
