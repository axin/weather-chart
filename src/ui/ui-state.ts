import { AppUi } from "./app-ui";
import { UiEvent } from "./ui-event";

export abstract class UiState {
    constructor(protected _appUi: AppUi) {}

    handleEvent(e: UiEvent) {}

    onEnter(params?: any) {}
    onExit() {}
}
