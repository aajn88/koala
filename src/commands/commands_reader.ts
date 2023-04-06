import fs from 'fs';
import csv from 'csv-parser';

export interface CommandRow {
    command: string;
    name: string;
    description: string;
    emptyAction: string;
    actionWithArguments: string;
}

export function readCsvFile(filePath: string): Promise<CommandRow[]> {
    return new Promise((resolve, reject) => {
        const results: CommandRow[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data: CommandRow) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error: Error) => {
                reject(error);
            });
    });
}
