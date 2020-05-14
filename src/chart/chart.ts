import { ChartData } from "../common-types";
import { ChartComand } from "./chart-comand";
import { Entity } from "./entity";
import { ChartLineEntity } from "./entities/chart-line-entity";
import { GridEntity } from "./entities/grid-entity";
import { Transformation } from "./transformation";

const valueScalePaddingInPercents = 0.1;
const minDisplayingPoints = 3;

export class Chart {
    private _redrawRequired = false;
    private _entities: Entity[] = [
        new GridEntity(this),
        new ChartLineEntity(this),
    ];

    private _transform!: Transformation;

    private _leftmostUnit!: number;
    private _rightmostPoint!: number;
    private _leftmostPoint!: number;
    private _rightmostDisplayingPoint!: number;
    private _leftmostDisplayingPoint!: number;
    private _minDisplayingValue!: number;
    private _maxDisplayingValue!: number;

    rightmostUnit!: number;
    scale!: number;

    constructor(
        readonly ctx: CanvasRenderingContext2D,
        public data: ChartData,
        public width: number,
        public height: number
    ) {
        this.reset();
        this._updateChartState();
    }

    get redrawRequired() {
        return this._redrawRequired;
    }

    get transform() {
        return this._transform;
    }

    get leftmostUnit() {
        return this._leftmostUnit;
    }

    get rightmostPoint() {
        return this._rightmostPoint;
    }

    get leftmostPoint() {
        return this._leftmostPoint;
    }

    get rightmostDisplayingPoint() {
        return this._rightmostDisplayingPoint;
    }

    get leftmostDisplayingPoint() {
        return this._leftmostDisplayingPoint;
    }

    get minDisplayingValue() {
        return this._minDisplayingValue;
    }

    get maxDisplayingValue() {
        return this._maxDisplayingValue;
    }

    get widthInUnits() {
        return this.leftmostUnit - this.rightmostUnit;
    }

    reset() {
        this.rightmostUnit = 0;
        this.scale = 10;
    }

    leftmostUnitIsValid(lu: number) {
        return lu > minDisplayingPoints - 1;
    }

    rightmostUnitIsValid(ru: number) {
        return ru < this.data.value.length - minDisplayingPoints;
    }

    executeComand(comand: ChartComand) {
        comand.apply(this);

        this._updateChartState();

        for (let i = 0; i < this._entities.length; i++) {
            this._entities[i].update();
        }

        this._redrawRequired = true;
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this._entities.length; i++) {
            this.ctx.save();
            this._entities[i].render();
            this.ctx.restore();
        }

        this._redrawRequired = false;
    }

    getDataIndex(point: number) {
        const maxIndex = this.data.value.length - 1;
        let result = maxIndex - point;

        return result;
    }

    getLeftmostUnit(rightmostUnit: number, scale: number) {
        const canvasWidthInUnits = this.width / scale;

        return rightmostUnit + canvasWidthInUnits;
    }

    private _updateChartState() {
        this._leftmostUnit = this.getLeftmostUnit(
            this.rightmostUnit,
            this.scale
        );
        this._rightmostPoint = Math.floor(this.rightmostUnit);
        this._leftmostPoint = Math.floor(this._leftmostUnit);

        this._rightmostDisplayingPoint = Math.max(this._rightmostPoint, 0);
        this._leftmostDisplayingPoint = Math.min(
            this._leftmostPoint,
            this.data.value.length - 1
        );

        const startIndex = this.getDataIndex(this._leftmostDisplayingPoint);
        const endIndex = this.getDataIndex(this._rightmostDisplayingPoint);

        let minChartValue = this.data.value[startIndex];
        let maxChartValue = this.data.value[startIndex];

        for (let i = startIndex; i <= endIndex; i++) {
            const val = this.data.value[i];

            if (val < minChartValue) {
                minChartValue = val;
            }

            if (val > maxChartValue) {
                maxChartValue = val;
            }
        }

        const padding =
            (maxChartValue - minChartValue) * valueScalePaddingInPercents;

        this._minDisplayingValue = minChartValue - padding;
        this._maxDisplayingValue = maxChartValue + padding;

        this._updateTransofrm();
    }

    private _updateTransofrm() {
        if (this._transform === undefined) {
            this._transform = new Transformation(
                this._leftmostUnit,
                this.rightmostUnit,
                this._minDisplayingValue,
                this._maxDisplayingValue,
                0,
                this.width,
                this.height,
                0
            );
        } else {
            this._transform.update(
                this._leftmostUnit,
                this.rightmostUnit,
                this._minDisplayingValue,
                this._maxDisplayingValue,
                0,
                this.width,
                this.height,
                0
            );
        }
    }
}
