import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  user$!: Observable<any>;
  userRole: number = 0; // Initialize userRole with a default value

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    const pseudo = this.authService.getLoggedInUserPseudo() ?? '';
      this.userService.getUserRole(pseudo).subscribe((userRoleObject: any) => {
      this.userRole = userRoleObject.firstRoleId;
      console.log('User Role ID:', this.userRole);
    });
}
}