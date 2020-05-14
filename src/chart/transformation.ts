// Transformation matrix aimed to move points from one coordinate system to another
// scaleX 0      0
// 0      scaleY 0
// shiftX shiftY 1
export class Transformation {
    private _scaleX: number = 1;
    private _scaleY: number = 1;
    private _shiftX: number = 0;
    private _shiftY: number = 0;

    constructor(
        domainX0: number,
        domainX1: number,
        domainY0: number,
        domainY1: number,
        rangeX0: number,
        rangeX1: number,
        rangeY0: number,
        rangeY1: number
    ) {
        this.update(
            domainX0,
            domainX1,
            domainY0,
            domainY1,
            rangeX0,
            rangeX1,
            rangeY0,
            rangeY1
        );
    }

    // Domain - coordinate system point is moved from
    // Range - coordinate system point is moved to
    update(
        domainX0: number,
        domainX1: number,
        domainY0: number,
        domainY1: number,
        rangeX0: number,
        rangeX1: number,
        rangeY0: number,
        rangeY1: number
    ) {
        const domainXDelta = domainX1 - domainX0;
        const domainYDelta = domainY1 - domainY0;

        const rangeXDelta = rangeX1 - rangeX0;
        const rangeYDelta = rangeY1 - rangeY0;

        this._scaleX = rangeXDelta / domainXDelta;
        this._scaleY = rangeYDelta / domainYDelta;

        this._shiftX = rangeX0 - domainX0 * this._scaleX;
        this._shiftY = rangeY0 - domainY0 * this._scaleY;
    }

    apply(x: number, y: number) {
        const result = [
            x * this._scaleX + this._shiftX,
            y * this._scaleY + this._shiftY,
        ];

        return result;
    }
}
