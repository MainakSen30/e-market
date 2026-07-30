import express from 'express';
import cors from "cors";
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import swaggerUi from "swagger-ui-express"
const SwaggerDocument = require("./swagger-output.json")

const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["authorization", "content-type"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

//swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDocument));
app.get("/docs-json", (req, res) => {
    res.json(SwaggerDocument)
});

/*
    here, before the middleware gets spooled up we are goig to add the routes for various services
*/
//AUTH ROUTE
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
    console.log(`Auth Service is running at http://localhost:${port}/api`)
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});

server.on("error", (err) => {
    console.log("Server Error:", err)
});
