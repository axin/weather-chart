import { Chart } from "../chart";
import { ChartComand } from "../chart-comand";
import { ChartData } from "../../common-types";

export class ChangeDataComand extends ChartComand {
    constructor(private readonly _data: ChartData) {
        super();
    }

    apply(chart: Chart) {
        chart.data = this._data;
        chart.reset();
    }
}