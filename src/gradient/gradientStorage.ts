import { createStore } from 'redux';



interface Color {
    offset: number;
    color: string;
}

interface Item extends Color {
    key: number;
}

interface Data {
    bgColor: string;
    colors: Item[];
}



function reducer (
    state: Data = getDefaultValue(),
    action: {
        type: 'updateBgColor';
        color: string;
    } | {
        type: 'addColor';
        data: Color;
    } | {
        type: 'removeColor';
        key: number;
    } | {
        type: 'updateColor';
        key: number;
        data: Color;
    },
) {

    switch (action.type) {

        case 'updateBgColor':
            state.bgColor = action.color;
            break;

        case 'addColor':
            state.colors.push({
                key: +new Date(),
                ...action.data
            })
            break;

        case 'removeColor':
            state.colors = state.colors.filter((data) => data.key !== action.key);
            break;

        case 'updateColor':
            state.colors.forEach((color, index) => {
                if (color.key === action.key) {
                    state.colors[index].color = action.data.color;
                    state.colors[index].offset = action.data.offset;
                }
            })
            break;

        default:
            return state;
    }

    return state;

}

const storage = createStore(reducer)
export default storage;

storage.subscribe(() => {
    setDefaultValue(storage.getState())
})

console.log(getDefaultValue())




function getDefaultValue (): Data {

    const local = localStorage.getItem('gradient-constructor');
    if (local) {
        return JSON.parse(local);
    }

    return {
        bgColor: '#ffffff',
        colors: [{
            key: +new Date(),
            offset: 0,
            color: '#ff0000',
        }, {
            key: +new Date() + 1,
            offset: 1,
            color: '#750000',
        }]
    }

}

function setDefaultValue (val: Data) {
    
    localStorage.setItem('gradient-constructor', JSON.stringify(val));

}