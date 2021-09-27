import { Router } from "express";
import { Country_Name } from "../controllers/common.controller";
import { getCountries, getCountry } from "../controllers/country.controller";
import paginate from "../middleware/paginate.middleware";

const router = Router();

router.get("/", paginate, getCountries);
router.get(`/:${Country_Name}`, getCountry);
export default router;
