import express, { Application } from "express";
import { DB } from "./db/dbService";
import continent from "./routes/continent";
import { status } from "./utils/constants";

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/continents", continent);
app.get("*", (req, res) => {
	res
		.status(404)
		.json({
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
