import {ICommand} from 'commander'
import {Repository, AnnotationDescriptions} from 'ceveral-compiler/lib/repository';
import * as chalk from 'chalk';
import {strlen, pad} from '../utils'
const ora = require('ora');

function write_annotations(stream:NodeJS.WritableStream, desc:AnnotationDescriptions) {
	let padding = Object.keys(desc).reduce((p, c) => {
		return Math.max(p, strlen(c));
	}, 0) + 4
	for (let name in desc) {
		stream.write(`${chalk.bold(pad(name, padding, ' '))}${chalk.cyan(desc[name].arguments)}\n`)
		if (desc[name].description) {
			stream.write("  " + desc[name].description +'\n');
		}
	}
}

async function help(name) {
	let repo = new Repository();

	let i = ora("Please wait...").start();

	try {
		await repo.loadTransformers();
		
	} catch (e) {
		i.fail(e.message);
		return;
	}

	let desc = repo.getTransformer(name)
	

	if (!desc) {
		return i.fail(`Transformer '${name}' not found`)
	}
	i.clear().stop();
	
	let stream = process.stdout;

	stream.write(`Name: ${chalk.bold(desc.name)} (${chalk.gray(name)}) \n${desc.description||''}`);
	
	if (desc.annotations) {
		if (desc.annotations.records) {
			stream.write(`\nRecords:\n`);
			write_annotations(stream, desc.annotations.records);
			stream.write("\n");
		}
		if (desc.annotations.properties) {
			stream.write(`\nProperties:\n`);
			write_annotations(stream, desc.annotations.properties);
			stream.write("\n")
		}
	}
}


export function commands(cmd:ICommand) {

	let helpCmd = cmd.command('help <transformer>')
	.action((name) => {
		help(name)
		




	})

}