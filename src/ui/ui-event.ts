export type UiEventType =
    | "MouseMove"
    | "MouseUp"
    | "MouseDown"
    | "ChartTypeChanged";

export class UiEvent {
    constructor(
        readonly type: UiEventType,
        readonly originalEvent?: Event,
        readonly data?: any
    ) {}
}
