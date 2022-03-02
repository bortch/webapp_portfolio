import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'The Client App';
  isLoggedIn = false;
  username?: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          this.username = this.authService.getUser()!.username;
        }
      }
    ); 
    if (this.authService.getToken()) {
      this.isLoggedIn = true;
      this.authService.reLogin();
    }
  }

  logout(): void {
    this.authService.signOut();
    window.location.reload();
  }
}
