import LoDashStatic = _.LoDashStatic;

import {stringify} from "querystring";
import LoDashExplicitWrapper = _.LoDashExplicitWrapper;


export interface LowStorage<T> {
    read<T>(source?: string, deserialize?: (s:string)=> T) : T ;
    write(path:string, data:T, serialize?:(x:T)=> string): void|Promise<{}>;
}

export interface LowChain<T> extends  LoDashExplicitWrapper<T>, LowStorage<T>, Serializer {

    (key?:string): LowChain<T>;

    _?: LoDashStatic

    object?: T;

    source?: string;

    _checksum?:string;
}

export interface Serializer {
    serialize(x:any) : string;
    deserialize(s:string): any;
}

export interface LowOptions {
    storage?:LowStorage<any>,
    format?:{
        serialize?:any,
        deserialize?:any
    }
}



