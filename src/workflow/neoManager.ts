import { log } from 'console';
import { Division } from '../models/divisions';
import { responseWrapper, responseValue, Mp } from '../models/mps';
import { VotedFor } from '../models/relationships';
import neo4j from "neo4j-driver";

const CONNECTION_STRING = "bolt://localhost:7687";

let driver: any;
export const setupNeo = async () => {

    driver = neo4j.driver(CONNECTION_STRING, neo4j.auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''));
    const session = driver.session();

    try {
        let result;
        result = await session.run(`MATCH (n) DELETE (n)`);
        result = await session.run(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`);
        result = await session.run(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`);
    } catch (error) {
        //contraint already exists so proceed
    }
}

export const createMpNode = async (mp: Mp) => {

    const cypher: string =
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
        // console.log('created ', result);

    } catch (error: any) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }

}

export const createDivisionNode = async (division: Division) => {

    const cypher: string = `CREATE (division:Division {
        DivisionId: ${division.DivisionId},
        Date: "${division.Date}",
        PublicationUpdated: "${division.PublicationUpdated}",
        Number: ${division.Number},
        IsDeferred: ${division.IsDeferred},
        EVELType: "${division.EVELType}",
        EVELCountry: "${division.EVELCountry}",
        Title: "${division.Title}",
        AyeCount: ${division.AyeCount},
        NoCount: ${division.NoCount}
        })`;

    try {
        const session = driver.session();
        const result = await session.run(cypher);

    } catch (error: any) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }

}

export const createVotedForDivision = async (votedFor: VotedFor) => {

    console.log('check ', votedFor);
    

    const cypher: string = `MATCH (mp:Mp {id: ${votedFor.mpId}}), (division:Division {DivisionId: ${votedFor.divisionId}}) CREATE (mp)-[:VOTED_FOR {votedAye: ${votedFor.votedAye}}]->(division);`;

    try {
        const session = driver.session();
        console.log(cypher);            
        const result = await session.run(cypher);

    } catch (error: any) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }

}