import { ACTIVATED_CSS_COLOR, TOAST_DURATION } from "../constants";
import { ToastManager } from "../managers/ToastManager";

/** asks user to input a file */
export async function fileInput() {
    const input = Object.assign(document.createElement("input"), { type: "file" });

    input.click();

    const file = await new Promise<File | undefined>((resolve) => {
        input.onchange = () => resolve(input.files?.[0] ?? undefined);

        input.onerror = () => resolve(undefined);
    });

    if (!file)
        return ToastManager.toast({
            message: "No file was provided.",
            color: ACTIVATED_CSS_COLOR,
            duration: TOAST_DURATION,
        });

    const reader = new FileReader();

    reader.readAsText(file);

    const raw = await new Promise<string | undefined>((resolve) => {
        reader.onload = () => resolve(reader.result?.toString() ?? undefined);

        reader.onerror = () => resolve(undefined);
    });

    if (!raw)
        return ToastManager.toast({
            message: "Unable to read the file.",
            color: ACTIVATED_CSS_COLOR,
            duration: TOAST_DURATION,
        });

    return raw;
}

/** downloads the contents as a file */
export async function downloadFile(contents: BlobPart[]) {
    Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(
            new Blob(contents, {
                type: "text/plain",
            }),
        ),
        download: "table.gatesim.txt",
    }).click();
}
