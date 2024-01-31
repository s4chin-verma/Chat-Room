export interface RegisterUserPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserPayload {
  username: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ChangePasswordPayload {
  password: string;
  token?: string;
}
