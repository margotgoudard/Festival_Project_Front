import { PlanningItem } from "./planning-item.interface";
import { Poste } from "./poste.interface";

export interface Espace extends PlanningItem {
    poste: Poste;
  }