require("module-alias/register");
import express, { Express } from "express";
import runMiddlewaresForRequest from "./middeware/index";
import setupRouteHandlers from "./routers";
import "./workers/mintWorker";

// Configure server port and app
const PORT = process.env.PORT || 8080;
const app: Express = express();

// Run all middlewares for single request hitting the server, look into fn module for more details
runMiddlewaresForRequest(app);

// Setup route handlers for all route url request, look into module for more details
setupRouteHandlers(app);

// SERVER
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
