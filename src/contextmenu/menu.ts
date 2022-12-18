import type { MenuManagerActions } from "../managers/MenuManager";
import { debug } from "./debug";
import { insert } from "./insert";
import { io } from "./io";
import { serde } from "./serde";

export const menu: MenuManagerActions = [insert, io, serde, ...debug];
