import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportCsvService {
  //private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com'; 
  private apiUrl = 'http://localhost:3000'; 
  constructor() {

  }
}
