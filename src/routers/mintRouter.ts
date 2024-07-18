import express from "express";
import { handleMintNfts } from "../controllers/mint/handleMintNfts";

const mintRouter = express.Router();

// Handle get me endpoint, see more about handler in the module
mintRouter.route("/").post(handleMintNfts);

export default mintRouter;
