
export class Logger {

    private readonly loggerName: string;

    constructor(name: string) {
        this.loggerName = name;
    }

    debug(message: string): void {
        console.log(`${new Date().toLocaleString()} | ${this.loggerName} | ${message}`);
    }
}