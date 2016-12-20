import * as reducerType from '../../unit/reducerType';
import { lastRecord, maxPoint } from '../../unit/const';

let initState = lastRecord && !isNaN(parseInt(lastRecord.max, 10)) ?
  parseInt(lastRecord.max, 10) : 0;

if (initState < 0) {
  initState = 0;
} else if (initState > maxPoint) {
  initState = maxPoint;
}

const parse = (state = initState, action) => {
  switch (action.type) {
    case reducerType.MAX:
      return action.data > 999999 ? 999999 : action.data; // 最大分数
    default:
      return state;
  }
};

export default parse;
