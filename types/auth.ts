export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface SigninResponse {
  token: string;
  role: string;
}
