import { UiState } from "../ui-state";
import { ChartType } from "../../common-types";
import { Chart } from "../../chart/chart";

export class InitializingUiState extends UiState {
    onEnter(defaultChartType: ChartType) {
        this._appUi.dataStore.getData(defaultChartType).then((data) => {
            this._appUi.mount();
            this._appUi.changeTitle(defaultChartType);
            this._appUi.currentChartType = defaultChartType;

            const [width, height] = this._appUi.getCanvasElementSize();

            this._appUi.chart = new Chart(this._appUi.ctx, data, width, height);

            requestAnimationFrame(this._appUi.loop);

            this._appUi.changeUiState(this._appUi.normalUiState);
        });
    }
}
