class User {
  username: string | undefined;
  email: string| undefined;
  accessToken: string| undefined;
  _id: string| undefined;
  language: string| undefined;
}

class AuthResponse {
  success: boolean| undefined;
  message: string| undefined;
  user: User| undefined;
}

export class LoginResponse{
  login!: AuthResponse;
}

export class RegisterResponse{
  register!: AuthResponse;
}

export class CreateUserInput{
  email!: string;
  language!: string;
  password!: string;
  username!: string;
}