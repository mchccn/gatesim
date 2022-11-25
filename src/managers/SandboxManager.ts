import { html, Reified } from "../reified/Reified";
import { DraggingManager } from "./DraggingManager";
import { MenuManager, MenuManagerActions } from "./MenuManager";
import { MouseManager } from "./MouseManager";
import { Wiring, WiringManager } from "./WiringManager";

type SandboxConfig = {
    menu?: MenuManagerActions;
    initial?: [Reified[], Wiring[]];
    limits?: ({ type: "INPUT" | "OUTPUT"; count: number } | { type: "COMPONENT"; name?: string; count: number })[];
    states?: { inputs?: boolean[]; outputs?: boolean[]; callback: () => void }[];
};

export class SandboxManager {
    static queueNewContext: ReturnType<typeof MenuManager["use"]>[0];

    static watchedUnresolvedPromises = new Set<() => void>();

    static setup(config: SandboxConfig) {
        document.body.innerHTML = "";

        document.body.appendChild(html`<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(html`<div class="reified-root"></div>`);
        document.body.appendChild(html`<canvas></canvas>`);
        document.body.appendChild(html`<div class="toasts-container"></div>`);

        if (config.menu) MenuManager.use(Reified.root, config.menu);

        MouseManager.start();
        DraggingManager.listen();
        WiringManager.loop();

        //TODO: Implement initial state
        //TODO: Implement limits
        //TODO: Implement diagram state check callbacks
    }

    static reset() {
        MouseManager.reset();
        DraggingManager.reset();
        WiringManager.stop();

        MenuManager.remove(Reified.root);

        Reified.active.forEach((component) => component.detach());

        WiringManager.wires.forEach((wire) => wire.destroy());

        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));

        this.watchedUnresolvedPromises.clear();
    }
}
