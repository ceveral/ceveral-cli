"use strict";
const ast = require("./ast");
const help = require("./help");
const list = require("./list");
const transform = require("./transform");
function commands(cmd) {
    ast.commands(cmd);
    help.commands(cmd);
    list.commands(cmd);
    transform.commands(cmd);
}
exports.commands = commands;
