"use strict";
const repository_1 = require("../repository");
function list(cmd) {
    let repo = new repository_1.Repository();
    repo.loadTransformers();
}
exports.list = list;
function commands(cmd) {
    let listCmd = cmd.command('list')
        .action(() => {
        list(listCmd);
    });
}
exports.commands = commands;
