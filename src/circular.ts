export const IS_MAC_OS = [navigator.userAgentData?.platform, navigator.platform].some(
    (platform) => platform?.toLowerCase().includes("mac") ?? false,
);

export const assertNever = (v: never) => v;
