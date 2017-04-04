import * as ast from './ast';
import * as help from './help';
import * as list from './list';
import * as transform from './transform';
import {ICommand} from 'commander';

export function commands(cmd:ICommand) {

	ast.commands(cmd);
	help.commands(cmd);
	list.commands(cmd);
	transform.commands(cmd);
	
}

