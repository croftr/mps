
import fetch from 'node-fetch';

import { responseWrapper, responseValue, Mp } from '../models/mps';

export const getMps = async (skip: number, take: number): Promise<Array<Mp>> => {

  console.log('step 1');

  let mpsResponse: Array<Mp> = [];
  try {

    console.log('step 2 ');

    const res = await fetch(`https://members-api.parliament.uk/api/Members/Search?skip=${skip}&take=${take}`);

    console.log('Status Code:', res.status);

    const response: responseWrapper = await res.json();     
    const mps: Array<responseValue> = response.items;

    console.log('MPs ', mps.length);

    for (const mp of mps) {
      mpsResponse.push(mp.value);    
    }
    

  } catch (err: any) {
    console.log(err.message); //can be console.error
    return mpsResponse;
  }

  return mpsResponse;
}


