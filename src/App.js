import React from 'react';
import './App.css';
import project from './project';
import Sprite from './Sprite';
let inputs = {};

class App extends React.Component {
  componentWillMount() {
    const a = project;
    const array = [];
    const answer = [];

    for (let index = 0; index < a.targets.length; index++) {
      const element = a.targets[index];
      if (
        !(
          Object.keys(element.blocks).length === 0 &&
          element.blocks.constructor === Object
        )
      ) {
        for (var v in element.blocks) {
          const x = element.blocks[v];
          array.push({ ...x, name: v });
        }
      }
    }
    array.forEach(x => {
      if (x.parent === null) {
        answer[0] = x;
      }
    });

    for (let i = 1; i <= 3; i++) {
      array.forEach(x => {
        if (x.parent === answer[i - 1].name) {
          answer[i] = x;
        }
      });
    }

    const steps = [];
    answer.forEach(el => {
      if (el.opcode === 'motion_movesteps') {
        steps.push({ moves: el.inputs.STEPS[1][1] });
      }
      if (el.opcode === 'control_repeat') {
        const repeated = [];
        answer.forEach((element, i) => {
          if (element.name === el.inputs.SUBSTACK[1]) {
            repeated.push({ moves: element.inputs.STEPS[1][1] });
            answer.splice(i, 1);
          }
        });

        steps.push({ repeat: { repeated, times: el.inputs.TIMES[1][1] } });
      }
    });
    inputs = steps;
  }

  render() {
    return (
      <div className="App">
        <Sprite input={inputs}></Sprite>
        <header className="App-header"></header>
      </div>
    );
  }
}

export default App;
