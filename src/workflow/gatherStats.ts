import { log } from "console";
import { getMps, getDivision, getMemebersDivisions, getAllDivisions, getMemeberVoting } from "./apicall"
import { createMpNode, createDivisionNode, setupNeo, createVotedForDivision, cleanUp, setupDataScience } from "./neoManager";
import { Mp } from "../models/mps";
import { Division, MemberVoting } from "../models/divisions";
import { VotedFor } from "../models/relationships";

const CREATE_MPS = true;
const CREATE_DIVISIONS = true;
const CREATE_RELATIONSHIPS = true;

export const gatherStats = async () => {

    console.log(`Creating ${Number(process.env.MP_LOOPS) * Number(process.env.MP_TAKE_PER_LOOP)} Mps`);

    await setupNeo();

    const allMps: Array<Mp> = [];
    const allDivisions: Array<Division> = [];
    const allVotedForRelationships: Array<VotedFor> = [];

    const MAX_LOOPS = 200;
    let skip = 0;

    let neoCreateCount = 0;

    //create all the divisions 
    if (CREATE_DIVISIONS) {
        skip = 0;
        for (let i = 0; i < MAX_LOOPS; i++) {
            skip += 25;
            const divisions: Array<Division> = await getAllDivisions(skip, 25);
            let fetchCount = divisions.length;

            allDivisions.push(...divisions)

            if (fetchCount < 25) {
                break;
            }
        }
        console.log(`Created ${allDivisions.length} divisions in memory`);

        neoCreateCount = 0;
        for (let i of allDivisions) {
            await createDivisionNode(i);
            neoCreateCount = neoCreateCount + 1;
        }
        console.log(`Created ${neoCreateCount} divisions in Neo4j`);

    }

    skip = 0;
    neoCreateCount = 0;
    if (CREATE_MPS) {        
        
        for (let i = 0; i < Number(process.env.MP_LOOPS); i++) {
            
            const mps: Array<Mp> = await getMps(skip, Number(process.env.MP_TAKE_PER_LOOP));
            
            skip += 25;
            allMps.push(...mps);

            if (mps.length < 20) {
                break;
            }
        }
        console.log(`Created ${allMps.length} MPs in memory`);


        for (let i of allMps) {
            await createMpNode(i);
            neoCreateCount = neoCreateCount + 1;
        }
        console.log(`Created ${neoCreateCount} MPs in Neo4j`);
    }

    skip = 0;
    if (CREATE_RELATIONSHIPS) {

        //make relationships between mps and divisions
        let index = 0;
        for (const mp of allMps) {
            console.log('Get relationships for mp ', mp.nameDisplayAs);

            index += 1;
            let divisionsVotedCount: number = 25;
            let mpVoteCount: number = 0;
            while (divisionsVotedCount === 25) {
                //for each mp get all the divisions they have voted on
                const memeberVotings: Array<MemberVoting> = await getMemeberVoting(skip, 25, mp.id);
                // console.log('got votes RESPONSE ', memeberVotings.map(i => i.PublishedDivision.Title).join(','));

                skip += 25;

                //only create releationships for voted for divisions if we have created the division
                let filterVoteCount = 0;

                memeberVotings.filter(i => {
                    return allDivisions.find(division => division.DivisionId === i.PublishedDivision.DivisionId)
                }).forEach(vote => {
                    allVotedForRelationships.push({
                        mpId: mp.id,
                        divisionId: vote.PublishedDivision.DivisionId,
                        votedAye: vote.MemberVotedAye
                    })
                    filterVoteCount += 1;
                })

                divisionsVotedCount = memeberVotings.length;
                mpVoteCount = mpVoteCount + filterVoteCount;
            }
            console.log(`created ${mpVoteCount} RELEATIONSHIPS for MP #${index} ${mp.nameDisplayAs}`);
            skip = 0;
            mpVoteCount = 0;

        }

        console.log(`Creating ${allVotedForRelationships.length} Neo releationships ....`);

        for (let votedFor of allVotedForRelationships) {
            await createVotedForDivision(votedFor);
        }
    }

    await setupDataScience();

    cleanUp();

    console.log('END');


}