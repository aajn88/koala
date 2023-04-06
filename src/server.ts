import express from 'express';
import { CommandRow, readCsvFile } from './commands/commands_reader';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    readCsvFile('src/commands/commands_list.csv')
        .then((data: CommandRow[]) => {
            console.log(data);
            // Do something with the parsed CSV data here
        })
        .catch((error: Error) => {
            console.error(error);
            // Handle the error here
        });

    const q = req.query.q || 'World';
    res.send(`Hello, ${q}!`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
