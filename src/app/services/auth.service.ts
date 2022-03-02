import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { USER_TOKEN, USER_ID, USER } from '../constants';
import { Apollo, gql } from 'apollo-angular';

export class User {
  username: string | undefined;
  email: string| undefined;
  accessToken: string| undefined;
  _id: string| undefined;
  language: string| undefined;
}

export class LoginResponse{
  login!: AuthResponse;
}

export class RegisterResponse{
  register!: AuthResponse;
}

export class AuthResponse {
  success: boolean| undefined;
  message: string| undefined;
  user: User| undefined;
}

export class CreateUserInput{
  email!: string;
  language!: string;
  password!: string;
  username!: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isAuth = new BehaviorSubject<boolean>(false);
  
  constructor(private apollo: Apollo) { }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuth.asObservable();
  }

  login(email:string,password:string) {
    return this.apollo.watchQuery<LoginResponse>({
      query: gql`
        query login($pwd: String!, $email: String!) {
          login(password: $pwd, email: $email) {
            success
            message
            user {
              _id
              username
              language
              accessToken
            }
          }
        }
      `,
      variables: {
        email: email,
        pwd: password
      }
    });
  }

  register(username:string,email:string,password:string,language:string){
    const createUserInput = new CreateUserInput();
    createUserInput.email = email;
    createUserInput.username = username;
    createUserInput.password = password;
    createUserInput.language = language;

    return this.apollo.mutate<RegisterResponse>({
      mutation: gql`
        mutation register($input: CreateUserInput!){
          register(user: $input) {
            success
            message
            user{
              _id
              username
              language
              email
              accessToken
            }
          }
        }
      `,
      variables: {
        input: createUserInput
      }
    });
  }

  storeToken(id:string,token:string){
    localStorage.setItem(USER_ID, id);
    localStorage.setItem(USER_TOKEN, token);
    this.isAuth.next(true);
  }

  getToken(): any {
    return localStorage.getItem(USER_TOKEN);
  }

  reLogin(){
    this.isAuth.next(true);
  }

  public signOut(){
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_TOKEN);
    this.isAuth.next(false);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER);
    window.sessionStorage.setItem(USER, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
