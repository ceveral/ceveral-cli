import * as program from 'commander';

const pkgjson = require('../package.json');

import {commands} from './commands';

export function run() {

    program.version(pkgjson.version)

    commands(program);
    
    program.parse(process.argv);

    if (!program.args.length) program.help();

}