var baseContainer = {
    padding: '5px 0',
    height: '50px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer'
};
var baseImgContainer = {
    height: '50px',
    width: '50px'
};
var baseImg = {
    boxShadow: '0 3px 3px darkgrey',
    borderRadius: '50%',
    height: '100%'
};
var style = {
    preview: {
        container: Object.assign({
            justifyContent: 'flex-end'
        }, baseContainer),
        imgContainer: Object.assign({
        }, baseImgContainer),
        img: Object.assign({
        }, baseImg)
    },
    hovered: {
        container: Object.assign(baseContainer, {
            flexDirection: 'row-reverse',
            justifyContent: 'flex-start',
        }),
        imgContainer: Object.assign({
        }, baseImgContainer),
        img: Object.assign({
        }, baseImg)
    }
}

export default style;
