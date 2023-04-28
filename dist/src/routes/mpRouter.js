"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mpStatsRouter = express_1.default.Router();
mpStatsRouter.get('/', (req, res) => {
    const mps = 'https://members-api.parliament.uk/api/Members/Search?skip=0&take=20';
    res.json({ mps });
});
exports.default = mpStatsRouter;
