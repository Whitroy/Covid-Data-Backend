import express, { Application } from "express";
import { DB } from "./db/dbService";
import continent from "./routes/continent";
import country from "./routes/country";
import whoRegion from "./routes/whoRegion";
import { status } from "./utils/constants";

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/WhoRegions", whoRegion);
app.use("/api/continents", continent);
app.use("/api/countries", country);

app.get("*", (req, res) => {
	res.status(404).json({
		status: status.ERROR,
		data: { message: "Endpoint doesn't exist" },
	});
});

try {
	app.listen(port, (): void => {
		console.log(
			`Connected successfully on port ${port}, click http://localhost:${port}`
		);
	});
} catch (error: any) {
	console.error(`Error occured: ${error.message}`);
}

new DB();
