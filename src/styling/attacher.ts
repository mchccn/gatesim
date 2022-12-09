export const attachStyles = async () => {
    const css = await Promise.all(
        ["style", "component", "io", "contextmenu", "toast", "modals", "buttons", "darkmode"].map(
            (name) => import(`./${name}.ts`),
        ),
    ).then((css) => css.map((_) => _.default).join(""));

    const style = document.createElement("style");

    style.textContent = css;

    document.head.appendChild(style);

    return new Promise((resolve, reject) => {
        style.addEventListener("load", resolve, { once: true });

        style.addEventListener("error", reject, { once: true });
    });
};
