export enum ChartType {
    Temperature = "Temperature",
    Precipitation = "Precipitation",
}

// Storing data as a table improves cache coherency and makes reading faseter.
// Read more here:
// https://stackoverflow.com/questions/37506155/efficient-way-of-storing-and-retrieving-complex-objects-in-c.
export interface ChartData {
    milliseconds: number[];
    value: number[];
}

export const chartInfo: {
    [P in ChartType]: { fileName: string; title: string };
} = {
    Temperature: { fileName: "temperature.json", title: "Temperature" },
    Precipitation: { fileName: "precipitation.json", title: "Precipitation" },
};
