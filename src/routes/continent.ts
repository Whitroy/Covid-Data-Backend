import { Router } from "express";
import {
	Continent_Name,
	getContinent,
	getContinents,
} from "../controllers/continent.controller";

const router = Router();

router.get("/", getContinents);
router.get(`/:${Continent_Name}`, getContinent);

export default router;
