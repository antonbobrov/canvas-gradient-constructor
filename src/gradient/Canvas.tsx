import { useRef, useEffect, useState } from 'react';
import storage from "./gradientStorage";

function Canvas() {

    const [forceUpdate, setForceUpdate] = useState(0);

    const [colors, setColors] = useState(storage.getState().colors);
    useEffect(() => {
        const colorEvent = storage.subscribe(() => {
            setColors(storage.getState().colors);
            setForceUpdate((val) => val + 1);
        });
        return () => {
            colorEvent();
        }
    });

    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvas.current!.getContext('2d');
        const colorEvent = storage.subscribe(() => {
            updateColors(canvas.current!, ctx!);
        });
        updateColors(canvas.current!, ctx!);
        return () => {
            colorEvent();
        }
    }, [canvas]);


    function updateColors (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {

        // vars
        const { width, height } = canvas;
        const state = storage.getState();

        // coordinates
        const x = width / 2;
        const y = height / 2;
        const radius = Math.min(width, height) / 2.5;

        // start
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();

        // set background
        ctx.fillStyle = state.bgColor;
        ctx.fillRect(0, 0, width, height);

        // circle bounds
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        // add gradient
        const grad = ctx.createRadialGradient(
            x, y,
            0, x, y, radius,
        );
        state.colors.forEach((data) => {
            grad.addColorStop(data.offset, data.color);
        });
        ctx.fillStyle = grad;
        ctx.fill();

        // end
        ctx.closePath();
        ctx.restore();

    }



    return (<>
    
        <canvas width={500} height={500} ref={canvas}></canvas>

        <pre
            style={{
                backgroundColor: '#ccc',
                color: '#000',
                paddingLeft: '10px'
            }}
        >
            {`
const grad = ctx.createRadialGradient(
    ${250}, ${250},
    0, ${250}, ${250}, ${250},
);
            `}
            {colors.map(data => (`
grad.addColorStop(${data.offset}, '${data.color}');`))}
        </pre>
        {}

    </>)

}

export default Canvas;