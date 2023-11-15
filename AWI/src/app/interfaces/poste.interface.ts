import { Espace } from "./espace.interface";
import { PlanningItem } from "./planning-item.interface";
import { Zone } from "./zone.interface";

export interface Poste extends PlanningItem {
    zones: Zone[];
  }