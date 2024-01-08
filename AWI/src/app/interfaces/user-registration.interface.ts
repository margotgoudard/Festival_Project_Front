import { User } from "../model/user.model";
import { Creneau } from "./creaneau.interface";
import { Espace } from "./espace.interface";
import { Poste } from "./poste.interface";

export interface UserRegistration {
    isAffected: boolean;
    isAccepted: boolean;
    user: User;
    Espace: Espace;
    Creneau: Creneau;
  }