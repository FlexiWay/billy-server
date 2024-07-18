import * as express from "express";
import { RequestWithUser } from "../../types";
import { mintQueue } from "../../utils/mintQueue";

export const handleMintNfts = async (
  req: RequestWithUser,
  res: express.Response,
) => {
  // TODO: Input Validation

  try {
    const job = await mintQueue.add("Mint", req.body, {
      removeOnComplete: true,
      removeOnFail: true,
    });
    console.log("Job: ", job.id);

    res.status(200).send({ message: "Successfully added to queue" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: (error as Error).message });
  }
};
