import { Request, Response } from "express";
import { DB } from "../db/dbService";

export const db = DB.getInstance.databaseObj;

export const Continent_Name = "Continent_Name";
export const Country_Name = "Country_Name";

export const dBResponse = (req: Request, res: Response) => {
	if (!db) {
		return res.status(501).json({ error: "Something went wrong!!!" });
	}
};
