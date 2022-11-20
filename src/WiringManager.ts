import { useCanvas } from "./canvas";

export class Wiring {
    constructor(readonly from: Element, readonly to: Element) {
        new MutationObserver(() => {
            to.classList.toggle("activated", from.classList.contains("activated"));
        }).observe(from, { attributeFilter: ["class"], attributes: true });
    }
}

export class WiringManager {
    static wires = new Array<Wiring>();

    static render() {
        const ctx = useCanvas();

        this.wires.forEach((wire) => {
            const from = wire.from.getBoundingClientRect();
            const to = wire.to.getBoundingClientRect();

            ctx.strokeStyle = wire.from.classList.contains("activated") ? "#ff2626" : "#dedede";

            ctx.lineWidth = 5;

            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            ctx.lineTo(to.x + to.width / 2, to.y + to.height / 2);
            ctx.closePath();
            ctx.stroke();
        });
    }
}
