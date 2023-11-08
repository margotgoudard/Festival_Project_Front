export class User {
    constructor(
      public id: number = 0,
      public prenom: string = '',
      public nom: string = '',
      public pseudo: string = '',
      public associations: string[] = [],
      public mail: string = '',
      public password: string = '',
      public tailleTShirt: string = '',
      public isVegetarian: boolean = false
    ) {}
  }