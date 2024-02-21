import { VerifyCallback } from 'passport-google-oauth20';

export type ValidateGoogleAuthDto = {
  accessToken: string;
  refreshToken: string;
  profile: any;
  callBack: VerifyCallback;
};
