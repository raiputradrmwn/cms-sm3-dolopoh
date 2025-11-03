export type LoginPayload = { email: string; password: string };

export type RawLoginResponse = {
  meta?: any;
  data?: { token?: string };
  token?: string;
  access_token?: string;
  user?: any;
};

export type LoginResponse = {
  token: string;
  user?: any;
};
