import { Symbol, ScopeMember, NamedSymbol, Locatable } from "../symbol";
import { Identifier } from "../identifier";
import { Constant } from "./constant";
import { TypeName } from "../../type/name";
import { Location } from "../meta/location";
import { Class } from "../class/class";

export class ClassConstant extends Symbol implements ScopeMember, NamedSymbol, Locatable {
    public name: TypeName;
    public location: Location = {};
    public scope: TypeName | null = null;

    private constant: Constant = new Constant();

    consume(other: Symbol) {
        if (other instanceof Identifier) {
            this.name = other.name;

            return true;
        } else {
            this.constant.consume(other);
        }

        return false;
    }

    get value(): string {
        return this.constant.value;
    }

    set value(val: string) {
        this.constant.resolvedValue = val;
    }

    get type(): TypeName {
        return this.constant.type;
    }

    set type(val: TypeName) {
        this.constant.resolvedType = val;
    }

    getName(): string {
        return this.name.toString();
    }

    setScopeClass(scopeClass: Class) {
        this.scope = scopeClass.name;
    }
}