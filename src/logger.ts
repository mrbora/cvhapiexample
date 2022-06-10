import winston, {createLogger, format, transports} from "winston";

// make singleton
class Logger {
    logger: winston.Logger;

    constructor() {
        this.logger = createLogger({
            format: format.combine(format.timestamp(), format.json()),
            transports: [new transports.Console({})],
        })
    }

    getLogger() {
        return this.logger
    }
}

export class Singleton extends Logger {
    static instance: Logger;

    static getInstance() {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance.getLogger()
    }
}




