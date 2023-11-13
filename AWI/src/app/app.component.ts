import { Component } from '@angular/core';
import { User } from './model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) {
    
  }

  ngOnInit() {
    this.router.navigate(['/login']);
  }

  isLoginPage(): boolean {
    // Check if the current route is the login page
    return this.router.url.includes('/login');
  }
}