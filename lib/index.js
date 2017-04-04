"use strict";
const program = require("commander");
const pkgjson = require('../package.json');
const commands_1 = require("./commands");
function run() {
    program.version(pkgjson.version);
    commands_1.commands(program);
    program.parse(process.argv);
    if (!program.args.length)
        program.help();
}
exports.run = run;
