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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatherStats = void 0;
const apicall_1 = require("./apicall");
const neoManager_1 = require("./neoManager");
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
const gatherStats = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('BEGIN');
    const allMps = [];
    const MAX_LOOPS = 2;
    let totalCount = 0;
    let skip = 0;
    for (let i = 0; i < MAX_LOOPS; i++) {
        skip = skip + 20;
        console.log(i);
        const mps = yield (0, apicall_1.getMps)(skip, 20);
        allMps.push(...mps);
        let fetchCount = mps.length;
        console.log('fetchCount ', fetchCount);
        totalCount = totalCount + fetchCount;
        console.log('totalCount ', totalCount);
        if (fetchCount < 20) {
            break;
        }
    }
    yield (0, neoManager_1.setupNeo)();
    allMps.forEach(i => {
        (0, neoManager_1.createNeoData)(i);
    });
});
exports.gatherStats = gatherStats;
