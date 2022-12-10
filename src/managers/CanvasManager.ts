import { GET_BACKGROUND_CANVAS_CTX, GET_FOREGROUND_CANVAS_CTX } from "../constants";

export class CanvasManager {
    static #jobs = new Set<(ctx: { bg: CanvasRenderingContext2D; fg: CanvasRenderingContext2D }) => void>();

    static #rAF = -1;

    static #render() {
        const bg = GET_BACKGROUND_CANVAS_CTX();
        const fg = GET_FOREGROUND_CANVAS_CTX();

        bg.canvas.width = window.innerWidth;
        bg.canvas.height = window.innerHeight;

        fg.canvas.width = window.innerWidth;
        fg.canvas.height = window.innerHeight;

        this.#jobs.forEach((job) => {
            job.call(undefined, { bg, fg });
        });
    }

    static start() {
        this.#render();

        const id = requestAnimationFrame(this.start.bind(this));

        this.#rAF = id;
    }

    static stop() {
        cancelAnimationFrame(this.#rAF);
    }

    static addJob(job: (ctx: { bg: CanvasRenderingContext2D; fg: CanvasRenderingContext2D }) => void) {
        this.#jobs.add(job);
    }

    static deleteJob(job: (ctx: { bg: CanvasRenderingContext2D; fg: CanvasRenderingContext2D }) => void) {
        this.#jobs.delete(job);
    }
}
