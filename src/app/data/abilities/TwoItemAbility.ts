import { Ability } from "../tectonic/Ability";
import { Item } from "../tectonic/Item";
import { isNull } from "../util";

// assumes max two items
function differentItems(items: Item[]): boolean {
    return items[0].id !== items[1].id;
}

function allFlag(items: Item[], flag: string) {
    return items.every((i) => i.flags.includes(flag));
}

export const twoItemAbilities: Record<string, (items: Item[]) => boolean> = {
    ALLTHATGLITTERS: (items) => allFlag(items, "TypeGem") && differentItems(items),
    BERRYBUNCH: (items) => allFlag(items, "Berry") && differentItems(items),
    CLUMSYKINESIS: () => true,
    FASHIONABLE: (items) =>
        items.filter((i) => i.flags.includes("Clothing")).length === 1 &&
        items.filter((i) => !i.flags.includes("Clothing")).length === 1 &&
        differentItems(items),
    HERBALIST: (items) => allFlag(items, "Herb") && differentItems(items),
};

export class TwoItemAbility extends Ability {
    public validateItems(items: Item[]): boolean {
        // allow anything if an item remains null, since constraints should only apply if both items are (to be) selected
        if (items.some((i) => isNull(i))) {
            return true;
        }
        return twoItemAbilities[this.id](items);
    }
}
