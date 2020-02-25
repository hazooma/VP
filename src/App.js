import React from 'react';
import './App.css';
import project from './project3';
import Sprite from './Sprite';
let inputs = {};

class App extends React.Component {
  componentWillMount() {
    const a = project;
    const array = [];
    var answer = [];

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
    console.log(array);
    answer = array;
    const steps = [];
    // looping over the blocks
    answer.forEach((el, j) => {
      if (el.opcode === 'motion_movesteps') {
        steps.push({ moves: el.inputs.STEPS[1][1] });
      }
      if (el.opcode === 'motion_turnright') {
        steps.push({ rotation: el.inputs.DEGREES[1][1] });
      }
      if (el.opcode === 'motion_turnleft') {
        steps.push({ rotation: -el.inputs.DEGREES[1][1] });
      }
      if (el.opcode === 'control_repeat') {
        const repeated = [];
        // finding the repeated step
        answer.forEach((element, i) => {
          if (element.name === el.inputs.SUBSTACK[1]) {
            if (element.inputs.DEGREES) {
              var value =
                element.opcode === 'motion_turnright'
                  ? element.inputs.DEGREES[1][1]
                  : -element.inputs.DEGREES[1][1];
              repeated.push({ rotation: value });
            } else {
              repeated.push({ moves: element.inputs.STEPS[1][1] });
            }
            answer.splice(i, 1);
          }
        });
        steps.push({ repeat: { repeated, times: el.inputs.TIMES[1][1] } });
        answer.splice(j, 1);
      }
      if (el.opcode === 'operator_gt') {
        var pos = el.inputs.OPERAND1[1][1];
        var value = el.inputs.OPERAND2[1][1];
        steps.push({operation:this.getOperation(el), left:pos, right: value});
      }
      if (el.opcode === 'control_if_else') {
        var ifElse = {};
        // looping over the if else parts
        for (let ifPart in el.inputs) {
          // searching for the if block and the else block
          answer.forEach((element, j) => {
            var step = {};
            if (element.name === el.inputs[ifPart][1]) {
              var inputs = element.inputs;
              if (inputs.DEGREES) {
                var value =
                  element.opcode === 'motion_turnright'
                    ? element.inputs.DEGREES[1][1]
                    : -element.inputs.DEGREES[1][1];
                step = { rotation: value };
              } else if (inputs.STEPS) {
                step = { moves: element.inputs.STEPS[1][1] };
              } else if (inputs.TIMES) {
                const repeated = [];
                answer.forEach((searchedForRepeatElem, i) => {
                  if (searchedForRepeatElem.name === inputs.SUBSTACK[1]) {
                    if (searchedForRepeatElem.inputs.DEGREES) {
                      var value =
                        searchedForRepeatElem.opcode === 'motion_turnright'
                          ? searchedForRepeatElem.inputs.DEGREES[1][1]
                          : -searchedForRepeatElem.inputs.DEGREES[1][1];
                      repeated.push({ rotation: value });
                    } else {
                      repeated.push({
                        moves: searchedForRepeatElem.inputs.STEPS[1][1],
                      });
                    }
                    answer.splice(i, 1);
                  }
                });
                step = { repeat: { repeated, times: inputs.TIMES[1][1] } };
                answer.splice(j, 1);
              }
              else if (inputs.OPERAND1) {
                var pos = inputs.OPERAND1[2][1];
                value = inputs.OPERAND2[1][1];
                step = {operation:this.getOperation(element), left:pos, right: value};
              }
              switch (ifPart) {
                case 'SUBSTACK':
                  ifElse.if = step;
                  break;
                case 'SUBSTACK2':
                  ifElse.else = step;
                  break;
                case 'CONDITION':
                  ifElse.cond = step;
                  break;
                default:
                  break;
              }
            }
          });
        }
        console.log(ifElse);
        steps.push({ ifElse });
      }
    });
    inputs = steps;
  }

  getOperation(element){
    switch(element.opcode){
      case 'operator_gt': return '>';
      case 'operator_lt': return '<';
      case 'operator_eq': return '=';
      default: break;
    }
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
