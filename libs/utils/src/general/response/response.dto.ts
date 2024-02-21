export enum ResponseStatusEnum {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
export type ResponseType = {
  status: ResponseStatusEnum;
  data: Record<string, unknown>;
};
