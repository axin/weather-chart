import { Chart } from "../chart";
import { ChartComand } from "../chart-comand";

export class ScrollComand extends ChartComand {
    constructor(private _dx: number) {
        super();
    }

    apply(chart: Chart) {
        const deltaInUnits = (this._dx / chart.width) * chart.widthInUnits;

        const newRightmostUnit = chart.rightmostUnit + deltaInUnits;
        const newLeftmostUnit = chart.getLeftmostUnit(
            newRightmostUnit,
            chart.scale
        );

        if (
            chart.leftmostUnitIsValid(newLeftmostUnit) &&
            chart.rightmostUnitIsValid(newRightmostUnit)
        ) {
            chart.rightmostUnit = newRightmostUnit;
        }
    }
}
