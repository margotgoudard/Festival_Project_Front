import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/model/user.model'; // Assurez-vous d'importer le modèle User depuis le bon chemin.

@Injectable({
  providedIn: 'root',
})
export class MockUserService {
  // Mock des données d'utilisateur
  private mockUser: User = {
    id: 1,
    nom: 'John',
    prenom: 'Doe',
    mail: 'johndoe@example.com',
    associations: ['Association 1', 'Association 2'],
    pseudo: 'utilisateur',
    password : 'motdepasse',
    tailleTShirt: 'M',
    isVegetarian: true,
    role: 'benevole',
  };

  getUserById(id: number): Observable<User> {
    // Simulez une requête HTTP en renvoyant les données de l'utilisateur mocké
    return of(this.mockUser);
  }
}