import { Queue } from "bullmq";

export const redisOptions = {
  host: process.env.REDIS_ENV === "local" ? "127.0.0.1" : "10.158.54.67",
  port: 6379,
  attempts: 1,
  removeOnComplete: true,
  removeOnFail: true,
  // If your Redis server requires a password, add it here
  // password: 'your-redis-password',
};

// Create a new connection in every instance
export const mintQueue = new Queue("Mint", {
  connection: redisOptions,
});
