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
    const query_split = q.split(' ');
    const cmd_str = query_split[0];
    const cmd = commands[cmd_str];
    if (query_split.length > 1) {
        const real_query = q.substring(cmd_str.length + 1); // including the space
        const encoded_query = encodeURIComponent(real_query);
        res.redirect(cmd.actionWithArguments.replace('%s', encoded_query));
    } else {
        res.redirect(cmd.emptyAction);
    }
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
