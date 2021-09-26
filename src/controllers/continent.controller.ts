import { Request, Response } from "express";
import { DB } from "../db/dbService";
import { status } from "../utils/constants";
import { sanitizeObj } from "../utils/utils";
import { Continent_Name, db, dBResponse } from "./common.controller";

export const getContinents = async (req: any, res: Response) => {
	dBResponse(req, res);

	const startIndex = req.startIndex as number;
	const endIndex = req.endIndex as number;
	const page = (req.query.page || 1) as number;
	const searchKey = req.query.search as string;
	const limit = (req.query.limit || 10) as number;
	let response: {
		[continent: string]: {
			name: string;
			population: number;
			totalCase: number;
		}[];
	} = {};

	let continents: string[] = [];
	if (searchKey) {
		continents = DB.getInstance.getcontinents(searchKey) as string[];
		if (continents.length < 1)
			return res.status(404).json({
				status: status.FAILED,
				data: {
					message: "Continent with given key doesn't exist!!!",
				},
			});
	}

	Object.keys(db).forEach((key) => {
		if (searchKey && continents.indexOf(db[key].continent) !== -1) {
			if (!response[db[key].continent]) {
				response[db[key].continent] = [];
			}
		}
		if (!response[db[key].continent]) {
			response[db[key].continent] = [];
		}
		response[db[key].continent].push({
			name: db[key].name,
			population: db[key].population,
			totalCase: db[key].report.case.total,
		});
	});

	Object.keys(response).forEach((key) => {
		response[key] = response[key].slice(startIndex, endIndex);
	});

	response = sanitizeObj(response);

	if (Object.keys(response).length === 0)
		return res.status(502).json({
			status: status.FAILED,
			data: { message: "Page doesn't exist!!!" },
		});

	return res
		.status(200)
		.json({ status: status.SUCCESS, data: { result: response, page, limit } });
};

export const getContinent = (req: any, res: Response) => {
	dBResponse(req, res);
	const continent = req.params[Continent_Name];
	if (!continent || !DB.getInstance.checkContinent(continent))
		return res.status(404).json({
			status: status.FAILED,
			data: { message: "Continent doesn't exist!!!" },
		});

	let data = Object.keys(db).reduce((prev: any, curr) => {
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

	const startIndex = req.startIndex as number;
	const endIndex = req.endIndex as number;
	const page = (req.query.page || 1) as number;
	const limit = (req.query.limit || 10) as number;

	Object.keys(data).forEach((key) => {
		data[key] = data[key].slice(startIndex, endIndex);
	});

	data = sanitizeObj(data);

	if (Object.keys(data).length === 0)
		return res.status(502).json({
			status: status.FAILED,
			data: { message: "Page doesn't exist!!!" },
		});

	return res
		.status(200)
		.json({ status: status.SUCCESS, data: { result: data, page, limit } });
};
