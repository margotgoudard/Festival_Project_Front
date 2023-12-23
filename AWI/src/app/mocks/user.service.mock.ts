import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/model/user.model'; // Assurez-vous d'importer le modèle User depuis le bon chemin.
import { UserRegistration } from '../interfaces/user-registration.interface';
import { Poste } from '../interfaces/poste.interface';
import { Espace } from '../interfaces/espace.interface';
import { Zone } from '../interfaces/zone.interface';
import { Creneau } from '../interfaces/creaneau.interface';
import { Jour } from '../enumeration/jour.enum';

@Injectable({
  providedIn: 'root',
})
export class MockUserService {


  // Mock des données d'utilisateur
  private mockUser: User[] = [{
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
  },
  {
    id: 2,
    nom: 'Margot',
    prenom: 'Goudard',
    mail: 'goudard.margot@hotmail.com',
    associations: ['Association 1', 'Association 2'],
    pseudo: 'utilisateur',
    password : 'motdepasse',
    tailleTShirt: 'M',
    isVegetarian: true,
    role: 'benevole',
  }];

  private mockPostes: Poste[] = [
    {
        id: 1,
        nom: 'poste1',
        description: 'description du poste1',
        placedisponible: 5,
        zones: [{
          id: 1,
          nom: 'zone1',
          description: 'description du zone11',
          placedisponible: 5,
          espaces: [{
            id: 1,
            nom: 'espace1',
            description: 'description espace1',
            placedisponible: 5
        },
        {
          id: 2,
          nom: 'espace2',
          description: 'description espace2',
          placedisponible: 5
      }]
      }]
    }
];

private mockZones: Zone[] = [
  {
      id: 1,
      nom: 'zone1',
      description: 'description du zone11',
      placedisponible: 5,
      espaces: [{
        id: 1,
        nom: 'espace1',
        description: 'description espace1',
        placedisponible: 5
    }]
  }
];

private mockEspaces: Espace[] = [
  {
      id: 1,
      nom: 'espace1',
      description: 'description du espace1',
      placedisponible: 5,
  }
];

private mockCreneaux: Creneau[] = [{id: 1,heureDebut: '10h', heureFin: '11h' ,jour : Jour.Samedi}, {id: 2,heureDebut: '11h', heureFin: '12h' ,jour : Jour.Dimanche}];

  getUserById(id: any): Observable<User> {
    // Simulez une requête HTTP en renvoyant les données de l'utilisateur mocké
    return of(this.mockUser[id-1]);
  }

  updateUserProfile(user: User): Observable<any> {
    // Simulate an HTTP request to update the user profile
    console.log('Updating user profile:', user);
    
    // Return a mock response or handle it as needed
    return of({ success: true, message: 'User profile updated successfully' });
  }

  private mockUsersRegistrations: UserRegistration[] = [
    {
      user: this.mockUser[1],
      poste: this.mockPostes[0],
      zone: this.mockPostes[0].zones[0],
      espace: this.mockPostes[0].zones[0].espaces[0],
      creneau: this.mockCreneaux[0]
    },
    {
      user: this.mockUser[0],
      poste: this.mockPostes[0],
      zone: this.mockPostes[0].zones[0],
      espace: this.mockPostes[0].zones[0].espaces[1],
      creneau: this.mockCreneaux[1]
    }
  ];

  getUserRegistrations(userId: number): Observable<UserRegistration[]> {
    // Simulate an HTTP request by returning the mock user registrations
    return of(this.mockUsersRegistrations.filter(registration => registration.user.id === userId));
  }


  getUsersRegistration(): Observable<UserRegistration[]> {
    // Simulez une requête HTTP en renvoyant les données de plusieurs utilisateurs mockés
    return of(this.mockUsersRegistrations);
  }

  private userId: number | null = null;

  setUserId(userId: number | null) {
    this.userId = userId;
  }

  getUserId(): number | null {
    return this.userId;
  }
}