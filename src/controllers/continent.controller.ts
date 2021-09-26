import { Request, Response } from "express";
import { DB } from "../db/dbService";
import { status } from "../utils/constants";
import { Continent_Name, db, dBResponse } from "./common.controller";

export const getContinents = async (req: Request, res: Response) => {
	dBResponse(req, res);

	const searchKey = req.query.search as string;
	const response: {
		[continent: string]: {
			name: string;
			population: number;
			totalCase: number;
		}[];
	} = {};

	if (searchKey) {
		const continents = DB.getInstance.getcontinents(searchKey) as string[];
		if (continents.length < 1)
			return res.status(404).json({
				status: status.FAILED,
				data: {
					message: "Continent with given key doesn't exist!!!",
				},
			});

		Object.keys(db).forEach((key) => {
			if (continents.indexOf(db[key].continent) !== -1) {
				if (!response[db[key].continent]) {
					response[db[key].continent] = [];
				}

				response[db[key].continent].push({
					name: db[key].name,
					population: db[key].population,
					totalCase: db[key].report.case.total,
				});
			}
		});

		return res.status(200).json({ status: status.SUCCESS, data: response });
	}

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

export const getContinent = (req: Request, res: Response) => {
	dBResponse(req, res);
	const continent = req.params[Continent_Name];
	if (!continent || !DB.getInstance.checkContinent(continent))
		return res.status(404).json({
			status: status.FAILED,
			data: { message: "Continent doesn't exist!!!" },
		});

	const data = Object.keys(db).reduce((prev: any, curr) => {
		if (db[curr].continent !== continent) return prev;
		if (!prev[db[curr].continent]) {
			prev[db[curr].continent] = [
				{
					name: db[curr].name,
					continent: db[curr].continent,
					population: db[curr].population,
					totalCase: db[curr].report.case.total,
				},
			];
		} else {
			prev[db[curr].continent].push({
				name: db[curr].name,
				population: db[curr].population,
				totalCase: db[curr].report.case.total,
			});
		}
		return prev;
	}, {});

	return res.status(200).json({ status: status.SUCCESS, data });
};
