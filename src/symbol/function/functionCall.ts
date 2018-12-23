import { Symbol, TransformSymbol, Consumer, Locatable, NameResolvable } from "../symbol";
import { QualifiedName } from "../name/qualifiedName";
import { DefineConstant } from "../constant/defineConstant";
import { ArgumentExpressionList } from "../argumentExpressionList";
import { TypeName } from "../../type/name";
import { Location } from "../meta/location";
import { Reference, RefKind } from "../reference";
import { ImportTable } from "../../type/importTable";

export class FunctionCall extends TransformSymbol implements Consumer, Reference, Locatable, NameResolvable {
    public readonly refKind = RefKind.FunctionCall;
    public realSymbol: (Symbol & Consumer);
    public type: TypeName = new TypeName('');
    public argumentList: ArgumentExpressionList;
    public location: Location = new Location();

    consume(other: Symbol) {
        if (other instanceof QualifiedName) {
            if (other.name.toLowerCase() == 'define') {
                let defineConstant = new DefineConstant();

                defineConstant.location = this.location;
                this.realSymbol = defineConstant;
            } else {
                this.type = new TypeName(other.name);
            }

            return true;
        }

        if (this.realSymbol && this.realSymbol != this) {
            return this.realSymbol.consume(other);
        } else if (other instanceof ArgumentExpressionList) {
            this.argumentList = other;

            return true;
        }

        return false;
    }

    resolveName(importTable: ImportTable): void {
        this.type.resolveToFullyQualified(importTable);
    }
}