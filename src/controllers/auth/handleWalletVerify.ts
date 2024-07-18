import * as express from "express";
import { PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { RequestWithUser } from "../../types";
import { FieldValue } from "firebase-admin/firestore";
import { UserService } from "../../services/UserService";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export interface SigninMessage {
  domain: any;
  publicKey: any;
  nonce: any;
  statement: any;
}

const userService = new UserService();

export async function validateSigninMessage(
  signature: string,
  signinMessage: SigninMessage,
) {
  const msg = `${signinMessage.statement} | ${signinMessage.nonce}`; // nonce here is the block hash
  const signatureUint8 = bs58.decode(signature);
  const msgUint8 = new TextEncoder().encode(msg);
  const pubKeyUint8 = bs58.decode(signinMessage.publicKey);

  return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
}

export const handleWalletVerify = async (
  req: RequestWithUser,
  res: express.Response,
) => {
  const {
    isLedger,
    signinMessage,
    signature: msgSignature,
    serializedTx: ledgerSerializedTx,
  }: {
    isLedger: boolean;
    signinMessage: SigninMessage;
    signature: string;
    serializedTx: any;
  } = req.body.data;

  let walletKey = "";

  if (isLedger) {
    const signedTx = Transaction.from(Uint8Array.from(ledgerSerializedTx));

    try {
      walletKey = signedTx.feePayer?.toBase58() || "";

      if (walletKey == "") {
        console.error("wallet is missing from sign transaction");
        return res
          .status(503)
          .json({ error: "wallet is missing from sign transaction" });
      }

      const inx = signedTx.instructions.find(
        (ix) => ix.programId.toBase58() == MEMO_PROGRAM_ID.toBase58(),
      );

      if (!inx) {
        console.error("Memo program id is invalid or does not matches");
        return res
          .status(503)
          .json({ error: "memo program id does not matches" });
      }

      // inx.data.toString() //signed message
      if (!signedTx.verifySignatures()) {
        console.error("failed to verify signature on transaction");
        return res
          .status(503)
          .json({ error: "failed to verify signature on transaction" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message || error });
    }
  } else {
    walletKey = signinMessage.publicKey;

    if (!signinMessage) {
      return res.status(400).json({ error: "Invalid or missing parameters." });
    }

    try {
      const validationResult = await validateSigninMessage(
        msgSignature || "",
        signinMessage,
      );

      if (!validationResult) {
        throw new Error("Could not validate the signed message");
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message || error });
    }
  }

  // Add Wallet to User Doc
  try {
    await userService.updateUser(req.user!.uid, {
      solanaWallets: FieldValue.arrayUnion(walletKey),
    });

    res.status(200).send({ message: "Wallet verified successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: (error as Error).message });
  }
};
