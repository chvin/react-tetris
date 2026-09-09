/* eslint-env browser, node */

const ACTIONS = ['left', 'right', 'down', 'rotate', 'drop', 'pause'];
const REPEAT = {
  left: { delay: 180, interval: 75 },
  right: { delay: 180, interval: 75 },
  down: { delay: 60, interval: 45 },
};
const AXIS_THRESHOLD = 0.5;

const emptyPressed = () => ({
  left: false,
  right: false,
  down: false,
  rotate: false,
  drop: false,
  pause: false,
});

const isButtonPressed = (gamepad, index) => {
  const button = gamepad.buttons && gamepad.buttons[index];
  if (typeof button === 'number') {
    return button > 0.5;
  }
  return !!button && (button.pressed === true || button.value > 0.5);
};

const readGamepad = (gamepad) => {
  const horizontal = gamepad.axes && gamepad.axes[0] ? gamepad.axes[0] : 0;
  const vertical = gamepad.axes && gamepad.axes[1] ? gamepad.axes[1] : 0;
  const rawLeft = isButtonPressed(gamepad, 14) || horizontal < -AXIS_THRESHOLD;
  const rawRight = isButtonPressed(gamepad, 15) || horizontal > AXIS_THRESHOLD;
  const rawUp = isButtonPressed(gamepad, 12) || vertical < -AXIS_THRESHOLD;
  const rawDown = isButtonPressed(gamepad, 13) || vertical > AXIS_THRESHOLD;

  return {
    left: rawLeft && !rawRight,
    right: rawRight && !rawLeft,
    down: rawDown && !rawUp,
    rotate: (rawUp && !rawDown) || isButtonPressed(gamepad, 0) ||
      isButtonPressed(gamepad, 1),
    drop: isButtonPressed(gamepad, 2) || isButtonPressed(gamepad, 3) ||
      isButtonPressed(gamepad, 4) || isButtonPressed(gamepad, 5) ||
      isButtonPressed(gamepad, 6) || isButtonPressed(gamepad, 7),
    pause: isButtonPressed(gamepad, 9),
  };
};

const readGamepads = (gamepads) => {
  const pressed = emptyPressed();
  gamepads.forEach(gamepad => {
    const current = readGamepad(gamepad);
    ACTIONS.forEach(action => {
      pressed[action] = pressed[action] || current[action];
    });
  });
  if (pressed.left && pressed.right) {
    pressed.left = false;
    pressed.right = false;
  }
  return pressed;
};

const createControlState = () => ({
  pressed: emptyPressed(),
  nextRepeat: {},
});

const advanceControl = (state, pressed, now) => {
  const actions = [];
  const nextRepeat = Object.assign({}, state.nextRepeat);

  ACTIONS.forEach(action => {
    if (!pressed[action]) {
      delete nextRepeat[action];
      return;
    }
    if (!state.pressed[action]) {
      actions.push(action);
      if (REPEAT[action]) {
        nextRepeat[action] = now + REPEAT[action].delay;
      }
      return;
    }
    if (REPEAT[action] && now >= nextRepeat[action]) {
      actions.push(action);
      do {
        nextRepeat[action] += REPEAT[action].interval;
      } while (nextRepeat[action] <= now);
    }
  });

  return {
    actions,
    state: {
      pressed: Object.assign({}, pressed),
      nextRepeat,
    },
  };
};

module.exports = {
  ACTIONS,
  REPEAT,
  emptyPressed,
  readGamepad,
  readGamepads,
  createControlState,
  advanceControl,
};
