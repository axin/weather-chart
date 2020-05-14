import uiTemplate from "raw-loader!./ui-template.html";
import { ChartType, chartInfo } from "../common-types";
import { UiState } from "./ui-state";
import { InitializingUiState } from "./ui-states/initializing-ui-state";
import { NormalUiState } from "./ui-states/normal-ui-state";
import { DataStore } from "../data-store/data-store";
import { Chart } from "../chart/chart";
import { ResizeComand } from "../chart/comands/resize-comand";
import normalizeWheel from "normalize-wheel";
import { ZoomComand } from "../chart/comands/zoom-comand";
import { EventQueue } from "./event-queue";
import { UiEvent } from "./ui-event";

export class AppUi {
    private _temperatureButton!: HTMLButtonElement;
    private _precipitationButton!: HTMLButtonElement;
    private _chartTitle!: HTMLDivElement;
    private _canvas!: HTMLCanvasElement;
    private _ctx!: CanvasRenderingContext2D;

    private _prevCanvasWidth = 1;
    private _prevCanvasHeight = 1;
    private _rootElement = document.createElement("div");
    private _eventQueue = new EventQueue();

    chart!: Chart;
    currentChartType!: ChartType;

    readonly initializingUiState = new InitializingUiState(this);
    readonly normalUiState = new NormalUiState(this);

    private _currentUiState: UiState = this.initializingUiState;

    constructor(
        private readonly _containerElement: HTMLElement,
        readonly dataStore: DataStore,
        defaultChartType = ChartType.Temperature
    ) {
        this._temperatureButtonClicked = this._temperatureButtonClicked.bind(
            this
        );
        this._precipitationButtonClicked = this._precipitationButtonClicked.bind(
            this
        );
        this._onWheel = this._onWheel.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this.loop = this.loop.bind(this);

        this._currentUiState.onEnter(defaultChartType);
    }

    get ctx() {
        return this._ctx;
    }

    get dpr() {
        return window.devicePixelRatio;
    }

    changeUiState(uiState: UiState, params?: any) {
        this._currentUiState.onExit();
        this._currentUiState = uiState;
        this._currentUiState.onEnter(params);
    }

    loop() {
        this._updateCanvasSize();

        const { events } = this._eventQueue;

        for (let i = 0; i < events.length; i++) {
            this._currentUiState.handleEvent(events[i]);
        }

        this._eventQueue.clear();

        if (this.chart.redrawRequired) {
            this.chart.render();
        }

        requestAnimationFrame(this.loop);
    }

    getCanvasElementSize(): [number, number] {
        const { offsetWidth, offsetHeight } = this._canvas;

        return [offsetWidth, offsetHeight];
    }

    changeTitle(chartType: ChartType) {
        this._chartTitle.innerText = chartInfo[chartType].title;
    }

    mount() {
        this._rootElement.innerHTML = uiTemplate;
        this._containerElement.appendChild(this._rootElement);

        this._temperatureButton = this._getChild<HTMLButtonElement>(
            ".temperature-button"
        );

        this._precipitationButton = this._getChild<HTMLButtonElement>(
            ".precipitation-button"
        );

        this._chartTitle = this._getChild<HTMLDivElement>(".chart-title");
        this._canvas = this._getChild<HTMLCanvasElement>(".chart-canvas");

        this._ctx = this._canvas.getContext("2d")!;

        this._subscribeEvents();
    }

    dispose() {
        this._unsubscribeEvents();
    }

    private _updateCanvasSize() {
        const [newCanvasWidth, newCanvasHeight] = this.getCanvasElementSize();

        if (
            newCanvasWidth !== this._prevCanvasWidth ||
            newCanvasHeight !== this._prevCanvasHeight
        ) {
            this._canvas.width = newCanvasWidth * this.dpr;
            this._canvas.height = newCanvasHeight * this.dpr;

            this._ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

            this._prevCanvasWidth = newCanvasWidth;
            this._prevCanvasHeight = newCanvasHeight;

            this.chart.executeComand(
                new ResizeComand(newCanvasWidth, newCanvasHeight)
            );
        }
    }

    private _temperatureButtonClicked() {
        this._eventQueue.addEvent(
            new UiEvent("ChartTypeChanged", undefined, ChartType.Temperature)
        );
    }

    private _precipitationButtonClicked() {
        this._eventQueue.addEvent(
            new UiEvent("ChartTypeChanged", undefined, ChartType.Precipitation)
        );
    }

    private _onWheel(ev: WheelEvent) {
        ev.preventDefault();

        const normalized = normalizeWheel(ev);

        this.chart.executeComand(new ZoomComand(normalized.pixelY));
    }

    private _onMouseMove(e: MouseEvent) {
        this._eventQueue.addEvent(new UiEvent("MouseMove", e), true);
    }

    private _onMouseUp(e: MouseEvent) {
        e.preventDefault();

        this._eventQueue.addEvent(new UiEvent("MouseUp", e));
    }

    private _onMouseDown(e: MouseEvent) {
        e.preventDefault();

        this._eventQueue.addEvent(new UiEvent("MouseDown", e));
    }

    private _subscribeEvents() {
        this._temperatureButton.addEventListener(
            "click",
            this._temperatureButtonClicked
        );

        this._precipitationButton.addEventListener(
            "click",
            this._precipitationButtonClicked
        );

        window.addEventListener("wheel", this._onWheel, {
            passive: false,
        });

        window.addEventListener("mousemove", this._onMouseMove);
        window.addEventListener("mouseup", this._onMouseUp);
        this._canvas.addEventListener("mousedown", this._onMouseDown);
    }

    private _unsubscribeEvents() {
        this._temperatureButton.removeEventListener(
            "click",
            this._temperatureButtonClicked
        );

        this._precipitationButton.removeEventListener(
            "click",
            this._precipitationButtonClicked
        );

        window.removeEventListener("wheel", this._onWheel);

        window.removeEventListener("mousemove", this._onMouseMove);
        window.removeEventListener("mouseup", this._onMouseUp);
        this._canvas.removeEventListener("mousedown", this._onMouseDown);
    }

    private _getChild<E extends Element>(selector: string): E {
        return this._rootElement.querySelector<E>(selector)!;
    }
}
