export type RegisterZApiCallbackInput = {
  instanceId: string;
  instanceToken: string;
  clientToken: string;
  callbackUrl: string;
};

export interface ZApiProvider {
  registerCallback(input: RegisterZApiCallbackInput): Promise<void>;
}
