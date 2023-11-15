import { User } from "../model/user.model";
import { Creneau } from "./creaneau.interface";
import { Espace } from "./espace.interface";
import { Poste } from "./poste.interface";
import { Zone } from "./zone.interface";

export interface UserRegistration {
    user: User;
    poste: Poste;
    zone: Zone;
    espace: Espace;
    creneau: Creneau;
    // Add other properties if needed
  }