
import {ICommand} from 'commander'
import {Repository} from '../repository'

export function list(cmd:ICommand) {
    let repo = new Repository();

    repo.loadTransformers();

    

}

export function commands(cmd:ICommand) {

    let listCmd = cmd.command('list')
   
    //.arguments('<files...>')
    .action( () => {
        list(listCmd)
    })

}