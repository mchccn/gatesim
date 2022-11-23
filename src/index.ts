import { queueNewContext } from "./contextmenu";
import { DraggingManager } from "./DraggingManager";
import { MouseTracker } from "./MouseTracker";
import { WiringManager } from "./WiringManager";

queueNewContext(() => []);

MouseTracker.start();
DraggingManager.listen();
WiringManager.loop();
