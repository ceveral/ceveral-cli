"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const vinyl = require("vinyl-fs");
const es = require("event-stream");
const File = require("vinyl");
const fs = require("mz/fs");
const Path = require("path");
function resultsToVinyl(results, path = null) {
    let outFiles = [];
    for (let o of results) {
        let file = new File({
            cwd: process.cwd(),
            base: path,
            path: Path.join(path || "", o.filename),
            contents: o.buffer
        });
        outFiles.push(file);
    }
    return outFiles;
}
exports.resultsToVinyl = resultsToVinyl;
function readFiles(files, options) {
    return new Promise((resolve, reject) => {
        vinyl.src(files, options)
            .on('error', reject)
            .pipe(es.writeArray((err, result) => {
            if (err)
                reject(err);
            resolve(result);
        }));
    });
}
exports.readFiles = readFiles;
function writeFiles(root, files, progress) {
    return new Promise((resolve, reject) => {
        es.readArray(files)
            .pipe(vinyl.dest(root))
            .pipe(es.map((data, cb) => {
            cb(null, data);
            if (progress)
                progress(data);
        }))
            .pipe(es.wait((err) => {
            if (err)
                reject(err);
            resolve();
        }));
    });
}
exports.writeFiles = writeFiles;
function ensureOutDir(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.stat(path);
        }
        catch (_) {
            yield fs.mkdir(path);
        }
    });
}
exports.ensureOutDir = ensureOutDir;
function time() {
    let now = new Date();
    return function () {
        let future = new Date();
        return future.getTime() - now.getTime();
    };
}
exports.time = time;
function strlen(str) {
    var code = /\u001b\[(?:\d*;){0,5}\d*m/g;
    var stripped = ("" + (str != null ? str : '')).replace(code, '');
    var split = stripped.split("\n");
    return split.reduce(function (memo, s) { return (s.length > memo) ? s.length : memo; }, 0);
}
exports.strlen = strlen;
function pad(str, len, pad, dir) {
    if (len + 1 >= str.length)
        switch (dir) {
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
        }
    ;
    return str;
}
exports.pad = pad;
;
