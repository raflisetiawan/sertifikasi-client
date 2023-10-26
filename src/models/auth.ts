export interface SignInForm {
  email: string;
  password: string;
}

export interface SignInError {
  isError: boolean;
  message: string;
}
