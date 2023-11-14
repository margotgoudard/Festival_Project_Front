import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/model/user.model'; // Assurez-vous d'importer le modèle User depuis le bon chemin.
import { UserRegistration } from '../interfaces/user-registration.interface';

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

  updateUserProfile(user: User): Observable<any> {
    // Simulate an HTTP request to update the user profile
    console.log('Updating user profile:', user);
    
    // Return a mock response or handle it as needed
    return of({ success: true, message: 'User profile updated successfully' });
  }

  private mockUserRegistrations: UserRegistration[] = [
    { posteId: 1, jour: 'Samedi', heureDebut: '08:00' },
    { posteId: 2, jour: 'Dimanche', heureDebut: '10:00' },
    // Add more mock data as needed
  ];

  getUserRegistrations(userId: string): Observable<UserRegistration[]> {
    // Simulate an HTTP request to get user registrations
    console.log('Fetching user registrations for user ID:', userId);

    // Return the mock user registrations
    return of(this.mockUserRegistrations);
  }
}