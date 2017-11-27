function generateStyle(props) {
    var Bar = {
        container: {
            height: '100%',
            width: props.width,
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            justifyItems: 'center',
            padding: '0'
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

    return {
        Bar
    };
}

export default {
    generateStyle
};
