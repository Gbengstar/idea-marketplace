export type PromotionConfigurationSettings = { renewTimeMilliseconds: number };

export type PromotionEventData = {
  dueDate: Date;
  account: string;
  renewTimeMilliseconds: number;
};
