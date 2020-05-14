import { Entity } from "../entity";

export class ChartLineEntity extends Entity {
    update() {}

    render() {
        const {
            leftmostDisplayingPoint,
            rightmostDisplayingPoint,
            transform,
            data,
            ctx,
        } = this._chart;

        ctx.strokeStyle = "#2934DA";
        ctx.lineWidth = 2;

        ctx.beginPath();

        for (
            let i = rightmostDisplayingPoint;
            i <= leftmostDisplayingPoint;
            i++
        ) {
            const dataIndex = this._chart.getDataIndex(i);

            const [x, y] = transform.apply(i, data.value[dataIndex]);

            if (i === rightmostDisplayingPoint) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }
}
