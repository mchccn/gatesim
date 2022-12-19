import { IS_MAC_OS } from "../circular";
import { KeybindsManager } from "../managers/KeybindsManager";
import { ModalManager } from "../managers/ModalManager";
import { SettingsManager } from "../managers/SettingsManager";
import { StorageManager } from "../managers/StorageManager";
import { html } from "../reified/Reified";

export const howtouse = {
    ...KeybindsManager.assign("Shift+Slash", async () => {
        await ModalManager.popup(html`
            <div class="help">
                <h1>gatesim</h1>

                <p>
                    This is a logical circuits playground that is lightweight and tunable, including a suite of useful
                    tools. However, it has a steeper learning curve compared to other playgrounds.
                </p>

                <p>Right click on the blank screen to get started. Press '/' to bring up a cheatsheet for keybinds.</p>

                <p>
                    If there are performance problems, you may want to increase gate delay, or disable fancy wires in
                    the settings.
                </p>

                <details>
                    <summary>Examples</summary>
                    <ul>
                        <li><a href="?premade=example:halfadder">Half adder</a></li>
                        <li><a href="?premade=example:fulladder">Full adder</a></li>
                    </ul>
                </details>

                <details>
                    <summary>Exercises</summary>
                    <ul>
                        <li><a href="?premade=nand:not">NAND-only NOT</a></li>
                        <li><a href="?premade=nand:and">NAND-only AND</a></li>
                        <li><a href="?premade=nand:or">NAND-only OR</a></li>
                        <li><a href="?premade=nand:xor">NAND-only XOR</a></li>
                    </ul>
                </details>
            </div>
        `);

        StorageManager.set("usedhelp", "true");
    }),
    ...KeybindsManager.assign("Slash", async () => {
        await ModalManager.popup(html`
            <div class="help">
                <h1>keybinds</h1>

                <table>
                    <thead>
                        <tr>
                            <td><b>Description</b></td>
                            <td><b>Action</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Create selection</td>
                            <td>Hold + drag</td>
                        </tr>
                        <tr>
                            <td>Add to selection</td>
                            <td>${IS_MAC_OS ? "⌘ + click" : "Ctrl + click"}</td>
                        </tr>
                        <tr>
                            <td>Select all</td>
                            <td>${IS_MAC_OS ? "⌘ A" : "Ctrl A"}</td>
                        </tr>
                        <tr>
                            <td>Undo</td>
                            <td>${IS_MAC_OS ? "⌘ Z" : "Ctrl Z"}</td>
                        </tr>
                        <tr>
                            <td>Redo</td>
                            <td>${IS_MAC_OS ? "⬆ ⌘ Z" : "Ctrl Shift Z"}</td>
                        </tr>
                        <tr>
                            <td>Create connection</td>
                            <td>Q + click</td>
                        </tr>
                        <tr>
                            <td>Insert logic gate</td>
                            <td>A + click</td>
                        </tr>
                        <tr>
                            <td>Insert miscellaneous component</td>
                            <td>S + click</td>
                        </tr>
                        <tr>
                            <td>Insert input</td>
                            <td>I</td>
                        </tr>
                        <tr>
                            <td>Insert output</td>
                            <td>O</td>
                        </tr>
                        <tr>
                            <td>Delete component</td>
                            <td>${IS_MAC_OS ? "⌘ X" : "Ctrl X"}</td>
                        </tr>
                        <tr>
                            <td>Delete connections</td>
                            <td>${IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X"}</td>
                        </tr>
                        <tr>
                            <td>Move selected components up</td>
                            <td>${IS_MAC_OS ? "▲" : "↑"}</td>
                        </tr>
                        <tr>
                            <td>Move selected components down</td>
                            <td>${IS_MAC_OS ? "▼" : "↓"}</td>
                        </tr>
                        <tr>
                            <td>Move selected components left</td>
                            <td>${IS_MAC_OS ? "◀" : "←"}</td>
                        </tr>
                        <tr>
                            <td>Move selected components right</td>
                            <td>${IS_MAC_OS ? "▶" : "→"}</td>
                        </tr>
                        <tr>
                            <td>Rotate selected components clockwise</td>
                            <td>R</td>
                        </tr>
                        <tr>
                            <td>Rotate selected components counterclockwise</td>
                            <td>${IS_MAC_OS ? "⬆ R" : "Shift R"}</td>
                        </tr>
                        <tr>
                            <td>Delete selected components</td>
                            <td>${IS_MAC_OS ? "Delete" : "Backspace"}</td>
                        </tr>
                        <tr>
                            <td>Delete selected component's connections</td>
                            <td>${IS_MAC_OS ? "⬆ Delete" : "Shift Backspace"}</td>
                        </tr>
                        <tr>
                            <td>Open help</td>
                            <td>?</td>
                        </tr>
                        <tr>
                            <td>Open this cheatsheet</td>
                            <td>/</td>
                        </tr>
                        <tr>
                            <td>Copy link</td>
                            <td>${IS_MAC_OS ? "⌘ K" : "Ctrl K"}</td>
                        </tr>
                        <tr>
                            <td>Save under name</td>
                            <td>${IS_MAC_OS ? "⌘ S" : "Ctrl S"}</td>
                        </tr>
                        <tr>
                            <td>Load save</td>
                            <td>${IS_MAC_OS ? "⌘ O" : "Ctrl O"}</td>
                        </tr>
                        <tr>
                            <td>Save as file</td>
                            <td>${IS_MAC_OS ? "⬆ ⌘ S" : "Ctrl Shift S"}</td>
                        </tr>
                        <tr>
                            <td>Import from file</td>
                            <td>${IS_MAC_OS ? "⬆ ⌘ O" : "Ctrl Shift O"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `);
    }),
    ["Backslash"]: async () => {
        await SettingsManager.bringUpForm();
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
