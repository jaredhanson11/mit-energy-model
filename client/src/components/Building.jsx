import React from 'react';

class Building extends React.Component {
    constructor(props) {
      super(props);
    }

    createStyle(heatColor) {
      var boxStyle = {
        background: heatColor,
        color:'black',
        display:'inline-block',
        padding:'1px 10px',
        border: '2px solid black',
        borderColor: 'black',
        marginRight: '10px',
      }
      return boxStyle;
    }

    generateGradient(usage) {
      if(usage <= 100){
        return '#79ED50';
      }
      else if(usage <= 200) {
        return '#AEEA51';
      }
      else if(usage <= 300) {
        return '#E1E852';
      }
      else if (usage <= 400) {
        return '#E5B953';
      }
      else if (usage <= 500){
        return '#E38654';
      }
      else {
        return '#E15656';
      }
    }

    render() {
      return (
        <div style={this.createStyle(this.generateGradient(this.props.usage))}>
          <h4 style={{margin:'10px 5px 5px 5px'}}>Building {this.props.id}</h4>
          <h6 style={{textAlign:'center', margin:'5px 5px 10px 5px'}}>Usage: {this.props.usage}</h6>
        </div>
      )
    }
}

export default Building;
