import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

const initState = lastRecord && lastRecord.pause !== undefined ? !!lastRecord.pause : false;
const pause = (state = initState, action) => {
  switch (action.type) {
    case reducerType.PAUSE:
      return action.data;
    default:
      return state;
  }
};

export default pause;
