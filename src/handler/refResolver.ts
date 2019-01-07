import { Reference, RefKind } from "../symbol/reference";
import { App } from "../app";
import { FunctionTable } from "../storage/table/function";
import { TypeComposite } from "../type/composite";
import { Function } from "../symbol/function/function";
import { PhpDocument } from "../symbol/phpDocument";
import { Class } from "../symbol/class/class";
import { ClassTable } from "../storage/table/class";
import { Method } from "../symbol/function/method";
import { MethodTable } from "../storage/table/method";
import { Property } from "../symbol/variable/property";
import { PropertyTable } from "../storage/table/property";
import { ClassConstant } from "../symbol/constant/classConstant";
import { ClassConstantTable } from "../storage/table/classConstant";
import { Constant } from "../symbol/constant/constant";
import { ConstantTable } from "../storage/table/constant";
import { Symbol } from "../symbol/symbol";

export namespace RefResolver {
    export async function getSymbolsByReference(phpDoc: PhpDocument, ref: Reference): Promise<Symbol[]> {
        let symbols: Symbol[] = [];

        switch (ref.refKind) {
            case RefKind.Function:
                symbols = await RefResolver.getFuncSymbols(phpDoc, ref);
                break;
            case RefKind.ClassTypeDesignator:
                symbols = await RefResolver.getMethodSymbols(phpDoc, ref);

                if (symbols.length === 0) {
                    symbols = await RefResolver.getClassSymbols(phpDoc, ref);
                }
                break;
            case RefKind.Class:
                symbols = await RefResolver.getClassSymbols(phpDoc, ref);
                break;
            case RefKind.Method:
                symbols = await RefResolver.getMethodSymbols(phpDoc, ref);
                break;
            case RefKind.Property:
                symbols = await RefResolver.getPropSymbols(phpDoc, ref);
                break;
            case RefKind.ClassConst:
                symbols = await RefResolver.getClassConstSymbols(phpDoc, ref);
                break;
            case RefKind.ConstantAccess:
                symbols = await RefResolver.getConstSymbols(phpDoc, ref);
                break;
        }

        return symbols;
    }

    export async function searchSymbolsForReference(phpDoc: PhpDocument, ref: Reference): Promise<Symbol[]> {
        let symbols: Symbol[] = [];

        switch (ref.refKind) {
        }

        return symbols;
    }

    export async function getFuncSymbols(phpDoc: PhpDocument, ref: Reference): Promise<Function[]> {
        const funcTable = App.get<FunctionTable>(FunctionTable);
        
        if (ref.type instanceof TypeComposite) {
            return [];
        }

        ref.type.resolveToFullyQualified(phpDoc.importTable);

        return await funcTable.get(ref.type.name);
    }

    export async function getMethodSymbols(phpDoc: PhpDocument, ref: Reference): Promise<Method[]> {
        if (ref.type instanceof TypeComposite) {
            return [];
        }

        const methodTable = App.get<MethodTable>(MethodTable);
        let className: string = '';
        let methodName: string = '';

        if (ref.refKind === RefKind.ClassTypeDesignator) {
            ref.type.resolveToFullyQualified(phpDoc.importTable);
            className = ref.type.name;
            methodName = '__construct';
        } else if (ref.refKind === RefKind.Method && ref.scope !== null) {
            ref.scope.resolveToFullyQualified(phpDoc.importTable);
            className = ref.scope.name;
            methodName = ref.type.name;
        }

        return await methodTable.searchByClass(className, methodName);
    }

    export async function getPropSymbols(phpDoc: PhpDocument, ref: Reference): Promise<Property[]> {
        if (ref.type instanceof TypeComposite) {
            return [];
        }

        const propTable = App.get<PropertyTable>(PropertyTable);
        let className = '';

        if (ref.scope !== null) {
            ref.scope.resolveToFullyQualified(phpDoc.importTable);
            className = ref.scope.name;
        }

        return await propTable.searchByClass(className, ref.type.name);
    }

    export async function getClassSymbols(phpDoc: PhpDocument, ref: Reference): Promise<Class[]> {
        const classTable = App.get<ClassTable>(ClassTable);

        if (ref.type instanceof TypeComposite) {
            return [];
        }

        ref.type.resolveToFullyQualified(phpDoc.importTable);

        return await classTable.get(ref.type.name);
    }

    export async function getClassConstSymbols(phpDoc: PhpDocument, ref: Reference): Promise<ClassConstant[]> {
        if (ref.type instanceof TypeComposite) {
            return [];
        }

        const classConstTable = App.get<ClassConstantTable>(ClassConstantTable);
        let className = '';

        if (ref.scope !== null) {
            ref.scope.resolveToFullyQualified(phpDoc.importTable);
            className = ref.scope.name;
        }

        return await classConstTable.searchByClass(className, ref.type.name);
    }

    export async function getConstSymbols(
        phpDoc: PhpDocument,
        ref: Reference
    ): Promise<Constant[]> {
        if (ref.type instanceof TypeComposite) {
            return [];
        }

        ref.type.resolveToFullyQualified(phpDoc.importTable);

        const constTable = App.get<ConstantTable>(ConstantTable);
        
        return constTable.get(ref.type.name);
    }
}