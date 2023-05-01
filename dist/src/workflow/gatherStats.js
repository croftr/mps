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
const CREATE_MPS = true;
const CREATE_DIVISIONS = true;
const CREATE_RELATIONSHIPS = true;
const gatherStats = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('BEGIN');
    const allMps = [];
    const allDivisions = [];
    const allVotedForRelationships = [];
    const MAX_LOOPS = 100;
    let skip = 0;
    let neoCreateCount = 0;
    for (let i = 0; i < 1; i++) {
        const mps = yield (0, apicall_1.getMps)(skip, 1);
        skip += 25;
        allMps.push(...mps);
        if (mps.length < 20) {
            break;
        }
    }
    console.log(`Created ${allMps.length} MPs in memory`);
    if (CREATE_MPS) {
        yield (0, neoManager_1.setupNeo)();
        for (let i of allMps) {
            yield (0, neoManager_1.createMpNode)(i);
            neoCreateCount = neoCreateCount + 1;
        }
        console.log(`Created ${neoCreateCount} MPs in Neo4j`);
    }
    //create all the divisions 
    if (CREATE_DIVISIONS) {
        skip = 0;
        for (let i = 0; i < MAX_LOOPS; i++) {
            skip += 25;
            const divisions = yield (0, apicall_1.getAllDivisions)(skip, 25);
            let fetchCount = divisions.length;
            allDivisions.push(...divisions);
            if (fetchCount < 25) {
                break;
            }
        }
        console.log(`Created ${allDivisions.length} divisions in memory`);
        if (CREATE_DIVISIONS) {
            neoCreateCount = 0;
            for (let i of allDivisions) {
                yield (0, neoManager_1.createDivisionNode)(i);
                neoCreateCount = neoCreateCount + 1;
            }
            console.log(`Created ${neoCreateCount} divisions in Neo4j`);
        }
    }
    skip = 0;
    if (CREATE_RELATIONSHIPS) {
        //make relationships between mps and divisions
        let index = 0;
        for (const mp of allMps) {
            console.log('Get relationships for mp ', mp.nameDisplayAs);
            index += 1;
            let divisionsVotedCount = 25;
            let mpVoteCount = 0;
            while (divisionsVotedCount === 25) {
                //for each mp get all the divisions they have voted on
                const memeberVotings = yield (0, apicall_1.getMemeberVoting)(skip, 25, mp.id);
                // console.log('got votes RESPONSE ', memeberVotings.map(i => i.PublishedDivision.Title).join(','));
                skip += 25;
                //only create releationships for voted for divisions if we have created the division
                let filterVoteCount = 0;
                memeberVotings.filter(i => {
                    console.log('CHECK vote >> ', i.PublishedDivision.DivisionId, i.PublishedDivision.Title);
                    return allDivisions.find(division => division.DivisionId === i.PublishedDivision.DivisionId);
                }).forEach(vote => {
                    console.log('add vote >> ', vote.PublishedDivision.Title);
                    allVotedForRelationships.push({
                        mpId: mp.id,
                        divisionId: vote.PublishedDivision.DivisionId,
                        votedAye: vote.MemberVotedAye
                    });
                    filterVoteCount += 1;
                });
                divisionsVotedCount = memeberVotings.length;
                console.log('add ', filterVoteCount);
                console.log('to ', mpVoteCount);
                mpVoteCount = mpVoteCount + filterVoteCount;
            }
            console.log(`created ${mpVoteCount} RELEATIONSHIPS for MP #${index} ${mp.nameDisplayAs}`);
            skip = 0;
            mpVoteCount = 0;
        }
        console.log(`Creating ${allVotedForRelationships.length} Neo releationships ....`);
        for (let votedFor of allVotedForRelationships) {
            yield (0, neoManager_1.createVotedForDivision)(votedFor);
        }
    }
    console.log('END');
});
exports.gatherStats = gatherStats;
