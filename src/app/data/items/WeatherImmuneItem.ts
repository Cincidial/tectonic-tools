import { LoadedItem } from "../loading/items";
import { Item } from "../types/Item";

export class WeatherImmuneItem extends Item {
    constructor(item: LoadedItem) {
        super(item);
    }

    // has no inherent effects, but is checked for in related code

    static itemIds = ["UTILITYUMBRELLA"];
}
