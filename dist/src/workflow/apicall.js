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
exports.getDivision = exports.getAllDivisions = exports.getMemebersDivisions = exports.getMps = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getMps = (skip, take) => __awaiter(void 0, void 0, void 0, function* () {
    let mpsResponse = [];
    try {
        const url = `https://members-api.parliament.uk/api/Members/Search?skip=${skip}&take=${take}&IsEligible=${true}&IsCurrentMember=${true}`;
        const res = yield (0, node_fetch_1.default)(url);
        const response = yield res.json();
        const mps = response.items;
        for (const mp of mps) {
            mpsResponse.push(mp.value);
        }
    }
    catch (err) {
        console.log(err.message); //can be console.error
        return mpsResponse;
    }
    return mpsResponse;
});
exports.getMps = getMps;
const getMemebersDivisions = (skip, take, memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, node_fetch_1.default)(`https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.skip=${skip}&queryParameters.take=${take}&queryParameters.memberId=${memberId}`);
    const divisionResposne = yield res.json();
    const divisions = [];
    divisionResposne.forEach(i => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const division = {
            DivisionId: (_a = i.DivisionId) !== null && _a !== void 0 ? _a : 0,
            Date: (_b = i.Date) !== null && _b !== void 0 ? _b : '',
            PublicationUpdated: (_c = i.PublicationUpdated) !== null && _c !== void 0 ? _c : '',
            Number: (_d = i.Number) !== null && _d !== void 0 ? _d : 0,
            IsDeferred: (_e = i.IsDeferred) !== null && _e !== void 0 ? _e : false,
            EVELType: (_f = i.EVELType) !== null && _f !== void 0 ? _f : '',
            EVELCountry: (_g = i.EVELCountry) !== null && _g !== void 0 ? _g : '',
            Title: (_h = i.Title) !== null && _h !== void 0 ? _h : '',
            AyeCount: (_j = i.AyeCount) !== null && _j !== void 0 ? _j : 0,
            NoCount: (_k = i.NoCount) !== null && _k !== void 0 ? _k : 0
        };
        divisions.push(division);
    });
    return divisions;
});
exports.getMemebersDivisions = getMemebersDivisions;
const getAllDivisions = (skip, take) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, node_fetch_1.default)(`https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.skip=${skip}&queryParameters.take=${take}`);
    const divisionResposne = yield res.json();
    const divisions = [];
    divisionResposne.forEach(i => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const division = {
            DivisionId: (_a = i.DivisionId) !== null && _a !== void 0 ? _a : 0,
            Date: (_b = i.Date) !== null && _b !== void 0 ? _b : '',
            PublicationUpdated: (_c = i.PublicationUpdated) !== null && _c !== void 0 ? _c : '',
            Number: (_d = i.Number) !== null && _d !== void 0 ? _d : 0,
            IsDeferred: (_e = i.IsDeferred) !== null && _e !== void 0 ? _e : false,
            EVELType: (_f = i.EVELType) !== null && _f !== void 0 ? _f : '',
            EVELCountry: (_g = i.EVELCountry) !== null && _g !== void 0 ? _g : '',
            Title: (_h = i.Title) !== null && _h !== void 0 ? _h : '',
            AyeCount: (_j = i.AyeCount) !== null && _j !== void 0 ? _j : 0,
            NoCount: (_k = i.NoCount) !== null && _k !== void 0 ? _k : 0
        };
        divisions.push(division);
    });
    return divisions;
});
exports.getAllDivisions = getAllDivisions;
const getDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const res = yield (0, node_fetch_1.default)(`https://commonsvotes-api.parliament.uk/data/division/${divisionId}.json`);
    const divisionResposne = yield res.json();
    const division = {
        DivisionId: (_a = divisionResposne.DivisionId) !== null && _a !== void 0 ? _a : 0,
        Date: (_b = divisionResposne.Date) !== null && _b !== void 0 ? _b : '',
        PublicationUpdated: (_c = divisionResposne.PublicationUpdated) !== null && _c !== void 0 ? _c : '',
        Number: (_d = divisionResposne.Number) !== null && _d !== void 0 ? _d : 0,
        IsDeferred: (_e = divisionResposne.IsDeferred) !== null && _e !== void 0 ? _e : false,
        EVELType: (_f = divisionResposne.EVELType) !== null && _f !== void 0 ? _f : '',
        EVELCountry: (_g = divisionResposne.EVELCountry) !== null && _g !== void 0 ? _g : '',
        Title: (_h = divisionResposne.Title) !== null && _h !== void 0 ? _h : '',
        AyeCount: (_j = divisionResposne.AyeCount) !== null && _j !== void 0 ? _j : 0,
        NoCount: (_k = divisionResposne.NoCount) !== null && _k !== void 0 ? _k : 0
    };
    return division;
});
exports.getDivision = getDivision;
