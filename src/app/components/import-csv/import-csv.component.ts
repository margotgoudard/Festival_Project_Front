import { Component } from '@angular/core';
import { JeuService } from 'src/app/services/jeu.service';
import { Jeu } from 'src/app/model/jeu.model';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.scss']
})
export class ImportCsvComponent {
  constructor(private jeuService: JeuService) {}

  public previewImage(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => { //définition d'une méthode à exécuter qd le fichier est chargé
      var jeux: Jeu[] = this.convertCsvToJeux(e.target.result);

      var jeuxBundle = this.chunkArray(jeux, 50);

      jeuxBundle.forEach(jeuxBundle => {
        var contin = false;
        this.jeuService.createJeux(jeuxBundle).subscribe((response) => {
          console.log('Jeux créés avec succès', response);
          contin = true;
        })
        while (!contin) {
          // on attend que la requete est fini pour passer à a suivante.
        }
      });
      
    };
    reader.readAsText(event.target.files[0], 'UTF-8'); //ici le chargement du fichier
  }

  // Function écrite par chatgpt pour découper un tableau en plusieurs tableaux.
  private chunkArray(array: Jeu[], chunkSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
  // Convertit un csv en tableau decreateJeu Jeu
  private convertCsvToJeux(csv: string): Jeu[] {
    // On récupère chaque ligne du csv, sauf la premiere qui contient les noms des colonnes
    var csvLines = csv
      .split('\n')
      .filter((line) => line.length > 0)
      .slice(1)
      
    // On cree un tableau de Jeu vide
    var jeux: Jeu[] = [];

    // On itere sur chaque ligne du csv
    csvLines.forEach((line, y) => {

      // Certains champs contiennent des virgules, on split sur les guilemets pour determiner lesquels
      var splitLine = line.split('"');
      var i: number = 0;
      var values: string[] = [];

      // On itere sur chaque partie de la ligne
      splitLine.forEach((splitLine) => {
        // Si la partie de la ligne commence ou finit par une virgule, c'est qu'elle n'est pas entre guillemets, on va donc la split sur la virgule
        if (splitLine.trim().startsWith(',') || splitLine.trim().endsWith(',')) {
          // On enleve la premiere et derniere virgule
          // Ca nous arrange pour split sur la virgule après, sinon la premiere ou derniere case est vide
          if (splitLine.trim().startsWith(','))
            splitLine = splitLine.substring(1);

          if (splitLine.trim().endsWith(','))
            splitLine = splitLine.substring(0, splitLine.length - 1);

          // On split sur la virgule, et on ajoute chaque partie au tableau
          var splitLine2 = splitLine.split(',');
          splitLine2.forEach((splitLine3) => {
            values[i] = splitLine3;
            i++;
          });
        }
        // Sinon, c'est qu'elle est entre guillemets, on l'ajoute donc telle quelle
        else {
          values[i] = splitLine;
          i++;
        }
      })
      //jeux.push(new Jeu(values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[14], values[15], values[16], values[17], values[18], values[19], values[20], values[21], values[22], values[23], values[24], values[25] ));
      jeux.push(
        new Jeu(
          values[0],
          values[1],
          values[2],
          values[3],
          values[4],
          values[5],
          values[6],
          values[7],
          values[8],
          values[9],
          values[10],
          values[11],
          values[12],
          values[13], //zone plan
          values[14],
          values[15],
          values[16],
          values[17],
          values[18],
          values[19],
          values[20], //tags
          values[21],
          values[22],
          values[23],
          values[24]
      ));
    });
    // console.log(jeux);
    return jeux;
  }
}
