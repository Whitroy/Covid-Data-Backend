import { Request, Response } from "express";
import { DB } from "../db/dbService";
import { status } from "../utils/constants";

const db = DB.getInstance.databaseObj;

export const getContinents = async (req: Request, res: Response) => {
	if (!db) {
		return res.status(501).json({ error: "Something went wrong!!!" });
	}

	const response: {
		[continent: string]: {
			name: string;
			population: number;
			totalCase: number;
		}[];
	} = {};

	Object.keys(db).forEach((key) => {
		if (!response[db[key].continent]) {
			response[db[key].continent] = [];
		}
		response[db[key].continent].push({
			name: db[key].name,
			population: db[key].population,
			totalCase: db[key].report.case.total,
		});
	});

	return res.status(200).json({ status: status.SUCCESS, data: response });
};

const getContinent = (req: Request, res: Response) => {
	const continent = req.params;
	console.log(continent);
	return res.status(200).json({ status: "success", data: "Hi" });
};
