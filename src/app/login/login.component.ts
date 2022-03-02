import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  form: any = {
    email: null,
    password: null
  };
 
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
 
  constructor(private authService: AuthService, private router: Router) { }
 
  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.isLoggedIn = true;
      this.authService.reLogin();
    }
  }
 
  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login(email, password).valueChanges.subscribe({
      next: result => {
        console.log(result.data.login);
        if (result.data.login && result.data.login.success) {
          const user = result.data.login.user;
          if (user && user._id && user.accessToken) {
            this.authService.storeToken(user._id, user.accessToken);
            this.authService.saveUser(user);
            this.isLoggedIn = true;
            this.isLoginFailed = false;
            this.router.navigate(['/dashboard']);
          }
      }},
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.isLoggedIn = false;
      }
    });
  }
}