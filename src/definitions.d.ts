declare interface GracefulFs {
    existsSync(path:string): boolean ;
    readFileSync(path:string, encoding:string) : string ;
    writeFileSync(path:string, content:string) :void ; 
}
