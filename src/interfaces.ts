import LoDashStatic = _.LoDashStatic;

import LoDashExplicitArrayWrapper = _.LoDashImplicitArrayWrapper;

export interface LowStorage<T> {
    read<T>(source?: string, deserialize?: (s: string) => T): T;
    write(path: string, data: T, serialize?: (x: T) => string): void | Promise<{}>;
}

export interface LowChain<T> extends LoDashExplicitArrayWrapper<T>, LowStorage<T>, Serializer {
    (key?: string, options?: LowOptions): LowChain<T>;
    _?: LoDashStatic;
    object?: T;
    source?: string;
    _checksum?: string;
}

export interface Serializer {
    serialize(x: any): string;
    deserialize(s: string): any;
}

export interface LowOptions {
    storage?: LowStorage<any>;
    format?: {
        serialize?: any;
        deserialize?: any;
    };
}
