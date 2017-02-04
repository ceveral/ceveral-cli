
import { ICommand } from 'commander'
//import { Repository, getAnnotationValidations } from '../repository';
import * as chalk from 'chalk';
import * as utils from '../utils';
import { IResult, Ceveral } from 'ceveral-compiler'
const ms = require('ms');

async function transform(cmd: ICommand, files: string[]) {
    let elapsed = utils.time();
    let q: string[] = cmd['transformer'];
    
    if (!q) throw new Error('You must specify at least one transformer');


    let quiet = !!cmd['quiet'];

    let cev = new Ceveral();

    await cev.setup();
    
    let input = await utils.readFiles(files)
    
    let results: IResult[] = [];
    for (let file of input) {
        let tmp = await cev.transform(file.contents.toString(), {
            transformers: q,
            fileName: file.path
        });
        results.push(...tmp);
    }

    let output = cmd["output"] || ""

    if (!output) {
        return results.forEach((m) => console.log(m.buffer.toString()));
    }
    
    let vinyl = utils.resultsToVinyl(results);

    await utils.ensureOutDir(output);
    if (!quiet) console.log('Write ast to path: %s', chalk.cyan(output));
    utils.writeFiles(output, vinyl, (file) => {
        console.log('  create %s', chalk.green(file.path));
    }).then(() => {
        console.log('Files written in %s\n', chalk.cyan(ms(elapsed())));
    })
    
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

export function commands(cmd: ICommand) {

    let transformCmd = cmd
        .option('-t, --transformer <string>', 'Transformers to use', collect, [])
        .option('-q, --quiet', 'Suppress output')
        .option('-o, --output <string>', 'Output directory')
        .arguments('<files...>')
        .action(files => {
            transform(transformCmd, files).catch(e => {
                console.error(e.errors);
            })
        })

}