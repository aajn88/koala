import express from 'express';
import { CommandRow, readCsvFile } from './commands/commands_reader';

const app = express();
const port = 3000;

interface Commands {
    [key: string]: CommandRow;
}

const commands: Commands = {};

readCsvFile('src/commands/commands_list.csv')
    .then((data: CommandRow[]) => {
        data.forEach((command) => {
            commands[command.command] = command;
        });
    })
    .catch((error: Error) => {
        console.error(error);
    });

app.get('/', (req, res) => {
    const q = req.query.q as string;
    const url = commands[q].emptyAction;
    res.redirect(url);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
