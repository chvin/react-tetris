import * as reducerType from '../../unit/reducerType';
import { isFocus } from '../../unit/';

const initState = isFocus();
const focus = (state = initState, action) => {
  switch (action.type) {
    case reducerType.FOCUS:
      return action.data;
    default:
      return state;
  }
};

export default focus;
