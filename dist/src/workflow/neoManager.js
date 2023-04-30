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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVotedForDivision = exports.createDivisionNode = exports.createMpNode = exports.setupNeo = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const CONNECTION_STRING = "bolt://localhost:7687";
let driver;
const setupNeo = () => __awaiter(void 0, void 0, void 0, function* () {
    driver = neo4j_driver_1.default.driver(CONNECTION_STRING, neo4j_driver_1.default.auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''));
    const session = driver.session();
    try {
        let result;
        result = yield session.run(`MATCH (n) DELETE (n)`);
        result = yield session.run(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`);
        result = yield session.run(`CREATE CONSTRAINT FOR (mp:Mp) REQUIRE mp.id IS UNIQUE`);
    }
    catch (error) {
        //contraint already exists so proceed
    }
});
exports.setupNeo = setupNeo;
const createMpNode = (mp) => __awaiter(void 0, void 0, void 0, function* () {
    const cypher = `CREATE (mp:Mp {
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
      });`;
    try {
        const session = driver.session();
        const result = yield session.run(cypher);
        // console.log('created ', result);
    }
    catch (error) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }
});
exports.createMpNode = createMpNode;
const createDivisionNode = (division) => __awaiter(void 0, void 0, void 0, function* () {
    const cypher = `CREATE (division:Division {
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
        const result = yield session.run(cypher);
    }
    catch (error) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }
});
exports.createDivisionNode = createDivisionNode;
const createVotedForDivision = (votedFor) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('check ', votedFor);
    const cypher = `MATCH (mp:Mp {id: ${votedFor.mpId}}), (division:Division {DivisionId: ${votedFor.divisionId}}) CREATE (mp)-[:VOTED_FOR {votedAye: ${votedFor.votedAye}}]->(division);`;
    try {
        const session = driver.session();
        console.log(cypher);
        const result = yield session.run(cypher);
    }
    catch (error) {
        if (error.code !== "Neo.ClientError.Schema.ConstraintValidationFailed") {
            console.log('Error adding Club: ', error);
        }
    }
});
exports.createVotedForDivision = createVotedForDivision;
