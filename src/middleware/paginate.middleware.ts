import { NextFunction, Response } from "express";

const paginate = (req: any, res: Response, next: NextFunction) => {
	const page = (req.query.page || 1) as number;
	const limit = (req.query.limit || 10) as number;

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	req.startIndex = startIndex;
	req.endIndex = endIndex;

	next();
};

export default paginate;
