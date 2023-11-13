export interface SubscriptionResponse {
  data: SubscriptionResponseData;
  meta: null;
}

export interface SubscriptionResponseData {
  ocrPremiumCycleCallsLeft: number;
  ocrPremiumCycleStart:     Date;
}
