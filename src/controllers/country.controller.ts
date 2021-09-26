import { Request, Response } from "express";
import { status } from "../utils/constants";
import { Country_Name, db, dBResponse } from "./common.controller";

export const getCountries = (req: Request, res: Response) => {
	dBResponse(req, res);

	const searchKey = req.query.search as string;

	if (searchKey && searchKey !== "") {
		const data = Object.keys(db).reduce((prev: any, cur) => {
			if (!cur.toLowerCase().includes(searchKey.toLowerCase())) return prev;
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

		if (data.length < 1)
			return res.status(404).json({
				status: status.FAILED,
				data: {
					message: "Country with given key doesn't exist!!!",
				},
			});

		return res.status(200).json({
			status: status.SUCCESS,
			data,
		});
	}

	const response = Object.keys(db).reduce((prev: any, cur) => {
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
	return res.status(200).json({ status: status.SUCCESS, data: response });
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
