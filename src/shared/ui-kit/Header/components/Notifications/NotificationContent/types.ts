export enum TransferType {
  // Coinb:
  Mint = "Mint",
  Burn = "Burn",
  Transfer = "Transfer",
  StreamingPayment = "StreamingPayment",

  // HTLC:
  HTLCSwap = "HTLCSwap",

  // PODMedia:
  PodMediaInvesting = "PodMediaInvesting",
  PodMediaTradeBuy = "PodMediaTradeBuy",
  PodMediaTradeMint = "PodMediaTradeMint",
  PodMediaTradeSell = "PodMediaTradeSell",
  PodMediaTradeBurn = "PodMediaTradeBurn",

  // Media:
  MediaView = "MediaView",
  MediaReward = "MediaReward",
  MediaType = "MediaType",
  MediaTip = "MediaTip",

  // Auction:
  CreateAuction = "CreateAuction",
  RestoreAuction = "RestoreAuction",
  WithdrawAuctionMedia = "WithdrawAuctionMedia",
  PlaceBid = "PlaceBid",
  RestoreBid = "RestoreBid",

  // Community:
  CommunityTokenAirdrop = "CommunityTokenAirdrop",
  CommunityTokenAllocation = "CommunityTokenAllocation",
  RefundClaimedMedia = "RefundClaimedMedia",

  Unknown = "Unknown",
}
