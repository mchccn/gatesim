const ctx = document.querySelector("canvas")!.getContext("2d")!;

export function useCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    return ctx;
}
