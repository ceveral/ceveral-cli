
import {ICommand} from 'commander'
import {Repository} from 'ceveral-compiler/lib/repository';

import * as chalk from 'chalk';
export async function list(cmd:ICommand) {
    let repo = new Repository();

    await repo.loadTransformers();
    if (!Object.keys(repo.transformers).length) {
        console.log(`It looks like you don't have any transformers installed yet.\n`);
        return;
    }
    console.log('Available transformers:\n')
    for (let key in repo.transformers) {
        let trans = repo.transformers[key];
        console.log("  %s (%s)", chalk.bold(trans.name), key);
        if (trans.description) {
            console.log('  %s', trans.description)
        }
    }
    console.log('')
    

}

export function commands(cmd:ICommand) {

    let listCmd = cmd.command('list')
    .description('Print available transformers')
    .action( () => {
        list(listCmd)
    })

}