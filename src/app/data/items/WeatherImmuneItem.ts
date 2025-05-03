import { Item } from "../tectonic/Item";

export class WeatherImmuneItem extends Item {
    // has no inherent effects, but is checked for in related code
    static itemIds = ["UTILITYUMBRELLA"];
}
