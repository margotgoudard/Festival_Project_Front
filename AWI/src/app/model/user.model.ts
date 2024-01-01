import { Role } from "./role.model";

export class User {
  constructor(
    public id: number = 0,
    public prenom: string = '',
    public nom: string = '',
    public pseudo: string = '',
    public associations: string = '',
    public email: string = '',
    public password: string = '',
    public numTel: number = 0,
    public chercheLogement: boolean = false,
    public taille: string = '',
    public vegetarian: boolean = false,
    public photoDeProfil: string = '',
    public role: Role, // Representing the Many-to-Many relationship
    public token: string = ''
  ) {}
}