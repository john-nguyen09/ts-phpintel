const symbolEncoding = require('../src/storage/symbolEncoding');
import { indexFiles, getCaseDir } from "../src/testHelper";
import * as path from 'path';
import { Class } from "../src/symbol/class/class";
import { Serializer, Deserializer } from "../src/storage/serializer";
import { Constant } from "../src/symbol/constant/constant";
import { Method } from "../src/symbol/function/method";
import { ClassConstant } from "../src/symbol/constant/classConstant";
import { Property } from "../src/symbol/variable/property";
import { toRelative } from "../src/util/uri";
import { PhpDocument } from "../src/symbol/phpDocument";
import { PhpDocEncoding } from "../src/storage/table/phpDoc";

describe('symbolEncoding', () => {
    it('serializer test', () => {
        let serializer = new Serializer();
        serializer.setInt32(5);
        serializer.setInt32(7);
        serializer.setInt32(2);
        serializer.setString('hello world');
        serializer.setBool(true);
        serializer.setInt32(255);
        serializer.setString('hello world 2');

        let reader = new Deserializer(serializer.getBuffer());

        expect(reader.readInt32()).toBe(5);
        expect(reader.readInt32()).toBe(7);
        expect(reader.readInt32()).toBe(2);
        expect(reader.readString()).toBe('hello world');
        expect(reader.readBool()).toBe(true);
        expect(reader.readInt32()).toBe(255);
        expect(reader.readString()).toBe('hello world 2');
    });

    it('snapshot of class symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'class_constants.php'),
        ]);

        for (let phpDoc of phpDocs) {
            for (let theClass of phpDoc.classes) {
                if (theClass.location.uri === undefined) {
                    continue;
                }

                theClass.location.uri = toRelative(theClass.location.uri);

                let buffer = symbolEncoding.encode(theClass);
                let decoded = symbolEncoding.decode(buffer) as Class;

                expect(theClass).toEqual(decoded);
            }
        }
    });

    it('snapshot of function symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'function_declare.php'),
        ]);

        for (let phpDoc of phpDocs) {
            for (let func of phpDoc.functions) {
                if (func.location.uri === undefined) {
                    continue;
                }

                func.location.uri = toRelative(func.location.uri);

                let buffer = symbolEncoding.encode(func);
                let decoded = symbolEncoding.decode(buffer) as Function;

                expect(decoded).toMatchSnapshot();
            }
        }
    });

    it('snapshot of constant symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'global_symbols.php'),
        ]);

        for (let phpDoc of phpDocs) {
            for (let constant of phpDoc.constants) {
                if (constant.location.uri === undefined) {
                    continue;
                }

                constant.location.uri = toRelative(constant.location.uri);

                let buffer = symbolEncoding.encode(constant);
                let decoded = symbolEncoding.decode(buffer) as Constant;

                expect(decoded).toMatchSnapshot();
            }
        }
    });

    it('snapshot of class constant symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'class_constants.php'),
        ]);

        for (let phpDoc of phpDocs) {
            for (let classConstant of phpDoc.classConstants) {
                if (classConstant.location.uri === undefined) {
                    continue;
                }

                classConstant.location.uri = toRelative(classConstant.location.uri);

                let buffer = symbolEncoding.encode(classConstant);
                let decoded = symbolEncoding.decode(buffer) as ClassConstant;

                expect(decoded).toMatchSnapshot();
            }
        }
    });

    it('snapshot of method symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'class_methods.php'),
        ]);

        for (let phpDoc of phpDocs) {
            for (let method of phpDoc.methods) {
                if (method.location.uri === undefined) {
                    continue;
                }

                method.location.uri = toRelative(method.location.uri);

                let buffer = symbolEncoding.encode(method);
                let decoded = symbolEncoding.decode(buffer) as Method;

                expect(decoded).toMatchSnapshot();
            }
        }
    });

    it('snapshot of property symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'class_methods.php'),
        ]);

        for (let phpDoc of phpDocs) {
            for (let property of phpDoc.properties) {
                if (property.location.uri === undefined) {
                    continue;
                }

                property.location.uri = toRelative(property.location.uri);

                let buffer = symbolEncoding.encode(property);
                let decoded = symbolEncoding.decode(buffer) as Property;

                expect(decoded.toObject()).toMatchSnapshot();
            }
        }
    });

    it('snapshot of phpDoc symbols after encode and decode', () => {
        let phpDocs = indexFiles([
            path.join(getCaseDir(), 'bigFile.php'),
        ]);

        for (let phpDoc of phpDocs) {
            phpDoc.uri = toRelative(phpDoc.uri);

            let buffer = PhpDocEncoding.encode(phpDoc);
            let decoded = PhpDocEncoding.decode(buffer) as PhpDocument;

            expect(decoded.toObject()).toMatchSnapshot();
            expect(decoded.text).toEqual(phpDoc.text);
        }
    });
});