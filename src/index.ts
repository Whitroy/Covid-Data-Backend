import express, { Application } from "express";
import { DB } from "./db/dbService";
import continent from "./routes/continent";

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/continents", continent);
app.get("*", (req, res) => {
	res
		.status(404)
		.json({ status: "failed", data: { message: "Endpoint doesn't exist" } });
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
