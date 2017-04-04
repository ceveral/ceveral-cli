"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import { Repository, getAnnotationValidations } from '../repository';
const chalk = require("chalk");
const utils = require("../utils");
const ceveral_compiler_1 = require("ceveral-compiler");
const ms = require('ms');
const listr = require('listr');
const rxjs_1 = require("rxjs");
function transform2(cmd, files) {
    let elapsed = utils.time();
    let q = cmd['transformer'];
    if (!q)
        throw new Error('You must specify at least one transformer');
    let quiet = !!cmd['quiet'];
    let cev = new ceveral_compiler_1.Ceveral();
    let tasks = [{
            title: "Transform",
            task: ctx => {
                return new rxjs_1.Observable(((observer) => __awaiter(this, void 0, void 0, function* () {
                    ctx.files = yield utils.readFiles(files);
                    let results = [];
                    for (let file of ctx.files) {
                        observer.next(file);
                        let tmp = yield cev.transform(file.contents.toString(), {
                            transformers: q,
                            fileName: file.path
                        });
                        results.push(...tmp);
                    }
                    observer.complete();
                })));
            }
        }];
    let task = new listr(tasks);
    return task.run();
}
function transform(cmd, files) {
    return __awaiter(this, void 0, void 0, function* () {
        let elapsed = utils.time();
        let q = cmd['transformer'];
        if (!q)
            throw new Error('You must specify at least one transformer');
        let quiet = !!cmd['quiet'];
        let cev = new ceveral_compiler_1.Ceveral();
        let input = yield utils.readFiles(files);
        let results = [];
        for (let file of input) {
            let tmp = yield cev.transform(file.contents.toString(), {
                transformers: q,
                fileName: file.path
            });
            results.push(...tmp);
        }
        let output = cmd["output"] || "";
        if (!output) {
            return results.forEach((m) => console.log(m.buffer.toString()));
        }
        let vinyl = utils.resultsToVinyl(results);
        yield utils.ensureOutDir(output);
        if (!quiet)
            console.log('Write to path: %s', chalk.cyan(output));
        utils.writeFiles(output, vinyl, (file) => {
            console.log('  create %s', chalk.green(file.path));
        }).then(() => {
            console.log('Files written in %s\n', chalk.cyan(ms(elapsed())));
        });
    });
}
function collect(val, memo) {
    memo.push(val);
    return memo;
}
function commands(cmd) {
    let transformCmd = cmd
        .option('-t, --transformer <string>', 'Transformers to use', collect, [])
        .option('-q, --quiet', 'Suppress output')
        .option('-o, --output <string>', 'Output directory')
        .arguments('<files...>')
        .action(files => {
        transform(transformCmd, files).catch(e => {
            console.error(e.message);
        });
    });
}
exports.commands = commands;
