import { TreeNode, nodeText } from '../util/parseTree';
import { Token } from 'php7parser';
import { PhpDocument } from './phpDocument';
import { nonenumerable } from '../util/decorator';
import { DocBlock } from './docBlock';
import { TypeName } from '../type/name';
import { TypeComposite } from '../type/composite';
import { TokenKind } from '../util/parser';
import { createObject } from '../util/genericObject';

export abstract class Symbol {
    @nonenumerable
    public node: TreeNode | null;

    @nonenumerable
    public doc: PhpDocument | null;

    constructor(node: TreeNode | null, doc: PhpDocument | null) {
        this.node = node;
        this.doc = doc;
    }

    toObject(): any {
        let object: any = createObject((<any>this).constructor);

        for (let key in this) {
            let value: any = this[key];

            if (value instanceof Object && 'toObject' in value && typeof value.toObject == 'function') {
                object[key] = value.toObject();
            } else if (value instanceof Array) {
                object[key] = [];

                for (let child of value) {
                    if ('toObject' in child) {
                        object[key] = child.toObject();
                    } else {
                        object[key].push(child);
                    }
                }
            } else {
                object[key] = value;
            }
        }

        return object;
    }
}

export class TokenSymbol extends Symbol {
    @nonenumerable
    public node: Token;

    public text: string;

    @nonenumerable
    public type: TokenKind;

    constructor(token: Token, doc: PhpDocument) {
        super(token, doc);

        this.type = <number>token.tokenType;
        this.text = nodeText(token, doc.text);
    }
}

export abstract class TransformSymbol extends Symbol {
    abstract realSymbol: Symbol;
}

export abstract class CollectionSymbol extends Symbol {
    abstract realSymbols: Symbol[];
}

export interface Consumer {
    consume(other: Symbol): boolean;
}

export interface DocBlockConsumer {
    consumeDocBlock(docBlock: DocBlock): void;
}

export interface Reference {
    type: TypeName | TypeComposite;
}

export interface ScopeMember {
    scope: string;
}

export function isTransform(symbol: Symbol): symbol is TransformSymbol {
    return symbol != null && 'realSymbol' in symbol;
}

export function isCollection(symbol: Symbol): symbol is CollectionSymbol {
    return symbol != null && 'realSymbols' in symbol;
}

export function isConsumer(symbol: Symbol): symbol is (Symbol & Consumer) {
    return 'consume' in symbol;
}

export function isDocBlockConsumer(symbol: Symbol): symbol is (Symbol & DocBlockConsumer) {
    return 'consumeDocBlock' in symbol;
}