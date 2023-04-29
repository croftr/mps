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
    const allDivisions = [];
    const MAX_LOOPS = 800;
    let totalCount = 0;
    let skip = 0;
    for (let i = 0; i < MAX_LOOPS; i++) {
        skip = skip + 20;
        const mps = yield (0, apicall_1.getMps)(skip, 20);
        allMps.push(...mps);
        let fetchCount = mps.length;
        totalCount = totalCount + fetchCount;
        if (fetchCount < 20) {
            break;
        }
    }
    console.log(`Created ${totalCount} MPs in memory`);
    yield (0, neoManager_1.setupNeo)();
    let neoCreateCount = 0;
    allMps.forEach(i => {
        (0, neoManager_1.createMpNode)(i);
        neoCreateCount = neoCreateCount + 1;
    });
    console.log(`Created ${neoCreateCount} MPs in Neo4j`);
    //create all the divisions 
    totalCount = 0;
    skip = 0;
    for (let i = 0; i < MAX_LOOPS; i++) {
        skip = skip + 25;
        const divisions = yield (0, apicall_1.getAllDivisions)(skip, 25);
        let fetchCount = divisions.length;
        totalCount = totalCount + fetchCount;
        allDivisions.push(...divisions);
        if (fetchCount < 25) {
            break;
        }
    }
    console.log(`Created ${totalCount} divisions in memory`);
    neoCreateCount = 0;
    allDivisions.forEach(i => {
        (0, neoManager_1.createDivisionNode)(i);
        neoCreateCount = neoCreateCount + 1;
    });
    console.log(`Created ${neoCreateCount} divisions in Neo4j`);
    //make relationships between mps and divisions
    // for (const mp of allMps) {
    //     const divisions: Array<Division> = await getMemebersDivisions(0, 25, mp.id);
    //     console.log(`for MP ${mp.nameDisplayAs} got ${divisions.length} divisions`);
    // }
});
exports.gatherStats = gatherStats;
