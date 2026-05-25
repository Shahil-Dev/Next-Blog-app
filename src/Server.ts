import app from "./App";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function Server() {
  try {
    await prisma.$connect();
    console.log("Prisma Connected the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

Server();
