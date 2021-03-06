import { Consumer, Symbol, TokenSymbol } from "../symbol";
import { SymbolModifier } from "../meta/modifier";

export class MemberModifierList extends Symbol implements Consumer {
    public modifier: SymbolModifier = new SymbolModifier();

    constructor() {
        super();

        this.modifier.include(SymbolModifier.PUBLIC);
    }

    consume(other: Symbol): boolean {
        if (other instanceof TokenSymbol) {
            this.modifier.consume(other);
        }

        return false;
    }
}