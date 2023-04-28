import { responseWrapper, responseValue, Mp } from '../models/mps';
import neo4j from "neo4j-driver";

const CONNECTION_STRING = "bolt://localhost:7687";

let driver: any;
export const setupNeo = async () => {

    driver = neo4j.driver(CONNECTION_STRING, neo4j.auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''));
    const session = driver.session();

    try {
        let result;
        result = await session.run(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`);        
        result = await session.run(`MATCH (n) DELETE (n)`);        
    } catch (error) {
        //contraint already exists so proceed
    }
}

export const createNeoData = async (mp: Mp) => {

    const cypher =
        `CREATE (mp:Mp {
        id: ${mp.id},
        nameListAs: "${mp.nameListAs}",
        nameDisplayAs: "${mp.nameDisplayAs}",
        nameFullTitle: "${mp.nameFullTitle}",
        nameAddressAs: "${mp.nameAddressAs}",        
        partyId: "${mp.latestParty.id}",
        partyName: "${mp.latestParty.name}",
        partyAbbreviation: "${mp.latestParty.abbreviation}",
        partyBackgroundColour: "${mp.latestParty.backgroundColour}",
        partyForegroundColour: "${mp.latestParty.foregroundColour}",
        partyIsLordsMainParty: "W${mp.latestParty.isLordsMainParty}",
        partyIsLordsSpiritualParty: "${mp.latestParty.isLordsSpiritualParty}",
        partyGovernmentType: "${mp.latestParty.governmentType}",
        partyIsIndependentParty: "${mp.latestParty.isIndependentParty}"
      });`

    try {
        const session = driver.session();
        const result = await session.run(cypher);
        console.log('created ', result);
        
    } catch (error: any) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }

}