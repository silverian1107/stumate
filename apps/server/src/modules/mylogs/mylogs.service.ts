import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class MylogsService {
  private logFilePath = path.join(
    process.cwd(),
    'src/modules/mylogs',
    'mylogs.json',
  );

  async readLogsFromFile() {
    try {
      let logs: any[] = [];
      if (fs.existsSync(this.logFilePath)) {
        const fileContent = fs.readFileSync(this.logFilePath, 'utf8').trim();
        if (fileContent) {
          logs = JSON.parse(fileContent);
        }
      }
      return logs;
    } catch (error) {
      console.error('Error reading logs:', error);
      return [];
    }
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    try {
      const logs = await this.readLogsFromFile();
      const filteredLogs = this.filterLogs(logs, qs);

      currentPage = currentPage ? currentPage : 1;
      const limit = pageSize ? pageSize : 10;
      const offset = (currentPage - 1) * limit;

      const totalItems = filteredLogs.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginatedLogs = filteredLogs.slice(offset, offset + limit);

      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: totalItems,
        },
        result: paginatedLogs,
      };
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      return {
        meta: {
          current: currentPage,
          pageSize: pageSize,
          pages: 0,
          total: 0,
        },
        result: [],
      };
    }
  }

  private filterLogs(logs: any[], qs: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currentPage, pageSize, ...query } = qs;
    if (Object.keys(query).length === 0) {
      return logs;
    }
    const filteredLogs = logs.filter((log) => {
      return Object.keys(query).every((key) => {
        const logValue = log[key];
        const queryValue = query[key];
        return logValue && queryValue
          ? logValue.toString().toLowerCase().includes(queryValue.toLowerCase())
          : false;
      });
    });
    return filteredLogs;
  }

  async remove(index: number) {
    let logs: any[] = [];
    if (fs.existsSync(this.logFilePath)) {
      const fileContent = fs.readFileSync(this.logFilePath, 'utf8').trim();
      if (fileContent) {
        logs = JSON.parse(fileContent);
      }
    }
    if (index < 0 || index >= logs.length) {
      throw new NotFoundException(`Not found log`);
    }
    logs.splice(index, 1);
    try {
      fs.truncateSync(this.logFilePath, 0);
      fs.writeFileSync(this.logFilePath, JSON.stringify(logs, null, 2));
      return 'Log was deleted successfully';
    } catch (error) {
      console.error('Error updating logs file:', error);
    }
  }
}
