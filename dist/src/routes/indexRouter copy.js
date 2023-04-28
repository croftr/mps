"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusRouter = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT;
const statusRouter = () => {
    app.get('/', (req, res) => {
        res.send('Status is up');
    });
};
exports.statusRouter = statusRouter;
