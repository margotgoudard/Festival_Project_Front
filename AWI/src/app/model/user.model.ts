export class User {
    constructor(
      public id: number = 0,
      public prenom: string = '',
      public nom: string = '',
      public association: string = '',
      public mail: string = '',
      public phone: string = '',
      public password: string = ''
    ) {}
  }