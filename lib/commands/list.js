"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const repository_1 = require("ceveral-compiler/lib/repository");
const utils_1 = require("ceveral-compiler/lib/utils");
const ora = require('ora');
function delay(t) {
    let d = utils_1.Defered();
    setTimeout(d.resolve, t);
    return d.promise;
}
const chalk = require("chalk");
function list(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new repository_1.Repository();
        console.log('');
        let i = ora("Please wait...").start();
        try {
            yield repo.loadTransformers();
            i.succeed("Transformers loaders");
        }
        catch (e) {
            i.fail("An error happened while loading transformers");
            return;
        }
        if (!Object.keys(repo.transformers).length) {
            console.log(`It looks like you don't have any transformers installed yet.\n`);
            return;
        }
        console.log('\n  Available transformers:\n');
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
        .description('Print available transformers')
        .action(() => {
        list(listCmd);
    });
}
exports.commands = commands;
