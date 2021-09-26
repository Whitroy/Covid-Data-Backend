import { Router } from "express";
import { Continent_Name } from "../controllers/common.controller";
import {
	getContinent,
	getContinents,
} from "../controllers/continent.controller";

const router = Router();

router.get("/", getContinents);
router.get(`/:${Continent_Name}`, getContinent);

export default router;
