import { createReadStream } from "fs";
import { Country } from "../model/Country";
import csv from "csv-parser";
import path from "path";
import { parseIntoNum, sanitizeObj } from "../utils/utils";
import { Case, Death, Recovery, Report, Test } from "../model/Report";

const dbFilePath = path.resolve(__dirname, "csv", "covidData.csv");

export class DB {
	private db: { [name: string]: Country } = {};
	private static _instance: DB;

	// Data redudancy
	private continentList: string[] = [];
	private whoRegionList: string[] = [];

	constructor() {
		if (DB._instance) {
			console.warn("Failed: Trying to Create DB Service again!!");
			return;
		}

		DB._instance = this;
		this.initalize();
	}

	public static get getInstance() {
		if (!DB._instance) {
			DB._instance = new DB();
		}
		return DB._instance;
	}

	async initalize() {
		await createReadStream(dbFilePath)
			.pipe(csv())
			.on("data", (row) => {
				row = sanitizeObj(row);
				const death: Death = sanitizeObj({
					new: parseIntoNum(row["NewDeaths"]),
					total: parseIntoNum(row["TotalDeaths"])!,
					perMillion: parseIntoNum(row["Deaths/1M pop"]),
				});

				const caseReport: Case = sanitizeObj({
					total: parseIntoNum(row["TotalCases"])!,
					new: parseIntoNum(row["NewCases"]),
					active: parseIntoNum(row["ActiveCases"]),
					critical: parseIntoNum(row["Serious,Critical"]),
					perMillion: parseIntoNum(row["Tot Cases/1M pop"]),
				});

				const recovery: Recovery = sanitizeObj({
					total: parseIntoNum(row["TotalRecovered"]),
					new: parseIntoNum(row["NewRecovered"]),
				});

				const test: Test = sanitizeObj({
					total: parseIntoNum(row["TotalTests"]),
					perMillion: parseIntoNum(row["Tests/1M pop"]),
				});

				const report: Report = { test, death, recovery, case: caseReport };
				const country: Country = {
					name: row["Country/Region"],
					report,
					population: parseIntoNum(row["Population"])!,
					WHORegion: row["WHO Region"],
					continent: row["Continent"],
				};

				if (!this.continentList.includes(country.continent))
					this.continentList.push(country.continent);

				if (!this.whoRegionList.includes(country.WHORegion))
					this.whoRegionList.push(country.WHORegion);

				this.db[country.name] = country;
			})
			.on("end", () => {
				console.log("DB is successfully Loaded");
			})
			.on("error", (error: any) => {
				console.error(error.message);
			});
	}

	get databaseObj() {
		return this.db;
	}

	checkContinent(name: string) {
		return this.continentList.includes(name);
	}

	getcontinents(key: string) {
		if (!key || key === "") return [];

		const cons = this.continentList.reduce((prev: any, cur) => {
			if (cur.toLowerCase().includes(key.toLowerCase())) return [...prev, cur];
			return prev;
		}, []);

		return cons;
	}

	checkWHORegion(reg: string) {
		return this.whoRegionList.includes(reg);
	}
}
