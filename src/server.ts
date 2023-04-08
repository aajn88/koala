import express from 'express';
import { readCsvFile } from './commands/commands_reader';
import { Command } from './commands/command';
import pug from 'pug';


const app = express();
const port = 3000;

interface Commands {
    [key: string]: Command;
}

const commands: Commands = {};

readCsvFile('src/commands/commands_list.csv')
    .then((data: Command[]) => {
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

app.get('/koala', (req, res) => {
    const template = pug.compileFile('src/template/table.pug');

    const rows: string[][] = [];
    Object.values(commands).forEach((cmd: Command) => {
        rows.push([cmd.command, cmd.name, cmd.description, cmd.emptyAction, cmd.actionWithArguments]);
    });
    
    const html = template({
        cols: ['Command', 'Name', 'Description', 'Empty Action', 'Action with Arguments'], rows: rows
    });

    res.send(html);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
