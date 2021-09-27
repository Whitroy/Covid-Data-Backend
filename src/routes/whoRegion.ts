import { Router } from "express";
import { WHO_REGION } from "../controllers/common.controller";
import {
	getWHORegion,
	getWHORegions,
} from "../controllers/whoRegion.controller";
const router = Router();

router.get("/", getWHORegions);
router.get(`/:${WHO_REGION}`, getWHORegion);

export default router;
