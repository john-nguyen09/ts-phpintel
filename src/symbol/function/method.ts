import { Symbol, DocBlockConsumer } from "../symbol";
import { Function } from "./function";
import { SymbolModifier } from "../meta/modifier";
import { MethodHeader } from "./methodHeader";
import { TreeNode } from "../../util/parseTree";
import { PhpDocument } from "../phpDocument";
import { TypeName } from "../../type/name";
import { nonenumerable } from "../../util/decorator";
import { DocBlock } from "../docBlock";

export class Method extends Symbol implements DocBlockConsumer {
    public modifier: SymbolModifier = new SymbolModifier();
    public name: TypeName = null;
    public description: string = '';

    @nonenumerable
    private func: Function = null;

    constructor(node: TreeNode, doc: PhpDocument) {
        super(node, doc);

        this.func = new Function(node, doc);
    }

    consume(other: Symbol): boolean {
        if (other instanceof MethodHeader) {
            this.modifier = other.modifier;
            this.name = other.name;

            return true;
        }

        return this.func.consume(other);;
    }

    consumeDocBlock(doc: DocBlock) {
        this.func.consumeDocBlock(doc);

        this.description = this.func.description;
    }

    get types() {
        return this.func.types;
    }
}