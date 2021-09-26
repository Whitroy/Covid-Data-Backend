import { Request, Response } from "express";
import { DB } from "../db/dbService";
import { status } from "../utils/constants";
import {
	db,
	dBResponse,
	WHO_REGION,
	WHO_REGION_INCLUDE,
} from "./common.controller";

const handleIncludes = (inc: string[], res: any, cur: string, con: string) => {
	if (!res[cur].country) {
		res[cur].country = [];
	}
	res[cur].country.push(con);
	inc.forEach((val) => {
		if (!res[cur][val]) res[cur][val] = 0;
		if (val === "totalCase") {
			res[cur][val] += db[con].report.case.total;
		} else if (val === "totalDeath") {
			res[cur][val] += db[con].report.death.total
				? db[con].report.recovery.total
				: 0;
		} else {
			res[cur][val] += db[con].report.recovery.total
				? db[con].report.recovery.total
				: 0;
		}
	});
};

export const getWHORegions = (req: Request, res: Response) => {
	dBResponse(req, res);

	const inc = req.query.inc as string;
	let include: string[] = [];
	if (inc) {
		include = inc.split(",");
		include = include.filter((val) => WHO_REGION_INCLUDE.includes(val));
	}

	let response: any = {};

	Object.keys(db).forEach((cur) => {
		if (!response[db[cur].WHORegion]) {
			response = {
				...response,
				[db[cur].WHORegion]: {},
			};
		}

		handleIncludes(include, response, db[cur].WHORegion, cur);
	});

	return res.status(200).json({ status: status.SUCCESS, data: response });
};

export const getWHORegion = (req: Request, res: Response) => {
	dBResponse(req, res);
	const region = req.params[WHO_REGION];

	const inc = req.query.inc as string;
	let include: string[] = [];
	if (inc) {
		include = inc.split(",");
		include = include.filter((val) => WHO_REGION_INCLUDE.includes(val));
	}

	if (!region || !DB.getInstance.checkWHORegion(region))
		return res.status(404).json({
			status: status.FAILED,
			data: { message: "Region doesn't exist!!!" },
		});

	let response: any = {};

	Object.keys(db).forEach((cur) => {
		if (db[cur].WHORegion === region) {
			if (!response[db[cur].WHORegion]) {
				response = {
					...response,
					[db[cur].WHORegion]: {},
				};
			}

			handleIncludes(include, response, db[cur].WHORegion, cur);
		}
	});

	return res.status(200).json({
		status: status.SUCCESS,
		data: response,
	});
};
