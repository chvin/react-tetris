import { List } from 'immutable';
import * as reducerType from '../../unit/reducerType';
import { lastRecord } from '../../unit/const';
import Block from '../../unit/block';

const initState = (() => {
  if (!lastRecord || !lastRecord.cur) { // 无记录 或 有记录 但方块为空, 返回 null
    return null;
  }
  const cur = lastRecord.cur;
  const option = {
    type: cur.type,
    rotateIndex: cur.rotateIndex,
    shape: List(cur.shape.map(e => List(e))),
    xy: cur.xy,
  };
  return new Block(option);
})();

const cur = (state = initState, action) => {
  switch (action.type) {
    case reducerType.MOVE_BLOCK:
      return action.data;
    default:
      return state;
  }
};

export default cur;
