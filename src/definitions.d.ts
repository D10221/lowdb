declare module 'is-promise'{
    
    export function isPromise (x:any) : boolean ;
    
}


declare interface IsPromise{
    (x:any): boolean;
}


declare interface GracefulFs {
    existsSync(path:string): boolean ;
    readFileSync(path:string, encoding:string) : string ;
    writeFileSync(path:string, content:string) :void ; 
}
