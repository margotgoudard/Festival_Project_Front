import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JeuCsv } from '../components/import-csv/Jeu';
import { Jeu } from '../model/jeu.model';

@Injectable({
  providedIn: 'root'
})
export class JeuService {


  private apiUrl = 'https://festival-jeu-mtp-419077cc35e8.herokuapp.com';
  //private apiUrl = 'http://localhost:3000'; 

    
  constructor(private http: HttpClient) {}

  getJeuxByEspace(idEspace: number): Observable<Jeu[]> {
    const url = `${this.apiUrl}/jeux/${idEspace}`; 
    return this.http.get<Jeu[]>(url);
  }

  createJeux(jeux: Jeu[], idF: number): Observable<JeuCsv> {
    const url = `${this.apiUrl}/jeux/${idF}`;

    // Transformer le tableau de jeux en tableau de jeux pour l'api
    const arrayJeux = jeux.map(jeu => {
      return {
        "nomJeu"          : jeu.nomJeu,
        "auteur"          : jeu.auteur,
        "editeur"         : jeu.editeur,
        "exposant"        : jeu.Exposant,
        "nbJoueurs"       : jeu.nbJoueurs,
        "duree"           : jeu.Durée,
        "PAvant_Premiere" : jeu.PAvantPremière,
        "notice"          : jeu.Notice,
        "video"           : jeu.Vidéo,
        "description"     : jeu.Description,
        "recu"            : jeu.Reçu,
        "A_Animer"        : jeu.ÀAnimer,
        "present"         : jeu.Présent,
        "logoJeu"         : jeu.Logo,
        "image"           : jeu.Image,
        "typeJeu"         : jeu.Type,
        "themeJeu"        : jeu.Thèmes,
        "mecanismeJeu"    : jeu.Mécanismes,
        "ZoneBenevole"    : jeu.ZoneBenevole
      }
    })

    return this.http.post<Jeu>(url, {
      jeux : arrayJeux
    });
  }

  deleteJeux(): Observable<boolean> {
    const url = `${this.apiUrl}/jeux`;
    
    return this.http.delete<boolean>(url);
  }
  
}
