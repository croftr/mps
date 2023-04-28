import { log } from "console";
import { getMps } from "./apicall"
import { createNeoData, setupNeo } from "./neoManager";
import { Mp } from "../models/mps";

function delay(time:number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

export const gatherStats = async () => {

    console.log('BEGIN');

    const allMps: Array<Mp> = [];

    const MAX_LOOPS = 2;

    let totalCount = 0;    
    let skip = 0;

    for (let i=0; i<MAX_LOOPS; i++) {
        skip = skip + 20;
        console.log(i)
        const mps: Array<Mp> = await getMps(skip, 20);
        allMps.push(...mps);
        let fetchCount = mps.length;
        
        console.log('fetchCount ', fetchCount );
        totalCount = totalCount + fetchCount;
        console.log('totalCount ', totalCount);       
        

        if (fetchCount < 20) {
            break;
        }
    }

    await setupNeo();

    allMps.forEach(i => {
        createNeoData(i);
    })
            
}