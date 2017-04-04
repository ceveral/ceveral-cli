import * as vinyl from 'vinyl-fs'
import * as es from 'event-stream';
import * as File from 'vinyl'
import * as fs from 'mz/fs';
import * as Path from 'path';
import {IResult} from 'ceveral-compiler';

export function resultsToVinyl(results:IResult[], path:string = null) {
    let outFiles: File[] = [];

    for (let o of results) {
        
        let file = new File({
            cwd: process.cwd(),
            base: path,
            path: Path.join(path||"", o.filename),
            contents: o.buffer
        });
        outFiles.push(file);
    }
    return outFiles;
}

export function readFiles(files: string[], options?:vinyl.ISrcOptions) {
    return new Promise<File[]>((resolve, reject) => {
        
        vinyl.src(files, options)
            .on('error', reject)
            .pipe(es.writeArray((err, result) => {
                if (err) reject(err);
                resolve(result);
            }));
    })

}

export function writeFiles(root:string, files:File[], progress:(path:File) => void) {
    return new Promise((resolve, reject) => {
        es.readArray(files)
        .pipe(vinyl.dest(root))
        .pipe(es.map((data, cb) => {
            cb(null, data);
            if (progress) progress(data);
        }))
        .pipe(es.wait((err) => {
            if (err) reject(err);
            resolve()
        }))
    })
}

export async function ensureOutDir(path: string) {
    try {
        await fs.stat(path);
    } catch (_) {
        await fs.mkdir(path);
    }
}

export function time() {
    let now = new Date();
    return function() {
        let future = new Date();
        return future.getTime() - now.getTime();
    }
}


export function strlen(str:string){
  var code = /\u001b\[(?:\d*;){0,5}\d*m/g;
  var stripped = ("" + (str != null ? str : '')).replace(code,'');
  var split = stripped.split("\n");
  return split.reduce(function (memo, s) { return (s.length > memo) ? s.length : memo }, 0);
}

export function pad(str:string, len:number, pad:string, dir?:string) {
  if (len + 1 >= str.length)
    switch (dir){
      case 'left':
        str = Array(len + 1 - str.length).join(pad) + str;
        break;

      case 'both':
        let padlen;
        var right = Math.ceil((padlen = len - str.length) / 2);
        var left = padlen - right;
        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
        break;

      default:
        str = str + Array(len + 1 - str.length).join(pad);
    };

  return str;
};