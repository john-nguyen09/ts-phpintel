import { ImportTable } from './importTable';

export class TypeName {
    public static readonly BUILT_INS = [
        'boolean',
        'int',
        'float',
        'null',
        'string'
    ];

    public static readonly ALIASES: {[alias: string]: string} = {
        'bool': 'boolean',
        'double': 'float',
        'integer': 'int'
    };

    private name: string;

    constructor(name: string) {
        this.name = name;

        if (this.name in TypeName.ALIASES) {
            this.name = TypeName.ALIASES[this.name];
        }
    }

    public resolveToFullyQualified(importTable: ImportTable) {
        this.name = importTable.getFqn(this.name);
    }

    public static isFullyQualifiedName(typeName: string): boolean {
        if (typeName == '') {
            return true;
        }

        if (TypeName.BUILT_INS.indexOf(typeName) >= 0) {
            return true;
        }

        return typeName.indexOf('\\') === 0;
    }

    public getName(): string {
        return this.name;
    }

    public toString(): string {
        return this.getName();
    }

    public isSameAs(other: TypeName): boolean {
        if (other == undefined) {
            return false;
        }

        return this.name == other.name
    }

    public isEmptyName(): boolean {
        return this.name == '';
    }
}
