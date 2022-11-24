import { queueNewContext } from "./contextmenu";
import { DraggingManager } from "./managers/DraggingManager";
import { MouseManager } from "./managers/MouseManager";
import { WiringManager } from "./managers/WiringManager";

queueNewContext(() => []);

MouseManager.start();
DraggingManager.listen();
WiringManager.loop();
