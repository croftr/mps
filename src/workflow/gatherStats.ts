import { log } from "console";
import { getMps, getDivision, getMemebersDivisions, getAllDivisions } from "./apicall"
import { createMpNode, createDivisionNode, setupNeo } from "./neoManager";
import { Mp } from "../models/mps";
import { Division } from "../models/divisions";

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export const gatherStats = async () => {

    console.log('BEGIN');

    const allMps: Array<Mp> = [];
    const allDivisions: Array<Division> = [];

    const MAX_LOOPS = 800;

    let totalCount = 0;
    let skip = 0;

    for (let i = 0; i < MAX_LOOPS; i++) {
        skip = skip + 20;
        const mps: Array<Mp> = await getMps(skip, 20);
        allMps.push(...mps);
        let fetchCount = mps.length;
        
        totalCount = totalCount + fetchCount;
        
        if (fetchCount < 20) {
            break;
        }
    }
    console.log(`Created ${totalCount} MPs in memory`);

    await setupNeo();

    let neoCreateCount = 0;
    allMps.forEach(i => {
        createMpNode(i);
        neoCreateCount = neoCreateCount + 1;
    })
    console.log(`Created ${neoCreateCount} MPs in Neo4j`);

    //create all the divisions 
    totalCount = 0;
    skip = 0;
    for (let i = 0; i < MAX_LOOPS; i++) {
        skip = skip + 25;
        const divisions: Array<Division> = await getAllDivisions(skip, 25);
        let fetchCount = divisions.length;
        totalCount = totalCount + fetchCount;
        allDivisions.push(...divisions)

        if (fetchCount < 25) {
            break;
        }
    }
    console.log(`Created ${totalCount} divisions in memory`);

    neoCreateCount = 0;
    allDivisions.forEach(i => {
        createDivisionNode(i);
        neoCreateCount = neoCreateCount + 1;
    })
    console.log(`Created ${neoCreateCount} divisions in Neo4j`);

    


    //make relationships between mps and divisions
    // for (const mp of allMps) {

    //     const divisions: Array<Division> = await getMemebersDivisions(0, 25, mp.id);
    //     console.log(`for MP ${mp.nameDisplayAs} got ${divisions.length} divisions`);

    // }



}