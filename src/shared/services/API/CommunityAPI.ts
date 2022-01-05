import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";

// used for all proposal voting
export interface IVoteProposal {
  "ProposalId": string,
  "CommunityId": string,
  "Decision": boolean
}

// get a proposal by giving id
export async function getProposal(
  proposalId: string
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/community/getProposal/${proposalId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// get a community by giving id
export async function getCommunity(
  communityId: string
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/community/getCommunity/${communityId}`)
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface ICreateCommunity {
    "Founders": {[key:string]: number},
    "EntryType": string,
    "EntryConditions"?: {[key:string]: number},
    "FoundersConsensus": string,
    "FoundersVotingTime": number,
    "TreasuryConsensus": string,
    "TreasuryVotingTime": number
}

export async function createCommunity(
  payload: ICreateCommunity,
  additionalData: Object,
): Promise<any> {
  try {
    // ;
    // const { address, privateKey } = await getPriviWallet();
    // ;
    // const { signature } = await signPayload('createCommunity', address, payload, privateKey);
    // const requestData: IAPIRequestProps = {
    //   Function: 'createCommunity',
    //   Address: address,
    //   Signature: signature,
    //   Payload: payload,
    // };
    // const body = {
    //     Data: requestData,
    //     AdditionalData: additionalData
    // };
    // ;
    const response = await axios.post(`${URL()}/Community/createCommunity/v2`, payload);
    ;
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IVoteCreationProposal {
  "ProposalId": string,
  "Decision": boolean
}

export async function voteCreationProposal(
payload: IVoteCreationProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('voteCreationProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'voteCreationProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/voteCreationProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface ICreateCommunityToken {
  "CommunityId": string,
  "TokenName": string,
  "TokenSymbol": string,
  "FundingToken": string,
  "Type": string,
  "InitialSupply": string,
  "TargetPrice": string,
  "TargetSupply": string,
  "VestingTime": number,
  "ImmediateAllocationPct": string,
  "VestedAllocationPct": string,
  "TaxationPct": string
}

export async function createCommunityToken(
payload: ICreateCommunityToken,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('createCommunityToken', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'createCommunityToken',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/createCommunityToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}


export async function voteCommunityTokenProposal(
payload: IVoteProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('voteCommunityTokenProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'voteCommunityTokenProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/voteCommunityTokenProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}


//////////////////// AIRDROP, ALLOCATION, TRANSFER ///////////////////

export interface IAirdropCommunityToken {
  "CommunityId": string,
  "Addresses": {[key:string]:string}
}

export async function airdropCommunityToken(
payload: IAirdropCommunityToken,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('airdropCommunityToken', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'airdropCommunityToken',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/airdropCommunityToken/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function voteAirdropProposal(
payload: IVoteProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('voteAirdropProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'voteAirdropProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/voteAirdropProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getAirdropProposals(
    communityAddress: string
  ): Promise<any> {
    try {
      const response = await axios.get(`${URL()}/Community/getAirdropProposals/${communityAddress}`);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

export interface IAllocateTokenProposal {
  "CommunityId": string,
  "Addresses": {[key:string]:string}
}

export async function allocateTokenProposal(
payload: IAllocateTokenProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('allocateTokenProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'allocateTokenProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/allocateTokenProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}


export async function voteAllocateTokenProposal(
payload: IVoteProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('voteAllocateTokenProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'voteAllocateTokenProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/voteAllocateTokenProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getAllocationProposals(
  communityAddress: string
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/Community/getAllocationProposals/${communityAddress}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface ITransferProposal {
  "CommunityId": string,
  "Token": string,
  "To": string,
  "Amount": string
}

export async function transferProposal(
payload: ITransferProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('transferProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'transferProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/transferProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}


export async function voteTransferProposal(
payload: IVoteProposal,
additionalData: Object,
): Promise<any> {
  try {
    const { address, privateKey } = await getPriviWallet();
    const { signature } = await signPayload('voteTransferProposal', address, payload, privateKey);
    const requestData: IAPIRequestProps = {
      Function: 'voteTransferProposal',
      Address: address,
      Signature: signature,
      Payload: payload,
    };
    const body = {
        Data: requestData,
        AdditionalData: additionalData
    };
    const response = await axios.post(`${URL()}/Community/voteTransferProposal/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getTransferProposals(
  communityAddress: string
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/Community/getTransferProposals/${communityAddress}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IMakePayment {
  "Type": string,
  "Token": string,
  "From": string,
  "To": string,
  "Amount": string
}

export async function makePayment(
  payload: IMakePayment,
  additionalData: Object,
  ): Promise<any> {
    try {
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload('transfer', address, payload, privateKey);
      const requestData: IAPIRequestProps = {
        Function: 'transfer',
        Address: address,
        Signature: signature,
        Payload: payload,
      };
      const body = {
          Data: requestData,
          AdditionalData: additionalData
      };
      const response = await axios.post(`${URL()}/Community/makePayment/v2`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

//////////////////// MEMBER, TREASURER ///////////////////

// Treasurer

export interface IAddTreasurerProposal {
  "CommunityId": string,
  "Addresses": string[],
  "IsAddingTreasurers": boolean
}

export async function addTreasurerProposal(
  payload: IAddTreasurerProposal,
  additionalData: Object,
  ): Promise<any> {
    try {
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload('addTreasurerProposal', address, payload, privateKey);
      const requestData: IAPIRequestProps = {
        Function: 'addTreasurerProposal',
        Address: address,
        Signature: signature,
        Payload: payload,
      };
      const body = {
          Data: requestData,
          AdditionalData: additionalData
      };
      const response = await axios.post(`${URL()}/Community/addTreasurerProposal/v2`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
}

export interface IEjectTreasurerProposal {
  "CommunityId": string,
  "Addresses": string[]
}

export async function ejectTreasurerProposal(
  payload: IAddTreasurerProposal,
  additionalData: Object,
  ): Promise<any> {
    try {
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload('ejectTreasurerProposal', address, payload, privateKey);
      const requestData: IAPIRequestProps = {
        Function: 'ejectTreasurerProposal',
        Address: address,
        Signature: signature,
        Payload: payload,
      };
      const body = {
          Data: requestData,
          AdditionalData: additionalData
      };
      const response = await axios.post(`${URL()}/Community/ejectTreasurerProposal/v2`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
}

export async function voteTreasurerProposal(
  payload: IMakePayment,
  additionalData: Object,
  ): Promise<any> {
    try {
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload('voteTreasurerProposal', address, payload, privateKey);
      const requestData: IAPIRequestProps = {
        Function: 'voteTreasurerProposal',
        Address: address,
        Signature: signature,
        Payload: payload,
      };
      const body = {
          Data: requestData,
          AdditionalData: additionalData
      };
      const response = await axios.post(`${URL()}/Community/voteTreasurerProposal/v2`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

export async function getTreasurerProposals(
  communityAddress: string
): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/Community/getTreasurerProposals/${communityAddress}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

// Member
export async function inviteMember(
  creatorId: string,
  communityAddress: string,
  membersAddress: string[]
): Promise<any> {
  try {
    const body = {
      CreatorId: creatorId,
      CommunityAddress: communityAddress,
      MembersAddress: membersAddress
    }
    const response = await axios.post(`${URL()}/Community/inviteMember/v2`, body);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IJoiningRequest {
  "CommunityId": string,
}
  
export async function joiningRequest(
  payload: IJoiningRequest,
  additionalData: Object,
  ): Promise<any> {
    try {
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload('joiningRequest', address, payload, privateKey);
      const requestData: IAPIRequestProps = {
        Function: 'joiningRequest',
        Address: address,
        Signature: signature,
        Payload: payload,
      };
      const body = {
          Data: requestData,
          AdditionalData: additionalData
      };
      const response = await axios.post(`${URL()}/Community/joiningRequest/v2`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
  
export async function resolveJoiningRequest(
  payload: IVoteProposal,
  additionalData: Object,
  ): Promise<any> {
    try {
      const { address, privateKey } = await getPriviWallet();
      const { signature } = await signPayload('resolveJoiningRequest', address, payload, privateKey);
      const requestData: IAPIRequestProps = {
        Function: 'resolveJoiningRequest',
        Address: address,
        Signature: signature,
        Payload: payload,
      };
      const body = {
          Data: requestData,
          AdditionalData: additionalData
      };
      const response = await axios.post(`${URL()}/Community/resolveJoiningRequest/v2`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  export interface IEjectMemberProposal {
    "CommunityId": string,
    "Address": string
  }

  export async function ejectMemberProposal(
    payload: IEjectMemberProposal,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('ejectMemberProposal', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'ejectMemberProposal',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/Community/ejectMemberProposal/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
    }
    
  export async function voteEjectMemberProposal(
    payload: IVoteProposal,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('voteEjectMemberProposal', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'voteEjectMemberProposal',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/Community/voteEjectMemberProposal/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
    }

  export async function getMemberProposals(
    communityAddress: string
  ): Promise<any> {
    try {
      const response = await axios.get(`${URL()}/Community/getMemberProposals/${communityAddress}`);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  //////////////////// AUCTION, EXCHANGE (MEDIA ACQUISITION) ///////////////////

  export async function getJoinedCommunities(
    userAddress: string
  ): Promise<any> {
    try {
      const response = await axios.get(`${URL()}/Community/getJoinedCommunities/${userAddress}`);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  export interface IVoteMediaAcquisitionProposal {
    ProposalId: string;
    Member: string;
    Vote: string;
  }

  export async function voteMediaAcquisitionProposal(
    body: IVoteMediaAcquisitionProposal
  ): Promise<any> {
    try {
      const response = await axios.post(`${URL()}/Community/voteMediaAcquisitionProposal`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  export async function startMediaAcquisitionVoting(
    body: any
  ): Promise<any> {
    try {
      const response = await axios.post(`${URL()}/Community/startMediaAcquisitionVoting`, body);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  export interface IPlaceBidProposal {
    "CommunityId": string,
    "MediaSymbol": string,
    "TokenSymbol": string,
    "Amount": string
  }

  export async function placeBidProposal(
    payload: IPlaceBidProposal,
    additionalData: Object,
    ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('placeBidProposal', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'placeBidProposal',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/Community/placeBidProposal/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
    }

    export async function votePlaceBidProposal(
      payload: IVoteProposal,
      additionalData: Object,
      ): Promise<any> {
      try {
        const { address, privateKey } = await getPriviWallet();
        const { signature } = await signPayload('votePlaceBidProposal', address, payload, privateKey);
        const requestData: IAPIRequestProps = {
          Function: 'votePlaceBidProposal',
          Address: address,
          Signature: signature,
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/Community/votePlaceBidProposal/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
    }

    export interface IBuyingOrderProposal {
      "CommunityId": string,
      "ExchangeId": string,
      "OfferToken": string,
      "Amount": string
      "Price": string
    }
    
    export async function placeBuyingOrderProposal(
      payload: IBuyingOrderProposal,
      additionalData: Object,
      ): Promise<any> {
        try {
          const { address, privateKey } = await getPriviWallet();
          const { signature } = await signPayload('placeBuyingOrderProposal', address, payload, privateKey);
          const requestData: IAPIRequestProps = {
            Function: 'placeBuyingOrderProposal',
            Address: address,
            Signature: signature,
            Payload: payload,
          };
          const body = {
              Data: requestData,
              AdditionalData: additionalData
          };
          const response = await axios.post(`${URL()}/Community/placeBuyingOrderProposal/v2`, body);
          return response.data;
        } catch (e) {
          console.log(e);
          throw new Error(e.message);
        }
      }
    
      export async function voteBuyingOrderProposal(
        payload: IVoteProposal,
        additionalData: Object,
        ): Promise<any> {
          try {
            const { address, privateKey } = await getPriviWallet();
            const { signature } = await signPayload('voteBuyingOrderProposal', address, payload, privateKey);
            const requestData: IAPIRequestProps = {
              Function: 'voteBuyingOrderProposal',
              Address: address,
              Signature: signature,
              Payload: payload,
            };
            const body = {
                Data: requestData,
                AdditionalData: additionalData
            };
            const response = await axios.post(`${URL()}/Community/voteBuyingOrderProposal/v2`, body);
            return response.data;
          } catch (e) {
            console.log(e);
            throw new Error(e.message);
          }
        }

      export interface IBuyinProposal {
        "CommunityId": string,
        "ExchangeId": string,
        "OfferId": string,
        "Amount": string
      }

      export async function buyingProposal(
        payload: IBuyinProposal,
        additionalData: Object,
        ): Promise<any> {
          try {
            const { address, privateKey } = await getPriviWallet();
            const { signature } = await signPayload('buyingProposal', address, payload, privateKey);
            const requestData: IAPIRequestProps = {
              Function: 'buyingProposal',
              Address: address,
              Signature: signature,
              Payload: payload,
            };
            const body = {
                Data: requestData,
                AdditionalData: additionalData
            };
            const response = await axios.post(`${URL()}/Community/buyingProposal/v2`, body);
            return response.data;
          } catch (e) {
            console.log(e);
            throw new Error(e.message);
          }
        }
      
      export async function voteBuyingProposal(
        payload: IVoteProposal,
        additionalData: Object,
        ): Promise<any> {
          try {
            const { address, privateKey } = await getPriviWallet();
            const { signature } = await signPayload('voteBuyingProposal', address, payload, privateKey);
            const requestData: IAPIRequestProps = {
              Function: 'voteBuyingProposal',
              Address: address,
              Signature: signature,
              Payload: payload,
            };
            const body = {
                Data: requestData,
                AdditionalData: additionalData
            };
            const response = await axios.post(`${URL()}/Community/voteBuyingProposal/v2`, body);
            return response.data;
          } catch (e) {
            console.log(e);
            throw new Error(e.message);
          }
        }

    export async function getMemberMediaAcquisitionProposals(
      communityAddress: string
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/Community/getMemberMediaAcquisitionProposals/${communityAddress}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
    }

    export async function getMediaAcquisitionProposals(
      communityAddress: string
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/Community/getMediaAcquisitionProposals/${communityAddress}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
    }
    