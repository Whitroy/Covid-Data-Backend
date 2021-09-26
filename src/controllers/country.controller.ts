import { Request, Response } from "express";
import { status } from "../utils/constants";
import { Country_Name, db, dBResponse } from "./common.controller";

export const getCountries = (req: any, res: Response) => {
	dBResponse(req, res);

	const searchKey = req.query.search as string;

	const startIndex = req.startIndex as number;
	const endIndex = req.endIndex as number;
	const page = (req.query.page || 1) as number;
	const limit = (req.query.limit || 10) as number;

	let response = Object.keys(db).reduce((prev: any, cur) => {
		if (
			searchKey &&
			searchKey !== "" &&
			!cur.toLowerCase().includes(searchKey.toLowerCase())
		)
			return prev;
		return [
			...prev,
			{
				name: cur,
				continent: db[cur].continent,
				totalCase: db[cur].report.case.total,
				population: db[cur].population,
				WHORegion: db[cur].WHORegion,
			},
		];
	}, []);

	if (searchKey && searchKey !== "") {
		if (response.length < 1)
			return res.status(502).json({
				status: status.FAILED,
				data: {
					message: "Country with given key doesn't exist!!!",
				},
			});
	}

	response = response.slice(startIndex, endIndex);

	if (response.length === 0)
		return res.status(502).json({
			status: status.FAILED,
			data: { message: "Page doesn't exist!!!" },
		});

	return res
		.status(200)
		.json({ status: status.SUCCESS, data: { result: response, page, limit } });
};

export const getCountry = (req: Request, res: Response) => {
	dBResponse(req, res);
	const country = req.params[Country_Name];
	if (!country || !db[country])
		return res.status(404).json({
			status: status.FAILED,
			data: { message: "Country doesn't exist!!!" },
		});

	return res.status(200).json({ status: status.SUCCESS, data: db[country] });
};
