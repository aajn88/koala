import fs from 'fs';
import csv from 'csv-parser';
import { Command } from './command';

export function readCsvFile(filePath: string): Promise<Command[]> {
    return new Promise((resolve, reject) => {
        const results: Command[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data: Command) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error: Error) => {
                reject(error);
            });
    });
}
