
import { ICommand } from 'commander'
import { Repository } from '../repository';
import * as chalk from 'chalk';
import * as utils from '../utils';
import { Transpiler, Result } from 'ceveral-compiler'


async function transform(cmd: ICommand, files: string[]) {
    let q: string[] = cmd['transforms'];

    let repo = new Repository();
    await repo.loadTransformers();

    let notfound: string[] = [];
    let transformers = q.map(t => {
        return repo.getTransformer(t);
    }).filter((m, i) => {
        if (m == null) {
            notfound.push(q[i]);
            return false;
        }
        return true;
    });

    if (notfound.length) {
        console.log('Could not find template: %s', chalk.bold(notfound.join(', ')));
        return;
    }
    let transpiler = new Transpiler();
    let input = await utils.readFiles(files)

    let output: Result[] = [];
    for (let file of input) {
        for (let transformer of transformers) {
            let files = await transpiler.transpile(file.contents.toString(), transformer);
            output.push(...files);
        }
    }
    console.log(output)
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

export function commands(cmd: ICommand) {

    let transformCmd = cmd
        .option('-t, --transforms <string>', 'transformer', collect, [])
        .arguments('<files...>')
        .action(files => {
            transform(transformCmd, files).catch( e => {
                console.log(e)
            })
        })

}