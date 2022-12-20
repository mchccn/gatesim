export const ConstructorCloneSymbol = Symbol("@@Symbol.providedConstructorArguments");

export interface ConstructorClone {
    clone(): this;
}

export const ConstructorClone: (target: Function) => Function = (target: Function) => {
    const constructor = target as unknown as new (...args: any[]) => {};

    const ConstructorClone = class extends constructor {
        constructor(...args: any[]) {
            super(...args);

            Reflect.defineProperty(this, ConstructorCloneSymbol, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: args,
            });
        }
    };

    return eval(`(class ${target.name} extends ${ConstructorClone.name} {})`);
};
