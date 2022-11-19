export class ZoomingManager {
    static target: HTMLElement | undefined;

    static observe(element: HTMLElement) {
        if (this.target) throw new Error(`Already observing an element.`);

        this.target = element;

        element.style.scale = "1";

        document.addEventListener("wheel", (e) => {
            element.style.scale = Math.min(
                Math.max(
                    +element.style.scale + ((Math.sign(e.deltaY) / 100) * Math.abs(e.deltaY)) / 100,
                    0.1
                ),
                2
            ).toString();
        });
    }

    static unobserve() {
        this.target = undefined;
    }
}
