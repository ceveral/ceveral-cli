import * as program from 'commander';

const pkgjson = require('../package.json');

import * as ast from './commands/ast';
import * as transform from './commands/transform';
import * as list from './commands/list';
export function run() {

    program.version(pkgjson.version)

    ast.commands(program);
    transform.commands(program);
    list.commands(program);
    
    program.parse(process.argv);

}