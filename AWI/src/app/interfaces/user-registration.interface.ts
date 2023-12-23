import { User } from "../model/user.model";
import { Creneau } from "./creaneau.interface";
import { Espace } from "./espace.interface";
import { Poste } from "./poste.interface";

export interface UserRegistration {
    user: User;
    espace: Espace;
    creneau: Creneau;
  }