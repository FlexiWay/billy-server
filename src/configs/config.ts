import dotenv from "dotenv";
dotenv.config();

interface Config {
  // Common
  API_ENDPOINT_URL: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_INTERVAL: number;
  RPC_URL_MAINNET: string;
  RPC_URL_DEVNET: string;
  TESTING_KEYPAIR: string;

  // Environment specific
  SOLANA_CLUSTER: string;
}

const commonConfig = {
  // Server endpoint url root
  API_ENDPOINT_URL: "/api/v1",

  //  User rate limiting
  RATE_LIMIT_WINDOW_MS: 5,
  RATE_LIMIT_MAX_INTERVAL: 1000,

  // RPC
  RPC_URL_MAINNET:
    "",
  RPC_URL_DEVNET:
    "",
  // Keypairs
  TESTING_KEYPAIR: "",
};

let config: Config;

if (process.env.ENVIRONMENT === "development") {
  // PROD Config
  config = {
    ...commonConfig,
    SOLANA_CLUSTER: "devnet",
  };
} else {
  // Final Testing Config
  config = {
    ...commonConfig,
    SOLANA_CLUSTER: "mainnet",
  };
}

export default config;
