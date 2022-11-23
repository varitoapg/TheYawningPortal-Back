export interface UserRegisterCredentials {
  username: string;
  password: string;
  email: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface UserTokenPayload {
  username: string;
  id: string;
}
