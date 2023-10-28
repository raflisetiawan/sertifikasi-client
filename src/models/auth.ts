export interface SignInForm {
  email: string;
  password: string;
}

export interface SignInError {
  isError: boolean;
  message: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  name: string;
  passwordConfirmation: string;
  phoneNumber: number;
}
export interface SignUpError {
  isError: boolean;
  message: string;
}
