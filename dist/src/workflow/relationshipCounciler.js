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
exports.createRelationShipsForMp = void 0;
const apicall_1 = require("./apicall");
const createRelationShipsForMp = (mp, skip = 0) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Get relationships for mp ', mp.nameDisplayAs);
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
            return allDivisions.find(division => division.DivisionId === i.PublishedDivision.DivisionId);
        }).forEach(vote => {
            allVotedForRelationships.push({
                mpId: mp.id,
                divisionId: vote.PublishedDivision.DivisionId,
                votedAye: vote.MemberVotedAye
            });
            filterVoteCount += 1;
        });
        divisionsVotedCount = memeberVotings.length;
        mpVoteCount = mpVoteCount + filterVoteCount;
    }
    console.log(`created ${mpVoteCount} RELEATIONSHIPS for MP #${1} ${mp.nameDisplayAs}`);
    skip = 0;
    mpVoteCount = 0;
    console.log(`Creating ${allVotedForRelationships.length} Neo releationships ....`);
    for (let votedFor of allVotedForRelationships) {
        yield createVotedForDivision(votedFor);
    }
});
exports.createRelationShipsForMp = createRelationShipsForMp;
