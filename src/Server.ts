import app from "./App.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;


if (process.env.NODE_ENV !== "production") {
  async function startServer() {
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
  startServer();
}


export default app;