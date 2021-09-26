import { Router } from "express";
import { Country_Name } from "../controllers/common.controller";
import { getCountries, getCountry } from "../controllers/country.controller";

const router = Router();

router.get("/", getCountries);
router.get(`/:${Country_Name}`, getCountry);
export default router;
