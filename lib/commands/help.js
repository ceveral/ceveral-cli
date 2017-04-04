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
const chalk = require("chalk");
const utils_1 = require("../utils");
const ora = require('ora');
function write_annotations(stream, desc) {
    let padding = Object.keys(desc).reduce((p, c) => {
        return Math.max(p, utils_1.strlen(c));
    }, 0) + 4;
    for (let name in desc) {
        stream.write(`${chalk.bold(utils_1.pad(name, padding, ' '))}${chalk.cyan(desc[name].arguments)}\n`);
        if (desc[name].description) {
            stream.write("  " + desc[name].description + '\n');
        }
    }
}
function help(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new repository_1.Repository();
        let i = ora("Please wait...").start();
        try {
            yield repo.loadTransformers();
        }
        catch (e) {
            i.fail(e.message);
            return;
        }
        let desc = repo.getTransformer(name);
        if (!desc) {
            return i.fail(`Transformer '${name}' not found`);
        }
        i.clear().stop();
        let stream = process.stdout;
        stream.write(`Name: ${chalk.bold(desc.name)} (${chalk.gray(name)}) \n${desc.description || ''}`);
        if (desc.annotations) {
            if (desc.annotations.records) {
                stream.write(`\nRecords:\n`);
                write_annotations(stream, desc.annotations.records);
                stream.write("\n");
            }
            if (desc.annotations.properties) {
                stream.write(`\nProperties:\n`);
                write_annotations(stream, desc.annotations.properties);
                stream.write("\n");
            }
        }
    });
}
function commands(cmd) {
    let helpCmd = cmd.command('help <transformer>')
        .action((name) => {
        help(name);
    });
}
exports.commands = commands;
