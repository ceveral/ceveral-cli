"use strict";
const program = require("commander");
const pkgjson = require('../package.json');
const ast = require("./commands/ast");
const transform = require("./commands/transform");
const list = require("./commands/list");
function run() {
    program.version(pkgjson.version);
    ast.commands(program);
    transform.commands(program);
    list.commands(program);
    program.parse(process.argv);
}
exports.run = run;
