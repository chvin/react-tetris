import React from 'react';
import style from './index.less';
import { transform, i18n, lan } from '../../unit/const';
import { isMobile } from '../../unit';

export default class Guide extends React.Component {
  constructor() {
    super();
    this.state = {
      isMobile: isMobile(),
    };
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <div style={{ display: this.state.isMobile ? 'none' : 'block' }}>
        <div className={`${style.guide} ${style.right}`}>
          <div className={style.up}>
            <em style={{ [transform]: 'translate(0,-3px) scale(1,2)' }} />
          </div>
          <div className={style.left}>
            <em style={{ [transform]: 'translate(-7px,3px) rotate(-90deg) scale(1,2)' }} />
          </div>
          <div className={style.down}>
            <em style={{ [transform]: 'translate(0,9px) rotate(180deg) scale(1,2)' }} /></div>
          <div className={style.right}>
            <em style={{ [transform]: 'translate(7px,3px)rotate(90deg) scale(1,2)' }} />
          </div>
        </div>
        <div className={`${style.guide} ${style.left}`}>
          <p>
            <a href="https://github.com/chvin/react-tetris" rel="noopener noreferrer" target="_blank" title={i18n.linkTitle[lan]}>
              {i18n.about[lan]}
            </a>
          </p>
          <div className={style.space}>SPACE</div>
        </div>
        <div className={`${style.guide} ${style.qr}`}>
          <img
            src={`//game.weixin.qq.com/cgi-bin/comm/qrcode?s=10&m=1&d=${location.href}`}
            alt={i18n.QRCode[lan]}
            title={i18n.QRNotice[lan]}
          />
        </div>
      </div>
    );
  }
}

