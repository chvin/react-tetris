import store from '../../store';
import todo from '../todo';
import gamepadLogic from './logic';

const getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;
const requestFrame = (callback) => {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(() => callback(Date.now()), 16);
};
let started = false;
let frame = null;
let controlState = gamepadLogic.createControlState();

const connectedGamepads = () => {
  if (!getGamepads) {
    return [];
  }
  const gamepads = getGamepads.call(navigator) || [];
  return Array.prototype.filter.call(gamepads, gamepad => !!gamepad && gamepad.connected !== false);
};

const trigger = (action) => {
  const todoKey = {
    drop: 'space',
    pause: 'p',
  }[action] || action;
  todo[todoKey].down(store);
  todo[todoKey].up(store);
};

const poll = (time) => {
  const gamepads = connectedGamepads();
  const step = gamepadLogic.advanceControl(
    controlState,
    gamepadLogic.readGamepads(gamepads),
    typeof time === 'number' ? time : Date.now()
  );
  controlState = step.state;
  step.actions.forEach(trigger);
  frame = requestFrame(poll);
};

const start = () => {
  if (started || !getGamepads) {
    return;
  }
  started = true;
  frame = requestFrame(poll);
};

window.addEventListener('gamepaddisconnected', () => {
  controlState = gamepadLogic.createControlState();
});

export default {
  start,
  getFrame: () => frame,
};
