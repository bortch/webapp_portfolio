import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { USER_TOKEN, USER_ID, USER } from '../constants';
import { Apollo, gql } from 'apollo-angular';
import { CreateUserInput, LoginResponse, RegisterResponse } from './auth.dto';


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
    /**
     * Login user
     */
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
    /** 
     * Register new user
    */
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

  public storeToken(id:string,token:string){
    /** 
     * Store user id and token in local storage
     */
    localStorage.setItem(USER_ID, id);
    localStorage.setItem(USER_TOKEN, token);
    this.isAuth.next(true);
  }

  public getToken(): any {
    /**
     * Get token from local storage
     */
    return localStorage.getItem(USER_TOKEN);
  }

  public reLogin(){
    /**
     * Re-login user automatically
     */
    this.isAuth.next(true);
  }

  public signOut(){
    /**
     * Sign out user
     * Remove user information from local storage
     * and propagate change in isAuth
     */ 
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_TOKEN);
    this.isAuth.next(false);
  }

  public saveUser(user: any): void {
    /**
     * Save user details in local storage
     */
    window.sessionStorage.removeItem(USER);
    window.sessionStorage.setItem(USER, JSON.stringify(user));
  }

  public getUser(): any {
    /**
     * Get user details from local storage
     */
    const user = window.sessionStorage.getItem(USER);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
}
