import { ChartData, ChartType, chartInfo } from "../common-types";

interface PromiseFuncs<T> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

export class DataStore {
    private _requestId = 0;
    private _worker = new Worker("data-fetcher-worker.js");
    private _promiseFuncs = new Map<number, PromiseFuncs<ChartData>>();
    private _cache = new Map<ChartType, ChartData>();

    constructor() {
        this._onMessage = this._onMessage.bind(this);

        this._worker.addEventListener("message", this._onMessage);
    }

    getData(chartType: ChartType): Promise<ChartData> {
        if (this._cache.has(chartType)) {
            const data = this._cache.get(chartType)!;

            return Promise.resolve(data);
        }

        return this._fetchData(chartType).then((data) => {
            this._cache.set(chartType, data);

            return data;
        });
    }

    dispose() {
        this._worker.removeEventListener("message", this._onMessage);
        this._worker.terminate();
    }

    private _fetchData(chartType: ChartType): Promise<ChartData> {
        const { fileName } = chartInfo[chartType];

        return new Promise((resolve, reject) => {
            const requestId = this._generateRequestId();

            this._promiseFuncs.set(requestId, { resolve, reject });

            this._worker.postMessage({
                cmd: "fetch-data",
                requestId,
                fileName,
            });
        });
    }

    private _onMessage(ev: MessageEvent) {
        const { type, requestId, data, error } = ev.data;

        if (type === "data-fetched" && this._promiseFuncs.has(requestId)) {
            const { resolve, reject } = this._promiseFuncs.get(requestId)!;

            if (data) {
                resolve(data);
            } else {
                reject(error);
            }
        }
    }

    private _generateRequestId() {
        return this._requestId++;
    }
}
