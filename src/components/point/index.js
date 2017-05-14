import React from 'react';
import propTypes from 'prop-types';

import Number from '../number';
import { i18n, lan } from '../../unit/const';

const DF = i18n.point[lan];
const ZDF = i18n.highestScore[lan];
const SLDF = i18n.lastRound[lan];

export default class Point extends React.Component {
  constructor() {
    super();
    this.state = {
      label: '',
      number: 0,
    };
  }
  componentWillMount() {
    this.onChange(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.onChange(nextProps);
  }
  shouldComponentUpdate({ cur, point, max }) {
    const props = this.props;
    return cur !== props.cur || point !== props.point || max !== props.max || !props.cur;
  }
  onChange({ cur, point, max }) {
    clearInterval(Point.timeout);
    if (cur) { // 在游戏进行中
      this.setState({
        label: point >= max ? ZDF : DF,
        number: point,
      });
    } else { // 游戏未开始
      const toggle = () => { // 最高分与上轮得分交替出现
        this.setState({
          label: SLDF,
          number: point,
        });
        Point.timeout = setTimeout(() => {
          this.setState({
            label: ZDF,
            number: max,
          });
          Point.timeout = setTimeout(toggle, 3000);
        }, 3000);
      };

      if (point !== 0) { // 如果为上轮没玩, 也不用提示了
        toggle();
      } else {
        this.setState({
          label: ZDF,
          number: max,
        });
      }
    }
  }
  render() {
    return (
      <div>
        <p>{ this.state.label }</p>
        <Number number={this.state.number} />
      </div>
    );
  }
}

Point.statics = {
  timeout: null,
};

Point.propTypes = {
  cur: propTypes.bool,
  max: propTypes.number.isRequired,
  point: propTypes.number.isRequired,
};

