export const attachStyles = async (styles: string[]) => {
    // using ts extension because of webpack things
    const css = await Promise.all(styles.map((name) => import(`./${name}.ts`))).then((css) =>
        css.map((_) => _.default).join(""),
    );

    const style = document.createElement("style");

    style.textContent = css;

    document.head.appendChild(style);

    return new Promise<void>((resolve, reject) => {
        style.addEventListener("load", () => resolve(), { once: true });

        style.addEventListener("error", () => reject(), { once: true });
    });
};
