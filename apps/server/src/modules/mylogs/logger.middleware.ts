import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    res.on('finish', () => {
      const { statusCode } = res;
      let level: string;
      if (statusCode >= 500) {
        level = 'ERROR';
      } else if (statusCode >= 400) {
        level = 'WARN';
      } else {
        level = 'INFO';
      }
      const log = {
        datetime: new Date().toLocaleString(),
        method,
        originalUrl,
        statusCode,
        ip,
        user: req.user,
        level,
      };
      const logFilePath = path.join(
        process.cwd(),
        'src/modules/mylogs',
        'mylogs.json',
      );
      try {
        let logs: any[] = [];
        if (fs.existsSync(logFilePath)) {
          const fileContent = fs.readFileSync(logFilePath, 'utf8').trim();
          if (fileContent) {
            logs = JSON.parse(fileContent);
          }
        }
        logs.push(log);
        fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
      } catch (error) {
        console.error('Failed to write log to file:', error);
      }
    });

    next();
  }
}
