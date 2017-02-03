import * as vinyl from 'vinyl-fs'
import * as es from 'event-stream';
import * as File from 'vinyl'
import * as fs from 'mz/fs';

export function readFiles(files: string[], options?:vinyl.ISrcOptions) {
    return new Promise<File[]>((resolve, reject) => {
        vinyl.src(files, options)
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