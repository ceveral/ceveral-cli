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
const chalk = require("chalk");
function list(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new ceveral_compiler_1.Repository();
        yield repo.loadTransformers();
        if (!Object.keys(repo.transformers).length) {
            console.log(`It looks like you don't have any transformers installed yet.\n`);
            return;
        }
        console.log('Ceveral transformers:');
        for (let key in repo.transformers) {
            let trans = repo.transformers[key];
            console.log("  %s (%s)", chalk.bold(trans.name), key);
            if (trans.description) {
                console.log('  %s', trans.description);
            }
        }
        console.log('');
    });
}
exports.list = list;
function commands(cmd) {
    let listCmd = cmd.command('list')
        .action(() => {
        list(listCmd);
    });
}
exports.commands = commands;
