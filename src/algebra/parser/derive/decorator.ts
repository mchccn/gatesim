export const derive = (...traits: ((target: Function) => Function)[]) => {
    return <TFunction extends Function>(target: TFunction) => {
        return traits.reduce((target, trait) => trait.call(undefined, target) as TFunction, target);
    };
};
