import { Worker, Job } from "bullmq";
import { redisOptions } from "../utils/mintQueue";

const worker = new Worker(
  "Mint",
  async (job: Job) => {
    // Optionally report some progress
    await job.updateProgress(42);

    // Optionally sending an object as progress
    await job.updateProgress({ foo: "bar" });

    // Do something with job
    return "some value";
  },
  { connection: redisOptions },
);

worker.on("completed", (job: Job, returnvalue: any) => {
  console.log(`${job.id} has completed and returned ${returnvalue}`);
});

worker.on("failed", (job: Job | undefined, error: Error) => {
  console.log(`${job?.id} has failed with reason ${error.message}`);
});

worker.on("error", (err) => {
  console.error(err);
});
