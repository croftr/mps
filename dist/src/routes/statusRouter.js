"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statusRouter = express_1.default.Router();
statusRouter.get('/', (req, res) => {
    const status = {
        isUp: true,
        message: 'Server is up and running'
    };
    res.json(status);
});
exports.default = statusRouter;
