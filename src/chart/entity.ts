import { Chart } from "./chart";

export abstract class Entity {
    constructor(protected _chart: Chart) {}

    abstract update(): void;
    abstract render(): void;
}
