import fs from "fs";
import path from "path";

export class Exporter {
  isEnabled: boolean;

  constructor(isEnabled: boolean) {
    this.isEnabled = isEnabled;
  }

  export = (dir: string, fileName: string, data: string) => {
    if (this.isEnabled) {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, fileName), data);
    }
  };
}

export const exporter = new Exporter(process.env.IS_EXPORT_ENABLED === "true");
