export interface Division {    
    [key: string]: number | string | boolean | undefined | Array<any>
    DivisionId: number;
    Date: string;
    PublicationUpdated: string;
    Number: number;
    IsDeferred: boolean;
    EVELType: string;
    EVELCountry: string;
    Title: string;
    AyeCount: number;
    NoCount: number;
    DoubleMajorityAyeCount?: number;
    DoubleMajorityNoCount?: number;
  }

export interface DivisionResposne extends Division {
    AyeTellers: Array<any>
  }
  