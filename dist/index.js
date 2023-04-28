"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const statusRouter_1 = __importDefault(require("./src/routes/statusRouter"));
const indexRouter_1 = __importDefault(require("./src/routes/indexRouter"));
const mpStatsRouter_1 = __importDefault(require("./src/routes/mpStatsRouter"));
const gatherStats_1 = require("./src/workflow/gatherStats");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use("/", indexRouter_1.default);
app.use("/status", statusRouter_1.default);
app.use("/mps", mpStatsRouter_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    (0, gatherStats_1.gatherStats)();
});
