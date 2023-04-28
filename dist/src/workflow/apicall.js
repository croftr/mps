"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMps = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getMps = (skip, take) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('step 1');
    let mpsResponse = [];
    try {
        console.log('step 2 ');
        const res = yield (0, node_fetch_1.default)(`https://members-api.parliament.uk/api/Members/Search?skip=${skip}&take=${take}`);
        console.log('Status Code:', res.status);
        const response = yield res.json();
        const mps = response.items;
        console.log('MPs ', mps.length);
        for (const mp of mps) {
            mpsResponse.push(mp.value);
        }
    }
    catch (err) {
        console.log(err.message); //can be console.error
        return mpsResponse;
    }
    return mpsResponse;
});
exports.getMps = getMps;
