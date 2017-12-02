function chartStyle(props) {
    return {
        container: {
            height: props.height,
            width: props.width,
            padding: '10px',

            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            overflowX: 'scroll'

        },
    };

}

function barStyle(props) {
    var Bar = {
        container: {
            height: props.height,
            minWidth: props.width,
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            justifyItems: 'center',
            border: 'solid thin blue',
            padding: '0',
            margin: '0 5px 0 5px'
        },

        stackedLayer: (value, max) => {
            const percent = parseFloat(value)/parseFloat(max) * 100;
            const height = percent.toString() + '%';
            return {
                height: height,
                width: '100%',
                border: 'solid thin blue'
            }
        }
    }

    return Bar;
}

export default {
    barStyle,
    chartStyle
};
