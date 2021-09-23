import { Report } from "./Report";

export interface Country {
	name: string;
	continent: string;
	population: number;
	WHORegion: string;
	report: Report;
}
