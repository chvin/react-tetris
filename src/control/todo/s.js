import event from '../../unit/event';
import actions from '../../actions';

const down = (store) => {
  store.dispatch(actions.keyboard.music(true));
  if (store.getState().get('lock')) {
    return;
  }
  event.down({
    key: 's',
    once: true,
    callback: () => {
      if (store.getState().get('lock')) {
        return;
      }
      store.dispatch(actions.music(!store.getState().get('music')));
    },
  });
};

const up = (store) => {
  store.dispatch(actions.keyboard.music(false));
  event.up({
    key: 's',
  });
};


export default {
  down,
  up,
};
