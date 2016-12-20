import { List } from 'immutable';
import * as reducerType from '../../unit/reducerType';
import { blankMatrix, lastRecord } from '../../unit/const';

const initState = lastRecord && Array.isArray(lastRecord.matrix) ?
  List(lastRecord.matrix.map(e => List(e))) : blankMatrix;

const matrix = (state = initState, action) => {
  switch (action.type) {
    case reducerType.MATRIX:
      return action.data;
    default:
      return state;
  }
};

export default matrix;
