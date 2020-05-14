import { Entity } from "../entity";

const beautifulDivisionSearchDistanceInPx = 30;
const minStepInPixels = 30;
const stepDivisors = [10, 5, 2];
const minValuePoint = 0.01;

const lineDashConfig = [2, 4];

export class GridEntity extends Entity {
    private _valueScaleDivides: number[] = [];

    update() {
        this._generateValueScaleDivides();
    }

    render() {
        const { ctx, transform, width } = this._chart;

        ctx.fillStyle = "black";
        ctx.font = "12px sans-serif";

        ctx.strokeStyle = "#BDC6D0";
        ctx.setLineDash(lineDashConfig);
        ctx.lineWidth = 1;

        ctx.beginPath();

        for (let i = 0; i < this._valueScaleDivides.length; i++) {
            const val = this._valueScaleDivides[i];

            const [_, y] = transform.apply(0, val);

            ctx.moveTo(0, y);
            ctx.lineTo(width, y);

            ctx.fillText(val.toFixed(2), 10, y);
        }

        ctx.stroke();
    }

    private _generateValueScaleDivides(): void {
        const { height, minDisplayingValue, maxDisplayingValue } = this._chart;
        const { scaleStep, divisor } = calculateScaleStep(
            height,
            minDisplayingValue,
            maxDisplayingValue
        );

        const firstScaleDivision = findFirstScaleDivision(
            minDisplayingValue,
            divisor
        );
        let currentScaleDivision = firstScaleDivision;

        this._valueScaleDivides.length = 0;
        this._valueScaleDivides.push(firstScaleDivision);

        while (true) {
            currentScaleDivision += scaleStep;

            if (currentScaleDivision <= maxDisplayingValue) {
                this._valueScaleDivides.push(currentScaleDivision);
            } else {
                break;
            }
        }
    }
}

function findFirstScaleDivision(scaleStart: number, divisor: number): number {
    let firstScaleDivisionInValuePoints = Math.ceil(scaleStart / minValuePoint);

    while (firstScaleDivisionInValuePoints % divisor !== 0) {
        firstScaleDivisionInValuePoints++;
    }

    return firstScaleDivisionInValuePoints * minValuePoint;
}

// First divisors in stepDivisors array are more "round" and "beautiful" than last ones.
// We try to generate scale step that matches most beautiful divisor.
// If attempt was failed, we move to next, less beautifill divisor.
function calculateScaleStep(
    height: number,
    minDisplayingValue: number,
    maxDisplayingValue: number
): {
    scaleStep: number;
    divisor: number;
} {
    const valuePointsPerPixel =
        (maxDisplayingValue - minDisplayingValue) / minValuePoint / height;
    const startScaleStep = Math.ceil(minStepInPixels * valuePointsPerPixel);
    const maxScaleStep = Math.ceil(
        (minStepInPixels + beautifulDivisionSearchDistanceInPx) *
            valuePointsPerPixel
    );

    let scaleStep;

    for (let i = 0; i < stepDivisors.length; i++) {
        const divisor = stepDivisors[i];

        scaleStep = startScaleStep;

        while (scaleStep < maxScaleStep) {
            if (scaleStep % divisor === 0) {
                return {
                    scaleStep: scaleStep * minValuePoint,
                    divisor,
                };
            }

            scaleStep++;
        }
    }

    const minDiv = Math.min(...stepDivisors);

    scaleStep = startScaleStep;

    while (true) {
        if (scaleStep % minDiv === 0) {
            return {
                scaleStep: scaleStep * minValuePoint,
                divisor: minDiv,
            };
        }

        scaleStep++;
    }
}
