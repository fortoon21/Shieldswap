export class Logger {
  isEnabled: boolean;

  constructor(isEnabled: boolean) {
    this.isEnabled = isEnabled;
  }

  log = (...data: any[]) => {
    if (this.isEnabled) {
      console.log(...data);
    }
  };
}

export const logger = new Logger(process.env.IS_LOG_ENABLED === "true");
