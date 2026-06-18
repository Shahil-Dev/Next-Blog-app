"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_js_1 = __importDefault(require("./App.js"));
const prisma_js_1 = require("./lib/prisma.js");
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
    async function startServer() {
        try {
            await prisma_js_1.prisma.$connect();
            console.log("Prisma Connected the database");
            App_js_1.default.listen(PORT, () => {
                console.log(`Server is running on port: ${PORT}`);
            });
        }
        catch (error) {
            console.error("Error starting the server:", error);
            await prisma_js_1.prisma.$disconnect();
            process.exit(1);
        }
    }
    startServer();
}
exports.default = App_js_1.default;
