import { Chart } from "./chart";

export abstract class ChartComand {
    abstract apply(chart: Chart): void;
}
