export const loadStyles = () =>
    Promise.all(
        ["style", "component", "io", "contextmenu", "toast", "modals"].map((name) => {
            const link = document.createElement("link");

            link.rel = "stylesheet";

            link.href = "./styles/" + name + ".css";

            document.head.appendChild(link);

            return new Promise<void>((resolve, reject) => {
                link.onload = () => resolve();

                link.onerror = () => reject();
            });
        }),
    );
