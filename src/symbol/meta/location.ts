import { Range } from "./range";
import { toRelative } from "../../util/uri";
import { FieldGetter } from "../fieldGetter";

export class Location implements FieldGetter {
    public uri: string;
    public range: Range;

    constructor(uri?: string, range?: Range) {
        if (uri !== undefined) {
            this.uri = uri;
        }

        if (range !== undefined) {
            this.range = range;
        }
    }

    get relativeUri(): string {
        return toRelative(this.uri);
    }

    get isEmpty(): boolean {
        return typeof this.uri === 'undefined' || typeof this.range === 'undefined';
    }

    getFields(): string[] {
        return [
            'relativeUri', 'range'
        ];
    }
}