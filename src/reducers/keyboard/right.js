import * as reducerType from '../../unit/reducerType';

const initState = false;

const reducer = (state = initState, action) => {
  switch (action.type) {
    case reducerType.KEY_RIGHT:
      return action.data;
    default:
      return state;
  }
};

export default reducer;
