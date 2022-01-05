export const getPodStatus = (pod: any) => {
  if(pod && pod.FundingDate && pod.FundingDate > Math.trunc(Date.now()/1000)) {
    return 'Funding';
  } else if (pod && pod.FundingDate && pod.FundingDate <= Math.trunc(Date.now()/1000) &&
    (pod.RaisedFunds || 0) < pod.FundingTarget) {
    return 'Funding Failed';
  } else if (pod && pod.FundingDate && pod.FundingDate <= Math.trunc(Date.now()/1000) &&
    (pod.RaisedFunds || 0) >= pod.FundingTarget) {
    return 'Funded';
  } else {
    return '';
  }
}