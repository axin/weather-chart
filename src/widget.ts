import { AppUi } from "./ui/app-ui";
import { DataStore } from "./data-store/data-store";

export function init(containerId: string) {
    const container = document.getElementById(containerId)!;
    const dataStore = new DataStore();
    const appUi = new AppUi(container, dataStore);

    return () => {
        dataStore.dispose();
        appUi.dispose();
    };
}
