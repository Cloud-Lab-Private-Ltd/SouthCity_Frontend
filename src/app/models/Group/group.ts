import { EntityBase } from "../EntityBase";

export interface GroupModel extends EntityBase {
    name: string;
    description: string;
    // allowedGroup: string[];
    updatedAt: string;
  }