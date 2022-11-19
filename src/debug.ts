const ctx = document.querySelector("canvas")!.getContext("2d")!;

export function useDebugCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    return ctx;
}
