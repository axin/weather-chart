import { Chart } from "../chart";
import { ChartComand } from "../chart-comand";

export class ResizeComand extends ChartComand {
    constructor(private _width: number, private _height: number) {
        super();
    }

    apply(chart: Chart) {
        chart.width = this._width;
        chart.height = this._height;
    }
}
