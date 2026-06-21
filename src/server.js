import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./db/index.js";

const PORT = config.port;

async function main() {
  try {
    connectDB();
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

main();
