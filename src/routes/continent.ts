import { Router } from "express";
import { Continent_Name } from "../controllers/common.controller";
import {
	getContinent,
	getContinents,
} from "../controllers/continent.controller";
import paginate from "../middleware/paginate.middleware";

const router = Router();

router.get("/", paginate, getContinents);
router.get(`/:${Continent_Name}`, paginate, getContinent);

export default router;
