import React from 'react';
import {createStore} from 'redux';
import {connect} from 'react-redux';
//import throttle from 'lodash/throttle'
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
})

const stopTimer = (workInMilliseconds) => ({
  type: 'STOP_TIMER',
  workInMilliseconds,
})

const tickTimer = (workInMilliseconds) => ({
  type: 'TICK_TIMER',
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
  ticked: false,
  paused: false,
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
      return Object.assign({}, state, {
        paused: false,
        ticked: true,
        workInMilliseconds: state.paused ? (action.workInMilliseconds - 1000) : state.workInMilliseconds
      });
    case 'STOP_TIMER':
      return Object.assign({}, state, {
        paused: true,
        ticked: false,
        workInMilliseconds: action.workInMilliseconds,
      });
    case 'TICK_TIMER':
      return Object.assign({}, state, {
        workInMilliseconds: action.workInMilliseconds,
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
}) => (
  <div>
    <button
      classID="restBtn" 
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
  workInMilliseconds: state.workInMilliseconds,
  tr: getTimeRemaining(state.workInMilliseconds),
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
  start: (workInMilliseconds) => {
    dispatch(startTimer(workInMilliseconds));
  },
  stop: (workInMilliseconds) => {
    dispatch(stopTimer(workInMilliseconds));
  },
});

let timeInterval = null;
store.subscribe(() => {
  if (store.getState().ticked && (store.getState().workInMilliseconds > 0)) {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      if (store.getState().ticked && (store.getState().workInMilliseconds > 0)) {
        store.dispatch(tickTimer(store.getState().workInMilliseconds - 1000));
      }
      //clearInterval(timeInterval);
      //timeInterval = null;
    }, 1000);
  }
  if (!store.getState().ticked) {
    clearInterval(timeInterval);
  }
  console.log(store.getState());
  console.log('interval value: ', timeInterval);
  /**
  if (!store.getState().ticked) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  */
})

export const App = connect(mapStateToProps, mapDispatchToProps)(Pomodoro);
// containers - end script

/*-----------------------------------------------------------------------*/

function getTimeRemaining(timeRemaining) {
  let minutes = (Math.floor((timeRemaining/1000/60) % 60)).toString();
  let seconds = ('0' + (Math.floor((timeRemaining/1000) % 60)).toString()).slice(-2);
  return {
    minutes, 
    seconds, 
  };
}

/**  componentWillMount: (workInMilliseconds) => {
    if (workInMilliseconds > 0) {
      timeInterval = setInterval(() => {
        let timex = getTimeRemaining(workInMilliseconds);
        dispatch(tickTimer(timex.minutes, timex.seconds, timex.workInMilliseconds));
      }, 1000)
    }
    if (workInMilliseconds === 0) {
      clearInterval(timeInterval);
      timeInterval = null;
    }
  },
*/
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