// Types and Interfaces for FTPOD

export interface FTPod {
  podId: string; //PodId
  creatorId: string;
  type: string;
  token: string;
  frequency: number;
  country: string;
  targetFunds: number; //"target"
  interest: number;
  liquidation: number;
  trustScore: number;
  endorsementScore: number;
  expirationDate: Date;
  collaterals: Map<string, number>;
  name: string;
  description: string;
  podTokenSupply: number;
  //  imageFile: File;
  imageUrl: string;
  followers: string[];
  hashtags: string[];
}
