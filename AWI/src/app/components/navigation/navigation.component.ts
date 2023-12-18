import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  user$!: Observable<any>;

    constructor( private authService : AuthService) {}

    ngOnInit() {
        // Initialisez votre utilisateur ici, par exemple à partir d'un service d'authentification
        //this.user$ =  this.authService.getCurrentUser();/* Récupérez l'utilisateur actuel */;
    }

}
