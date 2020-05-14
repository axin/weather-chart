import { UiState } from "../ui-state";
import { UiEvent } from "../ui-event";
import { ScrollComand } from "../../chart/comands/scroll-comand";
import { ChartType } from "../../common-types";
import { ChangeDataComand } from "../../chart/comands/change-data-comand";

export class NormalUiState extends UiState {
    private _lmbDown!: boolean;
    private _prevX!: number;
    private _targetChartType?: ChartType;

    handleEvent(e: UiEvent) {
        const ev = e.originalEvent as any;

        if (e.type === "MouseDown" && ev.button === 0) {
            this._lmbDown = true;
            this._prevX = ev.clientX;
        } else if (e.type === "MouseUp" && ev.button === 0) {
            if (this._lmbDown) {
                this._lmbDown = false;
            }
        } else if (e.type === "MouseMove" && this._lmbDown) {
            const curX = ev.clientX;
            const dx = (curX - this._prevX) * this._appUi.dpr;

            this._prevX = curX;
            this._appUi.chart.executeComand(new ScrollComand(dx));
        } else if (e.type === "ChartTypeChanged") {
            const chartType = e.data as ChartType;

            if (chartType === this._appUi.currentChartType) {
                return;
            }

            this._targetChartType = chartType;

            this._appUi.dataStore.getData(chartType).then((data) => {
                if (this._targetChartType !== chartType) {
                    return;
                }

                this._appUi.changeTitle(chartType);
                this._appUi.currentChartType = chartType;
                this._appUi.chart.executeComand(new ChangeDataComand(data));

                this._targetChartType = undefined;
            });
        }
    }

    onEnter() {
        this._lmbDown = false;
        this._prevX = 0;
        this._targetChartType = undefined;
    }
}
