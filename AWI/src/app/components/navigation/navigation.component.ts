import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MockAuthService } from 'src/app/mocks/auth.service.mock';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  user$!: Observable<any>;

    constructor( private authService : MockAuthService) {}

    ngOnInit() {
        // Initialisez votre utilisateur ici, par exemple à partir d'un service d'authentification
        this.user$ =  this.authService.getCurrentUser();/* Récupérez l'utilisateur actuel */;
    }

}
