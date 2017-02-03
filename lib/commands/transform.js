"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const repository_1 = require("../repository");
const chalk = require("chalk");
const utils = require("../utils");
const ceveral_compiler_1 = require("ceveral-compiler");
function transform(cmd, files) {
    return __awaiter(this, void 0, void 0, function* () {
        let q = cmd['transforms'];
        let repo = new repository_1.Repository();
        yield repo.loadTransformers();
        let notfound = [];
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
        let transpiler = new ceveral_compiler_1.Transpiler();
        let input = yield utils.readFiles(files);
        let output = [];
        for (let file of input) {
            for (let transformer of transformers) {
                let files = yield transpiler.transpile(file.contents.toString(), transformer);
                output.push(...files);
            }
        }
        console.log(output);
    });
}
function collect(val, memo) {
    memo.push(val);
    return memo;
}
function commands(cmd) {
    let transformCmd = cmd
        .option('-t, --transforms <string>', 'transformer', collect, [])
        .arguments('<files...>')
        .action(files => {
        transform(transformCmd, files).catch(e => {
            console.log(e);
        });
    });
}
exports.commands = commands;
