import React from 'react';

class About extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const { classes, children } = this.props;
    return (
      <div id="about">
        about
      </div>
    );
  }
}


export default About;