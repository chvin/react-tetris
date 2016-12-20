const eventName = {};

const down = (o) => { // 键盘、手指按下
  const keys = Object.keys(eventName);
  keys.forEach(i => {
    clearTimeout(eventName[i]);
    eventName[i] = null;
  });
  if (!o.callback) {
    return;
  }
  const clear = () => {
    clearTimeout(eventName[o.key]);
  };
  o.callback(clear);
  if (o.once === true) {
    return;
  }
  let begin = o.begin || 100;
  const interval = o.interval || 50;
  const loop = () => {
    eventName[o.key] = setTimeout(() => {
      begin = null;
      loop();
      o.callback(clear);
    }, begin || interval);
  };
  loop();
};

const up = (o) => { // 键盘、手指松开
  clearTimeout(eventName[o.key]);
  eventName[o.key] = null;
  if (!o.callback) {
    return;
  }
  o.callback();
};

const clearAll = () => {
  const keys = Object.keys(eventName);
  keys.forEach(i => {
    clearTimeout(eventName[i]);
    eventName[i] = null;
  });
};

export default {
  down,
  up,
  clearAll,
};
