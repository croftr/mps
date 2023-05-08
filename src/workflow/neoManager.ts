import { log } from 'console';
import { Division } from '../models/divisions';
import { responseWrapper, responseValue, Mp } from '../models/mps';
import { VotedFor } from '../models/relationships';
import neo4j from "neo4j-driver";

let CONNECTION_STRING = `bolt://${process.env.DOCKER_HOST}:7687`;
let driver: any;

const runCypher = async (cypher: string, session: any) => {
    console.log(cypher);
    try {
        const result = await session.run(cypher);
        return result;
    } catch (error) {

    }
}

export const setupNeo = async () => {

    CONNECTION_STRING = `bolt://${process.env.DOCKER_HOST}:7687`;

    driver = neo4j.driver(CONNECTION_STRING, neo4j.auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''));
    const session = driver.session();

    console.log('NEO URL ', CONNECTION_STRING, process.env.NEO4J_USER, process.env.NEO4J_PASSWORD);

    try {
        let result;
        result = await runCypher(`MATCH (n) DETACH DELETE n`, session);
        result = await runCypher(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`, session);
        result = await runCypher(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`, session);
        result = await runCypher(`CREATE CONSTRAINT voted_for_unique ON (mp:Mp)-[:VOTED_FOR]->(division:Division) REQUIRE (mp.id <> division.id)`, session);
    } catch (error) {
        //contraint already exists so proceed
    }
    session.close();
    console.log('NEO setup complete');

}

export const setupDataScience = async () => {

    CONNECTION_STRING = `bolt://${process.env.DOCKER_HOST}:7687`;

    driver = neo4j.driver(CONNECTION_STRING, neo4j.auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''));
    const session = driver.session();

    try {
        await runCypher(`CALL gds.graph.drop('g1',false) YIELD graphName`, session);
        await runCypher(`CALL gds.graph.project('g1', ['Mp', 'Division'], ['VOTED_FOR'],  { relationshipProperties: ['votedAyeNumeric'] })`, session);
    } catch (error) {
        //contraint already exists so proceed
    }

    session.close();

}

export const cleanUp = () => {
    driver.close();
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
        gender: "${mp.gender}",
        partyAbbreviation: "${mp.latestParty.abbreviation}",
        partyBackgroundColour: "${mp.latestParty.backgroundColour}",
        partyForegroundColour: "${mp.latestParty.foregroundColour}",
        partyIsLordsMainParty: "W${mp.latestParty.isLordsMainParty}",
        partyIsLordsSpiritualParty: "${mp.latestParty.isLordsSpiritualParty}",
        partyGovernmentType: "${mp.latestParty.governmentType}",
        partyIsIndependentParty: "${mp.latestParty.isIndependentParty}",
        house: ${mp.latestHouseMembership.house},
        membershipFrom: "${mp.latestHouseMembership.membershipFrom}",        
        membershipStartDate: "${mp.latestHouseMembership.membershipStartDate}"
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

    const cypher: string = `MATCH (mp:Mp {id: ${votedFor.mpId}}), (division:Division {DivisionId: ${votedFor.divisionId}}) CREATE (mp)-[:VOTED_FOR {votedAye: ${votedFor.votedAye}, votedAyeNumeric: ${Number(votedFor.votedAye)} }]->(division);`;

    try {
        const session = driver.session();
        // console.log(cypher);            
        const result = await session.run(cypher);

    } catch (error: any) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }

}