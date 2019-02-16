import { Symbol, Consumer } from "../symbol";
import { Reference, RefKind } from "../reference";
import { TypeName } from "../../type/name";
import { Location } from "../meta/location";
import { ScopedMemberName } from "../name/scopedMemberName";
import { FunctionCall } from "./functionCall";
import { ArgumentExpressionList } from "../argumentExpressionList";

export class MethodCall extends Symbol implements Consumer, Reference {
    public readonly refKind = RefKind.Method;
    public type: TypeName = new TypeName('');
    public location: Location = {};
    public scope: TypeName = new TypeName('');

    private funcCall: FunctionCall = new FunctionCall();

    consume(other: Symbol): boolean {
        if (other instanceof ScopedMemberName) {
            this.type = other.name;
            this.location = other.location;

            return true;
        } else {
            return this.funcCall.consume(other);
        }
    }

    get argumentList(): ArgumentExpressionList {
        this.funcCall.argumentList.type = this.type;
        this.funcCall.argumentList.scope = this.scope;

        return this.funcCall.argumentList;
    }
}