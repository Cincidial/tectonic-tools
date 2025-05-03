import loadedItems from "public/data/items.json";
import { CategoryBoostingItem } from "./items/CategoryBoostingItem";
import { EvioliteItem } from "./items/EvioliteItem";
import { FlatDamageBoostItem } from "./items/FlatDamageBoostItem";
import { LumberAxeItem } from "./items/LumberAxeItem";
import { StatBoostItem } from "./items/StatBoostItem";
import { StatLockItem } from "./items/StatLockItem";
import { SuperEffectiveBoostItem } from "./items/SuperEffectiveBoostItem";
import { SuperEffectiveResistItem } from "./items/SuperEffectiveResistItem";
import { TypeBoostingItem } from "./items/TypeBoostingItem";
import { TypeChangingItem } from "./items/TypeChangingItem";
import { WeatherImmuneItem } from "./items/WeatherImmuneItem";
import { LoadedItem } from "./loading/items";
import { Item } from "./types/Item";

const itemSubclasses = [
    CategoryBoostingItem,
    EvioliteItem,
    FlatDamageBoostItem,
    LumberAxeItem,
    StatBoostItem,
    StatLockItem,
    SuperEffectiveBoostItem,
    SuperEffectiveResistItem,
    TypeBoostingItem,
    TypeChangingItem,
    WeatherImmuneItem,
];

function loadItem(item: LoadedItem): Item {
    for (const subclass of itemSubclasses) {
        if (subclass.itemIds.includes(item.key)) {
            return new subclass(item);
        }
    }
    return new Item(item);
}

export const items: Record<string, Item> = Object.fromEntries(
    Object.entries(loadedItems).map(([id, item]) => [id, loadItem(item)])
);

export const nullItem: Item = new Item({
    key: "",
    name: "",
    description: "",
    pocket: 0,
    flags: [],
});
