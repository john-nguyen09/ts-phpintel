import { Symbol } from "../symbol";
import { QualifiedName } from "../name/qualifiedName";

export class ClassExtend extends Symbol {
    public name: string = '';

    consume(other: Symbol) {
        if (other instanceof QualifiedName) {
            this.name = other.name;

            return true;
        }

        return false;
    }
}