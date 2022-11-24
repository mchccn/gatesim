import { queueNewContext } from "./contextmenu";
import { DraggingManager } from "./managers/DraggingManager";
import { WiringManager } from "./managers/WiringManager";
import { MouseManager } from "./managers/MouseManager";

queueNewContext(() => []);

MouseManager.start();
DraggingManager.listen();
WiringManager.loop();
