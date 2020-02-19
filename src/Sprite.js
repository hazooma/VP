import React from 'react';

class Sprite extends React.Component {
  state = { x: 100, y: 100 };
  componentDidMount() {
    for (let index = 0; index < this.props.input.length; index++) {
      const element = this.props.input[index];
      if (!element.repeat) {
        setTimeout(() => {
          this.setState({ x: this.state.x + element.moves * 5 });
        }, 2000);
      } else {
        const g = element.repeat.times;
        let j = 0;
        for (let i = 0; i < g; i++) {
          // eslint-disable-next-line no-loop-func
          setTimeout(() => {
            this.setState({
              x: this.state.x + element.repeat.repeated[0].moves * 5,
            });
          }, 2000);
        }
      }
    }
  }
  render() {
    console.log(this.props.input);
    return (
      <div
        style={{
          height: 100,
          width: 100,
          backgroundColor: '#EF7D00',
          position: 'absolute',
          top: this.state.x,
          left: this.state.y,
          transform: `translateX(${this.state.x}px)`,
          transition: 'all 3s',
        }}
      ></div>
    );
  }
}

export default Sprite;
