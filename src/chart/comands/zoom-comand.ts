import { Chart } from "../chart";
import { ChartComand } from "../chart-comand";

const zoomStep = 0.2;
const minScale = 0.1;
const maxScale = 70;

export class ZoomComand extends ChartComand {
    constructor(private _pxDeleta: number) {
        super();
    }

    apply(chart: Chart) {
        let newScale: number;
        const zoomCoeff = calculateZoomCoeff(this._pxDeleta);

        if (zoomCoeff > 1) {
            newScale = chart.scale * zoomCoeff;
        } else {
            newScale = chart.scale / (1 + (1 - zoomCoeff));
        }

        if (newScale > maxScale || newScale < minScale) {
            return;
        }

        const newLeftmostUnit = chart.getLeftmostUnit(
            chart.rightmostUnit,
            newScale
        );

        if (chart.leftmostUnitIsValid(newLeftmostUnit)) {
            chart.scale = newScale;
        }
    }
}

function calculateZoomCoeff(pxDeleta: number) {
    const coeff = 1 - (zoomStep * pxDeleta) / 100;

    return coeff;
}
