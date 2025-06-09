import { MenuItem } from "./menu";

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
};
