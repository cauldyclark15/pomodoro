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

const startTimer = (workInMilliseconds) => ({
  type: 'START_TIMER',
  workInMilliseconds,
});

const stopTimer = (workInMilliseconds) => ({
  type: 'STOP_TIMER',
  workInMilliseconds,
})

const workTimer = (workInMilliseconds) => ({
  type: 'TICK_TIMER',
  workInMilliseconds,
});

const restTimer = (restInMilliseconds) => ({
  type: 'TICK_REST',
  restInMilliseconds,
});
// action creators - end script

/*-----------------------------------------------------------------------*/

// reducers - start script
const initialState = {
  rest: 5,
  work: 25,
  workInMilliseconds: 1500000,
  restInMilliseconds: 300000,
  ticked: false,
  resting: false,
};

const PomoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INC_WORK':
      return Object.assign({}, state, {
        work: state.work + action.plusTime,
        workInMilliseconds: state.workInMilliseconds + 60000,
      });
    case 'DEC_WORK':
      if (state.work === 1) {
        return state;
      }
      return Object.assign({}, state, {
        work: state.work - action.lessTime,
        workInMilliseconds: state.workInMilliseconds - 60000,
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
    case 'START_TIMER':
      if (action.workInMilliseconds === 0) {
        return Object.assign({}, state, {
          workInMilliseconds: state.work * 60 * 1000,
          restInMilliseconds: state.rest * 60 * 1000,
          resting: false,
        });
      }
      return Object.assign({}, state, {
        workInMilliseconds: state.ticked ? (action.workInMilliseconds - 1000) : state.workInMilliseconds,
        ticked: true,
      });
    case 'STOP_TIMER':
      if (state.resting) {
        return state;
      }
      return Object.assign({}, state, {
        paused: true,
        ticked: false,
        workInMilliseconds: action.workInMilliseconds,
      });
    case 'TICK_TIMER':
      return Object.assign({}, state, {
        workInMilliseconds: action.workInMilliseconds,
      });
    case 'TICK_REST':
      return Object.assign({}, state, {
        restInMilliseconds: action.restInMilliseconds,
        resting: true,
      });
    default:
      return state;
  }
}

export const store = createStore(PomoReducer);
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
  tr,
  start,
  stop,
  workInMilliseconds,
  ticked,
  resting,
}) => (
  <div>
    <button
      className="restBtn" 
      onClick={() => decreaseRest(1)}>-</button>

    {' '}<span>{rest}</span>{' '}

    <button 
      onClick={() => increaseRest(1)}>+</button>

    {' '}<span 
          style={{color: ticked ? "blue" : "red"}}
          onClick={() => {
            if (ticked) {
              return stop(workInMilliseconds);
            }
            return start(workInMilliseconds);
          }}
        >{tr.minutes}:{tr.seconds}</span>{' '}

    <button
      className="workBtn" 
      onClick={() => decreaseWork(1)}>-</button>

    {' '}<span>{work}</span>{' '}

    <button 
      onClick={() => increaseWork(1)}>+</button>
    <p
      style={{visibility: resting ? "visible" : "hidden"}}
    >Breaktime</p>
  </div>
);
// components - end script

/*-----------------------------------------------------------------------*/

// containers - start script
const mapStateToProps = (state) => ({
  rest: state.rest,
  work: state.work,
  workInMilliseconds: state.workInMilliseconds,
  tr: state.workInMilliseconds === 0 ? getTimeRemaining(state.restInMilliseconds) : getTimeRemaining(state.workInMilliseconds),
  ticked: state.ticked,
  resting: state.resting,
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
  start: (workInMilliseconds) => {
    dispatch(startTimer(workInMilliseconds));
  },
  stop: (workInMilliseconds) => {
    dispatch(stopTimer(workInMilliseconds));
  },
});

let timeInterval = null;
store.subscribe(() => {
  let status = store.getState();
  if (status.ticked && (status.workInMilliseconds > 0)) {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      store.dispatch(workTimer(status.workInMilliseconds - 1000));
    }, 1000);
  }
  if (status.workInMilliseconds === 0 && status.restInMilliseconds === 0) {
    store.dispatch(startTimer(status.workInMilliseconds));
  } else if(status.workInMilliseconds === 0) {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      store.dispatch(restTimer(status.restInMilliseconds - 1000));
    }, 1000)
  }
  if (!status.ticked && !status.resting) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
})

export const App = connect(mapStateToProps, mapDispatchToProps)(Pomodoro);
// containers - end script

/*-----------------------------------------------------------------------*/

// helper functions - start script
function getTimeRemaining(timeRemaining) {
  let minutes = (Math.floor((timeRemaining/1000/60) % 60)).toString();
  let seconds = ('0' + (Math.floor((timeRemaining/1000) % 60)).toString()).slice(-2);
  return {
    minutes, 
    seconds, 
  };
}