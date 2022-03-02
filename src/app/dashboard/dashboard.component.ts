import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  
  isLoggedIn = false;
  username = "";
  isFR = false;
  isEN = false;
  
  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.isLoggedIn = true;
          const language = this.authService.getUser()!.language;
          this.isEN = language === "en";
          this.isFR = language === "fr";
          this.username = this.authService.getUser()!.username;
        }else{
          this.isLoggedIn = false;
          this.router.navigate(['/login']);
        }
      }
    );
  }

}
