import React, { useState } from "react";
import { useEffect } from 'react'
import storage from "./gradientStorage";

function GradientConstructor() {

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

    return (<div>

        {/* bg color */}
        <div className="constructor-item">
            <label htmlFor="bgColor">Background color</label>
            <input 
                type="color" 
                name='bgColor' 
                id='bgColor' 
                defaultValue={storage.getState().bgColor}
                onChange={(e) => {
                    storage.dispatch({
                        type: 'updateBgColor',
                        color: e.target.value
                    })
                }} 
            />
            <hr />
        </div>

        {/* gradient colors */}
        {colors.map((color) => (

            <div 
                className="constructor-item"
                key={color.key}
            >
                <label htmlFor={`gradient-color-${color.key}`}>Gradient color</label>

                <input 
                    type="color" 
                    name={`gradient-color-${color.key}`} 
                    id={`gradient-color-${color.key}`} 
                    defaultValue={color.color}
                    onChange={(e) => {
                        storage.dispatch({
                            type: 'updateColor',
                            key: color.key,
                            data: {
                                offset: color.offset,
                                color: e.target.value,
                            }
                        })
                    }}
                />

                <input 
                    type="range" 
                    name={`gradient-offset-${color.key}`} 
                    id={`gradient-offset-${color.key}`} 
                    defaultValue={color.offset}
                    min={0}
                    max={1}
                    step={0.0001}
                    onChange={(e) => {
                        storage.dispatch({
                            type: 'updateColor',
                            key: color.key,
                            data: {
                                offset: parseFloat(e.target.value),
                                color: color.color,
                            }
                        })
                    }}
                />

                <br />

                <button
                    type="button"
                    onClick={() => {
                        storage.dispatch({
                            type: 'removeColor',
                            key: color.key
                        })
                    }}
                >Remove the color</button>

                <hr />
            </div>

        ))}

        <button
            type="button"
            onClick={() => {
                storage.dispatch({
                    type: 'addColor',
                    data: {
                        offset: 1,
                        color: '#000000',
                    }
                })
            }}
        >Add a new color</button>

    </div>)

}

export default GradientConstructor;