import React from 'react';
import {createStore} from 'redux';
import {connect} from 'react-redux';
import './App.css';

// action  creators - start script
const incrementWork = (plusTime) => ({
  type: 'INC_WORK',
  plusTime,
});

const decrementWork = (lessTime) => ({
  type: 'DEC_WORK',
  lessTime,
});

const incrementRest = (plusRest) => ({
  type: 'INC_REST',
  plusRest,
});

const decrementRest = (lessRest) => ({
  type: 'DEC_REST',
  lessRest,
});

const tickTimer = (workInMilliseconds, restInMilliseconds) => ({
  type: 'TICK_TIMER',
  minutes,
  seconds,
  workInMilliseconds,
  //restInMilliseconds,
});
// action creators - end script

/*-----------------------------------------------------------------------*/

// reducers - start script
const initialState = {
  rest: 5,
  work: 25,
  workInMilliseconds: 1500000,
  restInMilliseconds: 300000,
  minutes: '25',
  seconds: '00',
  ticked: false,
};

const PomoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INC_WORK':
      return Object.assign({}, state, {
        work: state.work + action.plusTime,
        workInMilliseconds: state.workInMilliseconds + 60000,
        minutes: (state.work + action.plusTime).toString(),
      });
    case 'DEC_WORK':
      if (state.work === 1) {
        return state;
      }
      return Object.assign({}, state, {
        work: state.work - action.lessTime,
        workInMilliseconds: state.workInMilliseconds - 60000,
        minutes: (state.work - action.lessTime).toString(),
      });
    case 'INC_REST':
      return Object.assign({}, state, {
        rest: state.rest + action.plusRest,
        restInMilliseconds: state.restInMilliseconds + 60000,
      });
    case 'DEC_REST':
      if (state.rest === 1) {
        return state;
      }
      return Object.assign({}, state, {
        rest: state.rest - action.lessRest,
        restInMilliseconds: state.restInMilliseconds - 60000,
      });
    case 'TICK_TIMER':
      return Object.assign({}, state, {
        minutes: action.minutes.toString(),
        seconds: ('0' + action.seconds.toString()).slice(-2),
        workInMilliseconds: action.workInMilliseconds,
        ticked: !state.ticked,
      });
    default:
      return state;
  }
}
// reducers - end script

/*-----------------------------------------------------------------------*/

// components - start script
const Pomodoro = ({
  increaseRest, 
  decreaseRest, 
  rest,
  increaseWork,
  decreaseWork,
  work,
  minutes,
  seconds,
  clickTimer,
  ticked,
  workInMilliseconds,
  restInMilliseconds,
}) => (
  <div>
    <button
      classID="restBtn" 
      onClick={() => decreaseRest(1)}>-</button>

    {' '}<span>{rest}</span>{' '}

    <button 
      onClick={() => increaseRest(1)}>+</button>

    {' '}<span 
          onClick={() => {
            let timeInterval = setInterval(() => {
              if (workInMilliseconds <= 0) {
                clearInterval(timeInterval);
              }
              clickTimer(workInMilliseconds);
            }, 1000)
          }}>{minutes}:{seconds}</span>{' '}

    <button
      classID="workBtn" 
      onClick={() => decreaseWork(1)}>-</button>

    {' '}<span>{work}</span>{' '}

    <button 
      onClick={() => increaseWork(1)}>+</button>
  </div>
);
// components - end script

/*-----------------------------------------------------------------------*/

// containers - start script
const mapStateToProps = (state) => ({
  rest: state.rest,
  work: state.work,
  minutes: state.minutes,
  seconds: state.seconds,
  workInMilliseconds: state.workInMilliseconds,
  restInMilliseconds: state.restInMilliseconds,
  ticked: state.ticked,
});

const mapDispatchToProps = (dispatch) => ({
  increaseRest: (plusRest) => {
    dispatch(incrementRest(plusRest));
  },
  decreaseRest: (lessRest) => {
    dispatch(decrementRest(lessRest));
  },
  increaseWork: (plusTime) => {
    dispatch(incrementWork(plusTime));
  },
  decreaseWork: (lessTime) => {
    dispatch(decrementWork(lessTime));
  },
  clickTimer: (workInMilliseconds) => {
    let timex = getTimeRemaining(workInMilliseconds);
    console.log(timex);
    dispatch(tickTimer(timex.minutes, timex.seconds, timex.workInMilliseconds));
  }
});

export const store = createStore(PomoReducer);
export const App = connect(mapStateToProps, mapDispatchToProps)(Pomodoro);
// containers - end script

/*-----------------------------------------------------------------------*/
function getTimeRemaining(timeRemaining) {
  var workInMilliseconds = timeRemaining - 1000;
  var minutes = Math.floor((workInMilliseconds/1000/60) % 60);
  var seconds = Math.floor((workInMilliseconds/1000) % 60);
  return {
    minutes, seconds, workInMilliseconds
  };
}
/*
function initializedClock(timeRemaining) {
  var timeInterval = setInterval(() => {
    var timex = getTimeRemaining(timeRemaining);
    if (timex.t <= 0) {
      clearInterval(timeInterval);
    }
  }, 1000);
}
*/