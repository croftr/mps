
import fetch from 'node-fetch';

import { responseWrapper, responseValue, Mp } from '../models/mps';
import { DivisionResposne, Division } from '../models/divisions';

export const getMps = async (skip: number, take: number): Promise<Array<Mp>> => {

  let mpsResponse: Array<Mp> = [];
  try {

    const url: string = `https://members-api.parliament.uk/api/Members/Search?skip=${skip}&take=${take}&IsEligible=${true}&IsCurrentMember=${true}`;

    const res = await fetch(url);
  
    const response: responseWrapper = await res.json();     
    const mps: Array<responseValue> = response.items;

    for (const mp of mps) {
      mpsResponse.push(mp.value);    
    }
    

  } catch (err: any) {
    console.log(err.message); //can be console.error
    return mpsResponse;
  }

  return mpsResponse;
}

export const getMemebersDivisions = async (skip: number, take: number, memberId: number): Promise<Array<Division>> => {

  const res = await fetch(`https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.skip=${skip}&queryParameters.take=${take}&queryParameters.memberId=${memberId}`);
  
  const divisionResposne: Array<DivisionResposne> = await res.json();     

  const divisions: Array<Division> = []

  divisionResposne.forEach(i => {
    const division: Division = {
      DivisionId: i.DivisionId ?? 0,
      Date: i.Date ?? '',
      PublicationUpdated: i.PublicationUpdated ?? '',
      Number: i.Number ?? 0,
      IsDeferred: i.IsDeferred ?? false,
      EVELType: i.EVELType ?? '',
      EVELCountry: i.EVELCountry ?? '',
      Title: i.Title ?? '',
      AyeCount: i.AyeCount ?? 0,
      NoCount: i.NoCount ?? 0
    };

    divisions.push(division)
    
  })

  
  return divisions;

}

export const getAllDivisions = async (skip: number, take: number): Promise<Array<Division>> => {

  const res = await fetch(`https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.skip=${skip}&queryParameters.take=${take}`);
  
  const divisionResposne: Array<DivisionResposne> = await res.json();     

  const divisions: Array<Division> = []

  divisionResposne.forEach(i => {
    const division: Division = {
      DivisionId: i.DivisionId ?? 0,
      Date: i.Date ?? '',
      PublicationUpdated: i.PublicationUpdated ?? '',
      Number: i.Number ?? 0,
      IsDeferred: i.IsDeferred ?? false,
      EVELType: i.EVELType ?? '',
      EVELCountry: i.EVELCountry ?? '',
      Title: i.Title ?? '',
      AyeCount: i.AyeCount ?? 0,
      NoCount: i.NoCount ?? 0
    };

    divisions.push(division)
    
  })


  return divisions;

}


export const getDivision = async (divisionId: number): Promise<Division> => {

  const res = await fetch(`https://commonsvotes-api.parliament.uk/data/division/${divisionId}.json`);
  
  const divisionResposne: DivisionResposne = await res.json();     

  const division: Division = {
    DivisionId: divisionResposne.DivisionId ?? 0,
    Date: divisionResposne.Date ?? '',
    PublicationUpdated: divisionResposne.PublicationUpdated ?? '',
    Number: divisionResposne.Number ?? 0,
    IsDeferred: divisionResposne.IsDeferred ?? false,
    EVELType: divisionResposne.EVELType ?? '',
    EVELCountry: divisionResposne.EVELCountry ?? '',
    Title: divisionResposne.Title ?? '',
    AyeCount: divisionResposne.AyeCount ?? 0,
    NoCount: divisionResposne.NoCount ?? 0
  };
  

  return division;

}
