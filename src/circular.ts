// this file only exists to break circular dependencies

export const IS_MAC_OS =
    typeof navigator !== "undefined"
        ? [navigator.userAgentData?.platform, navigator.platform].some(
              (platform) => platform?.toLowerCase().includes("mac") ?? false,
          )
        : false;

export function assertNever(): never;
export function assertNever(v: never): never;
export function assertNever(...args: [] | [v: never]) {
    if (!args.length) throw new Error();

    return args[0];
}
