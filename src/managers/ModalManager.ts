import { html } from "../reified/Reified";

export class ModalManager {
    static readonly container = document.querySelector<HTMLElement>(".modal-container")!;

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
            alert.querySelector<HTMLElement>(".modal-ok")!.addEventListener("click", () => {
                alert.remove();

                this.#onModalResolved();

                return resolve(undefined);
            });
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
            confirm.querySelector<HTMLElement>(".modal-cancel")!.addEventListener("click", () => {
                confirm.remove();

                this.#onModalResolved();

                return resolve(false);
            });

            confirm.querySelector<HTMLElement>(".modal-ok")!.addEventListener("click", () => {
                confirm.remove();

                this.#onModalResolved();

                return resolve(true);
            });
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
            prompt.querySelector<HTMLElement>(".modal-input")!.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    prompt.remove();

                    this.#onModalResolved();

                    return resolve(prompt.querySelector<HTMLInputElement>(".modal-input")!.value);
                }
            });

            prompt.querySelector<HTMLElement>(".modal-cancel")!.addEventListener("click", () => {
                prompt.remove();

                this.#onModalResolved();

                return resolve(undefined);
            });

            prompt.querySelector<HTMLElement>(".modal-ok")!.addEventListener("click", () => {
                prompt.remove();

                this.#onModalResolved();

                return resolve(prompt.querySelector<HTMLInputElement>(".modal-input")!.value);
            });
        });
    }
}
