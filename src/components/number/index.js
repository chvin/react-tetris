import React from 'react';
import cn from 'classnames';
import propTypes from 'prop-types';

import style from './index.less';

const render = (data) => (
  <div className={style.number}>
    {
      data.map((e, k) => (
        <span className={cn(['bg', style[`s_${e}`]])} key={k} />
      ))
    }
  </div>
);

const formate = (num) => (
  num < 10 ? `0${num}`.split('') : `${num}`.split('')
);


export default class Number extends React.Component {
  constructor() {
    super();
    this.state = {
      time_count: false,
      time: new Date(),
    };
  }
  componentWillMount() {
    if (!this.props.time) {
      return;
    }
    const clock = () => {
      const count = +Number.timeInterval;
      Number.timeInterval = setTimeout(() => {
        this.setState({
          time: new Date(),
          time_count: count, // 用来做 shouldComponentUpdate 优化
        });
        clock();
      }, 1000);
    };
    clock();
  }
  shouldComponentUpdate({ number }) {
    if (this.props.time) { // 右下角时钟
      if (this.state.time_count !== Number.time_count) {
        if (this.state.time_count !== false) {
          Number.time_count = this.state.time_count; // 记录clock上一次的缓存
        }
        return true;
      }
      return false; // 经过判断这次的时间已经渲染, 返回false
    }
    return this.props.number !== number;
  }
  componentWillUnmount() {
    if (!this.props.time) {
      return;
    }
    clearTimeout(Number.timeInterval);
  }
  render() {
    if (this.props.time) { // 右下角时钟
      const now = this.state.time;
      const hour = formate(now.getHours());
      const min = formate(now.getMinutes());
      const sec = now.getSeconds() % 2;
      const t = hour.concat(sec ? 'd' : 'd_c', min);
      return (render(t));
    }

    const num = `${this.props.number}`.split('');
    for (let i = 0, len = this.props.length - num.length; i < len; i++) {
      num.unshift('n');
    }
    return (render(num));
  }
}

Number.statics = {
  timeInterval: null,
  time_count: null,
};

Number.propTypes = {
  number: propTypes.number,
  length: propTypes.number,
  time: propTypes.bool,
};

Number.defaultProps = {
  length: 6,
};
