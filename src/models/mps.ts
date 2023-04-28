export type Mp = {
    id: number;
    nameListAs: string;
    nameDisplayAs: string;
    nameFullTitle: string;
    nameAddressAs: string;
    latestParty: Party;
  }
  
  export type Party = {
    id: number;
    name: string;
    abbreviation: string;
    backgroundColour: string;
    foregroundColour: string;
    isLordsMainParty: boolean;
    isLordsSpiritualParty: boolean;
    governmentType: null | "government";
    isIndependentParty: boolean;
  }

  export type responseWrapper = {
    items: Array<responseValue>;
  }

  export type responseValue = {
    value: Mp;
  }