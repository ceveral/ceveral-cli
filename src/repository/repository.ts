import { resolver } from './resolver';
import { ImportedPackageExpression, Result, CodeGenerator } from 'ceveral-compiler'
import * as Path from 'path';

export interface TransformerDescription extends CodeGenerator {
    id?:string;
    name: string;
    description?: string;
    annotations: any;
    //transform(ast: ImportedPackageExpression): Promise<Result[]>
}

function isDescription(a: any): a is TransformerDescription {
    if (!a) return false;
    return typeof a.name === 'string' && typeof a.transform === 'function'
}

const _has: any = Object.prototype.hasOwnProperty

export class Repository {
    transformers: {[key:string]:TransformerDescription} = {};
    async loadTransformers() {
        let paths = await resolver.lookup("ceveral-transformer")

        for (let path of paths) {
            let desc: TransformerDescription;
            try {
                desc = require(path);
                if (desc && desc.hasOwnProperty('default')) {
                    desc = (<any>desc).default
                }
            } catch (e) { 
                continue; 
            }
            let base = Path.basename(Path.dirname(path)).replace('ceveral-transformer-','');
            
            if (isDescription(desc)) this.transformers[base] = desc;
        }
        
    }

    getTransformer(name:string) {
        if (this.transformers[name]) return this.transformers[name];
        for (let key in this.transformers) {
            let v = this.transformers[key];
            if (v.name === name) return v;
        }
        return null;
    }
}
