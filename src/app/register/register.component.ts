import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    language: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
  }
  
  onSubmit(): void {
    const { username, email, password, language } = this.form;
    this.authService.register(username, email, password,language).subscribe({
      next: result => {
        console.log(result);
        if(result.data && result.data.register.success){
          const user = result.data.register.user;
          if (user && user._id && user.accessToken) {
            this.isSignUpFailed = false;
            this.isSuccessful = true;
            this.authService.storeToken(user._id, user.accessToken);
            this.authService.saveUser(user);
            this.router.navigate(['/dashboard']);
          }
      }},
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}