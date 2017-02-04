"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ceveral_compiler_1 = require("ceveral-compiler");
const Path = require("path");
const utils = require("../utils");
const File = require("vinyl");
const chalk = require("chalk");
function action(cmd, files) {
    return __awaiter(this, void 0, void 0, function* () {
        let elapsed = utils.time();
        let concat = !!cmd["concat"], output = cmd["output"], quiet = !!cmd["quiet"];
        let transpiler = new ceveral_compiler_1.Transpiler();
        let entries = yield utils.readFiles(files, { buffer: true });
        let out = [];
        for (let file of entries) {
            let ast = yield transpiler.ast(file.contents.toString(), file.path);
            out.push({
                filename: Path.basename(file.path, Path.extname(file.path)) + '.cev.ast',
                ast: ast
            });
        }
        if (concat) {
            out = [out.reduce((prev, current) => {
                    prev.ast.push(current.ast);
                    return prev;
                }, { filename: "output.cev.ast", ast: [] })]; // as any;
        }
        let outFiles = [];
        for (let o of out) {
            let file = new File({
                cwd: process.cwd(),
                base: output,
                path: Path.join(output || "", o.filename),
                contents: new Buffer(JSON.stringify(o.ast, null, 2))
            });
            outFiles.push(file);
        }
        if (!output) {
            for (let o of outFiles) {
                console.log(o.contents.toString());
            }
        }
        else {
            yield utils.ensureOutDir(output);
            if (!quiet)
                console.log('Write ast to path: %s', chalk.cyan(output));
            utils.writeFiles(output, outFiles, (file) => {
                console.log('  create %s', chalk.green(file.path));
            }).then(() => {
                console.log('Files written in %s\n', chalk.cyan(ms(elapsed())));
            });
        }
    });
}
function commands(cmd) {
    let astCmd = cmd.command('ast')
        .arguments('<file...>')
        .option("-o, --output <path>", "output to file instead of stdout")
        .option("-c --concat", "concat resulting asts to one file")
        .option('-q, --quiet', "silence")
        .action((files) => {
        action(astCmd, files)
            .catch(e => {
            console.error(e.message);
        });
    });
}
exports.commands = commands;
