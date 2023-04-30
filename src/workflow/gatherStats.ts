import { log } from "console";
import { getMps, getDivision, getMemebersDivisions, getAllDivisions, getMemeberVoting } from "./apicall"
import { createMpNode, createDivisionNode, setupNeo, createVotedForDivision } from "./neoManager";
import { Mp } from "../models/mps";
import { Division, MemberVoting } from "../models/divisions";
import { VotedFor } from "../models/relationships";

const CREATE_MPS = true;
const CREATE_DIVISIONS = true;
const CREATE_RELATIONSHIPS = true;

export const gatherStats = async () => {

    console.log('BEGIN');

    const allMps: Array<Mp> = [];
    const allDivisions: Array<Division> = [];
    const allVotedForRelationships: Array<VotedFor> = [];

    const MAX_LOOPS = 1;

    let skip = 0;

    let neoCreateCount = 0;

    for (let i = 0; i < MAX_LOOPS; i++) {        
        const mps: Array<Mp> = await getMps(skip, 20);
        skip += 25;
        allMps.push(...mps);
        
        if (mps.length < 20) {
            break;
        }
    }
    console.log(`Created ${allMps.length} MPs in memory`);

    if (CREATE_MPS) {
        await setupNeo();

        for (let i of allMps) {
            await createMpNode(i);
            neoCreateCount = neoCreateCount + 1;
        }
        console.log(`Created ${neoCreateCount} MPs in Neo4j`);
    }

    //create all the divisions 
    
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

    if (CREATE_DIVISIONS) {
        neoCreateCount = 0;
        for (let i of allDivisions) {
            await createDivisionNode(i);
            neoCreateCount = neoCreateCount + 1;
        }
        console.log(`Created ${neoCreateCount} divisions in Neo4j`);
    }
    
    skip = 0;
    if (CREATE_RELATIONSHIPS) {
        
        //make relationships between mps and divisions
        for (const mp of allMps) {                        
            let divisionsVotedCount: number = 25;

            console.log(`create RELEATIONSHIPS for MP ${mp.nameDisplayAs}`);
        
            while (divisionsVotedCount === 25) {                
                //for each mp get all the divisions they have voted on
                const memeberVotings: Array<MemberVoting> = await getMemeberVoting(skip, 25, mp.id);                                
                skip += 25;
                
                //only create releationships for voted for divisions if we have created the division
                memeberVotings.filter(i => allDivisions.find(division => division.DivisionId === i.PublishedDivision.DivisionId)).forEach(vote => {
                        
                    allVotedForRelationships.push({
                        mpId: mp.id,
                        divisionId: vote.PublishedDivision.DivisionId, 
                        votedAye: vote.MemberVotedAye       
                    })
                })
                
                divisionsVotedCount = memeberVotings.length;                
            }
            skip = 0;
        }

        for (let votedFor of allVotedForRelationships) {  
            await createVotedForDivision(votedFor);                        
        }
    }


    console.log('END');


}