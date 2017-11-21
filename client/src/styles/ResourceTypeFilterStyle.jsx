var baseContainer = {
    height: '50px'
};
var baseImg = {
    boxShadow: '0 3px 3px darkgrey',
    borderRadius: '50%',
    height: '100%'
};
var style = {
    preview: {
        container: Object.assign({
        }, baseContainer),
        img: Object.assign({
        }, baseImg)
    },
    hovered: {
        container: Object.assign({
        }, baseContainer)
    }
}

export default style;
