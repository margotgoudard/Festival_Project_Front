import { Espace } from "./espace.interface";
import { PlanningItem } from "./planning-item.interface";

export interface Zone extends PlanningItem {
    espaces: Espace[];
  }