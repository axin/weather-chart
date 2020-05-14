self.addEventListener("message", (e) => {
    const { cmd, requestId, fileName } = e.data;

    if (cmd === "fetch-data") {
        fetch(`data/${fileName}`)
            .then((response) => response.json())
            .then(
                (data) => {
                    const res = prepareChartData(data);

                    self.postMessage({
                        type: "data-fetched",
                        data: res,
                        requestId,
                    });
                },
                (error) => {
                    self.postMessage({
                        type: "data-fetched",
                        error,
                        requestId,
                    });
                }
            );
    }
});

function prepareChartData(rawData) {
    const milliseconds = [];
    const value = [];

    for (let i = 0; i < rawData.length; i++) {
        const { t, v } = rawData[i];
        const ms = parseDateString(t);

        milliseconds.push(ms);
        value.push(v);
    }

    const result = {
        milliseconds,
        value,
    };

    return result;
}

function parseDateString(dateStr) {
    const [year, month, day] = dateStr.split("-").map((s) => parseInt(s, 10));
    const milliseconds = Date.UTC(year, month - 1, day);

    return milliseconds;
}
