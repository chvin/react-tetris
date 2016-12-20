import * as reducerType from '../../unit/reducerType';

const initState = false;

const reducer = (state = initState, action) => {
  switch (action.type) {
    case reducerType.KEY_DOWN:
      return action.data;
    default:
      return state;
  }
};

export default reducer;
