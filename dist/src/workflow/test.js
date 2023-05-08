"use strict";
// import neo4j from "neo4j-driver";
var neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost");
const session = driver.session();
