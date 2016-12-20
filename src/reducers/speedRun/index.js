import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';

let initState = lastRecord && !isNaN(parseInt(lastRecord.speedRun, 10)) ?
  parseInt(lastRecord.speedRun, 10) : 1;
if (initState < 1 || initState > 6) {
  initState = 1;
}

const speedRun = (state = initState, action) => {
  switch (action.type) {
    case reducerType.SPEED_RUN:
      return action.data;
    default:
      return state;
  }
};

export default speedRun;
