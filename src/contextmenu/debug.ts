import { ACTIVATED_CSS_COLOR, IN_DEBUG_MODE, LIGHT_GRAY_CSS_COLOR, TOAST_DURATION } from "../constants";
import { CanvasManager } from "../managers/CanvasManager";
import type { MenuManagerActions } from "../managers/MenuManager";
import { ModalManager } from "../managers/ModalManager";
import { StorageManager } from "../managers/StorageManager";
import { ToastManager } from "../managers/ToastManager";

export const debug = (
    IN_DEBUG_MODE
        ? [
              {
                  "test-alert": {
                      label: "Test alert",
                      callback: async () => {
                          console.log(await ModalManager.alert("This is an alert."));
                      },
                  },
                  "test-confirm": {
                      label: "Test confirm",
                      callback: async () => {
                          console.log(await ModalManager.confirm("This is a confirmation."));
                      },
                  },
                  "test-prompt": {
                      label: "Test prompt",
                      callback: async () => {
                          console.log(await ModalManager.prompt("This is a prompt."));
                      },
                  },
                  "test-toast": {
                      label: "Test toast",
                      callback: async () => {
                          console.log(
                              await ToastManager.toast({
                                  message: "This is a toast.",
                                  color: LIGHT_GRAY_CSS_COLOR,
                                  duration: TOAST_DURATION,
                              }),
                          );
                      },
                  },
              },
              {
                  "wipe-storage": {
                      label: "Wipe storage",
                      callback: () => {
                          StorageManager.storage.clear();
                      },
                  },
                  "wipe-save": {
                      label: "Wipe named save",
                      callback: async () => {
                          const save = await ModalManager.prompt("");

                          if (save) {
                              if (!StorageManager.has("saves:" + save))
                                  return ToastManager.toast({
                                      message: "No saves exist with that name.",
                                      color: ACTIVATED_CSS_COLOR,
                                      duration: TOAST_DURATION,
                                  });

                              StorageManager.delete("saves:" + save);

                              location.reload();
                          }
                      },
                  },
              },
              {
                  "stop-render": {
                      label: "Stop rendering",
                      callback: () => {
                          CanvasManager.stop();
                      },
                  },
                  "start-render": {
                      label: "Start rendering",
                      callback: () => {
                          CanvasManager.start();
                      },
                  },
              },
          ]
        : []
) satisfies MenuManagerActions;
