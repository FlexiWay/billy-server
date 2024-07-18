import express from "express";
import { handleWalletVerify } from "../controllers/auth/handleWalletVerify";

const authRouter = express.Router();

// Handle verify wallet
authRouter.route("/solana/verify").post(handleWalletVerify);

export default authRouter;
