import { getNextType } from '../../unit';
import * as reducerType from '../../unit/reducerType';
import { lastRecord, blockType } from '../../unit/const';

const initState = lastRecord && blockType.indexOf(lastRecord.next) !== -1 ?
  lastRecord.next : getNextType();
const parse = (state = initState, action) => {
  switch (action.type) {
    case reducerType.NEXT_BLOCK:
      return action.data;
    default:
      return state;
  }
};

export default parse;
