
import { ICommand } from 'commander'
import { Transpiler, IResult } from 'ceveral-compiler';
import * as fs from 'mz/fs'
import * as Path from 'path';
import * as utils from '../utils'
import * as File from 'vinyl';
import * as chalk from 'chalk';

async function action(cmd: ICommand, files: string[]) {
    let elapsed = utils.time();
    let concat = !!cmd["concat"],
        output = cmd["output"],
        quiet = !!cmd["quiet"]

    let transpiler = new Transpiler();
    let entries = await utils.readFiles(files, {buffer: true})

    let out: {filename:string,ast:any}[] = [];
    for (let file of entries) {
        let ast = await transpiler.ast(file.contents.toString(), file.path);
        out.push({
            filename: Path.basename(file.path, Path.extname(file.path)) + '.cev.ast',
            ast: ast
        });
    }

    
    if (concat) {
        out = [out.reduce((prev, current) => {
            prev.ast.push(current.ast);
            return prev
        }, {filename:"output.cev.ast", ast: []})] // as any;

        
    }
    let outFiles: File[] = [];
    for (let o of out) {
        let file = new File({
            cwd: process.cwd(),
            base: output,
            path: Path.join(output||"", o.filename),
            contents: new Buffer(JSON.stringify(o.ast, null, 2))
        });
        outFiles.push(file);
    }
   

    if (!output) {
        for (let o of outFiles) {
            console.log(o.contents.toString());
        }
    } else {
        await utils.ensureOutDir(output);
        if (!quiet) console.log('Write ast to path: %s', chalk.cyan(output));
        utils.writeFiles(output, outFiles, (file) => {
            console.log('  create %s', chalk.green(file.path));
        }).then(() => {
            console.log('Files written in %s\n', chalk.cyan(ms(elapsed())));
        })
    }




}

export function commands(cmd: ICommand) {

    let astCmd = cmd.command('ast')
        .description("Generate ast")
        .arguments('<file...>')
        .option("-o, --output <path>", "output to file instead of stdout")
        .option("-c --concat", "concat resulting asts to one file")
        .option('-q, --quiet', "silence")
        .action((files) => {
            action(astCmd, files)
            .catch( e => {
                console.error(e.message)
            })
        });

}