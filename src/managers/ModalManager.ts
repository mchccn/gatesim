import { html } from "../reified/Reified";
import { SandboxManager } from "./SandboxManager";

export class ModalManager {
    static #stack = new Array();

    static get container() {
        return document.querySelector<HTMLElement>(".modal-container")!;
    }

    static #onModalMount() {
        if (this.container.childElementCount <= 0) this.container.classList.remove("modal-inactive");
        else this.container.lastElementChild!.classList.add("modal-inactive");
    }

    static #onModalResolved() {
        if (this.container.childElementCount <= 0) this.container.classList.add("modal-inactive");
        else {
            this.container.lastElementChild!.classList.remove("modal-inactive");

            if (this.container.lastElementChild!.classList.contains("modal-alert")) {
                this.container.lastElementChild!.querySelector<HTMLElement>(".modal-ok")!.focus();
            }
        }
    }

    static async alert(message: string) {
        this.#onModalMount();

        const alert = html`
            <div class="modal modal-alert">
                <p class="modal-message">${message}</p>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                </div>
            </div>
        `;

        this.container.appendChild(alert);

        alert.querySelector<HTMLElement>(".modal-ok")!.focus();

        return new Promise<void>((resolve) => {
            const finish = () => resolve(undefined);

            SandboxManager.watchedUnresolvedPromises.add(finish);

            const done = () => {
                alert.remove();

                this.#onModalResolved();

                SandboxManager.watchedUnresolvedPromises.delete(finish);

                return finish();
            };

            const esc = (e: KeyboardEvent) => {
                if (e.code === "Escape") {
                    e.preventDefault();

                    document.removeEventListener("keydown", esc);

                    done();
                }
            };

            document.addEventListener("keydown", esc);

            const clickout = (e: MouseEvent) => {
                const target = e.target as HTMLElement;

                if (target !== this.container || this.container.lastElementChild !== alert) return;

                this.container.removeEventListener("mousedown", clickout);

                done();
            };

            this.container.addEventListener("mousedown", clickout);

            alert.querySelector<HTMLElement>(".modal-ok")!.addEventListener("click", done);
        });
    }

    static async confirm(message: string) {
        this.#onModalMount();

        const confirm = html`
            <div class="modal modal-confirm">
                <p class="modal-message">${message}</p>
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;

        this.container.appendChild(confirm);

        confirm.querySelector<HTMLElement>(".modal-ok")!.focus();

        return new Promise<boolean>((resolve) => {
            const finish = () => resolve(false);

            SandboxManager.watchedUnresolvedPromises.add(finish);

            const handler = (value: boolean) => () => {
                confirm.remove();

                this.#onModalResolved();

                SandboxManager.watchedUnresolvedPromises.delete(finish);

                return resolve(value);
            };

            const esc = (e: KeyboardEvent) => {
                if (e.code === "Escape") {
                    e.preventDefault();

                    document.removeEventListener("keydown", esc);

                    confirm.remove();

                    this.#onModalResolved();

                    SandboxManager.watchedUnresolvedPromises.delete(finish);

                    resolve(false);
                }
            };

            document.addEventListener("keydown", esc);

            const clickout = (e: MouseEvent) => {
                const target = e.target as HTMLElement;

                if (target !== this.container || this.container.lastElementChild !== confirm) return;

                this.container.removeEventListener("mousedown", clickout);

                confirm.remove();

                this.#onModalResolved();

                SandboxManager.watchedUnresolvedPromises.delete(finish);

                return resolve(false);
            };

            this.container.addEventListener("mousedown", clickout);

            confirm.querySelector<HTMLElement>(".modal-cancel")!.addEventListener("click", handler(false));

            confirm.querySelector<HTMLElement>(".modal-ok")!.addEventListener("click", handler(true));
        });
    }

    static async prompt(message: string) {
        this.#onModalMount();

        const prompt = html`
            <div class="modal modal-confirm">
                <p class="modal-message">${message}</p>
                <input class="modal-input" type="text" />
                <div class="button-container">
                    <button class="modal-ok">Ok</button>
                    <button class="modal-cancel">Cancel</button>
                </div>
            </div>
        `;

        this.container.appendChild(prompt);

        prompt.querySelector<HTMLElement>(".modal-input")!.focus();

        return new Promise<string | undefined>((resolve) => {
            const finish = () => resolve(undefined);

            SandboxManager.watchedUnresolvedPromises.add(finish);

            const done = () => {
                prompt.remove();

                this.#onModalResolved();

                SandboxManager.watchedUnresolvedPromises.delete(finish);
            };

            const esc = (e: KeyboardEvent) => {
                if (e.code === "Escape") {
                    e.preventDefault();

                    document.removeEventListener("keydown", esc);

                    done();

                    finish();
                }
            };

            document.addEventListener("keydown", esc);

            const clickout = (e: MouseEvent) => {
                const target = e.target as HTMLElement;

                if (target !== this.container || this.container.lastElementChild !== prompt) return;

                this.container.removeEventListener("mousedown", clickout);

                done();

                resolve(undefined);
            };

            this.container.addEventListener("mousedown", clickout);

            prompt.querySelector<HTMLElement>(".modal-input")!.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();

                    done();

                    return resolve(prompt.querySelector<HTMLInputElement>(".modal-input")!.value);
                }
            });

            prompt.querySelector<HTMLElement>(".modal-cancel")!.addEventListener("click", () => {
                done();

                return finish();
            });

            prompt.querySelector<HTMLElement>(".modal-ok")!.addEventListener("click", () => {
                done();

                return resolve(prompt.querySelector<HTMLInputElement>(".modal-input")!.value);
            });
        });
    }
}
