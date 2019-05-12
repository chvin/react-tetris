### English introduction
Please view [README-EN.md](https://github.com/chvin/react-tetris/blob/master/README-EN.md)

----
## 用React、Redux、Immutable做俄罗斯方块

----
俄罗斯方块是一直各类程序语言热衷实现的经典游戏，JavaScript的实现版本也有很多，用React 做好俄罗斯方块则成了我一个目标。

戳：[https://chvin.github.io/react-tetris/](https://chvin.github.io/react-tetris/) 玩一玩！

----
### 效果预览
![效果预览](https://img.alicdn.com/tps/TB1Ag7CNXXXXXaoXXXXXXXXXXXX-320-483.gif)

正常速度的录制，体验流畅。

### 响应式
![响应式](https://img.alicdn.com/tps/TB1AdjZNXXXXXcCapXXXXXXXXXX-480-343.gif)

不仅指屏幕的自适应，而是`在PC使用键盘、在手机使用手指的响应式操作`：

![手机](https://img.alicdn.com/tps/TB1kvJyOVXXXXbhaFXXXXXXXXXX-320-555.gif)

### 数据持久化
![数据持久化](https://img.alicdn.com/tps/TB1EY7cNXXXXXXraXXXXXXXXXXX-320-399.gif)

玩单机游戏最怕什么？断电。通过订阅 `store.subscribe`，将state储存在localStorage，精确记录所有状态。网页关了刷新了、程序崩溃了、手机没电了，重新打开连接，都可以继续。

### Redux 状态预览（[Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension)）
![Redux状态预览](https://img.alicdn.com/tps/TB1hGQqNXXXXXX3XFXXXXXXXXXX-640-381.gif)

Redux设计管理了所有应存的状态，这是上面持久化的保证。

----
游戏框架使用的是 React + Redux，其中再加入了 Immutable，用它的实例来做来Redux的state。（有关React和Redux的介绍可以看：[React入门实例](http://www.ruanyifeng.com/blog/2015/03/react.html)、[Redux中文文档](https://camsong.github.io/redux-in-chinese/index.html)）

## 1、什么是 Immutable？
Immutable 是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。

### 初识：
让我们看下面一段代码：
``` JavaScript
function keyLog(touchFn) {
  let data = { key: 'value' };
  f(data);
  console.log(data.key); // 猜猜会打印什么？
}
```
不查看f，不知道它对 `data` 做了什么，无法确认会打印什么。但如果 `data` 是 Immutable，你可以确定打印的是 `value`：
``` JavaScript
function keyLog(touchFn) {
  let data = Immutable.Map({ key: 'value' });
  f(data);
  console.log(data.get('key'));  // value
}
```

JavaScript 中的`Object`与`Array`等使用的是引用赋值，新的对象简单的引用了原始对象，改变新也将影响旧的：
``` JavaScript
foo = {a: 1};  bar = foo;  bar.a = 2;
foo.a // 2
```
虽然这样做可以节约内存，但当应用复杂后，造成了状态不可控，是很大的隐患，节约的内存优点变得得不偿失。

Immutable则不一样，相应的：
``` JavaScript
foo = Immutable.Map({ a: 1 });  bar = foo.set('a', 2);
foo.get('a') // 1
```

### 简洁：
在`Redux`中，它的最优做法是每个`reducer`都返回一个新的对象（数组），所以我们常常会看到这样的代码：
``` JavaScript
// reducer
...
return [
   ...oldArr.slice(0, 3),
   newValue,
   ...oldArr.slice(4)
];
```
为了返回新的对象（数组），不得不有上面奇怪的样子，而在使用更深的数据结构时会变的更棘手。
让我们看看Immutable的做法：
``` JavaScript
// reducer
...
return oldArr.set(4, newValue);
```
是不是很简洁？

### 关于 “===”：
我们知道对于`Object`与`Array`的`===`比较，是对引用地址的比较而不是“值比较”，如：
``` JavaScript
{a:1, b:2, c:3} === {a:1, b:2, c:3}; // false
[1, 2, [3, 4]] === [1, 2, [3, 4]]; // false
```
对于上面只能采用 `deepCopy`、`deepCompare`来遍历比较，不仅麻烦且好性能。

我们感受来一下`Immutable`的做法！
``` JavaScript
map1 = Immutable.Map({a:1, b:2, c:3});
map2 = Immutable.Map({a:1, b:2, c:3});
Immutable.is(map1, map2); // true

// List1 = Immutable.List([1, 2, Immutable.List[3, 4]]);
List1 = Immutable.fromJS([1, 2, [3, 4]]);
List2 = Immutable.fromJS([1, 2, [3, 4]]);
Immutable.is(List1, List2); // true
```
似乎有阵清风吹过。

React 做性能优化时有一个`大招`，就是使用 `shouldComponentUpdate()`，但它默认返回 `true`，即始终会执行 `render()` 方法，后面做 Virtual DOM 比较。

在使用原生属性时，为了得出shouldComponentUpdate正确的`true` or `false`，不得不用deepCopy、deepCompare来算出答案，消耗的性能很不划算。而在有了Immutable之后，使用上面的方法对深层结构的比较就变的易如反掌。

对于「俄罗斯方块」，试想棋盘是一个`二维数组`，可以移动的方块则是`形状(也是二维数组)`+`坐标`。棋盘与方块的叠加则组成了最后的结果`Matrix`。游戏中上面的属性都由`Immutable`构建，通过它的比较方法，可以轻松写好`shouldComponentUpdate`。源代码：[/src/components/matrix/index.js#L35](https://github.com/chvin/react-tetris/blob/master/src/components/matrix/index.js#L35)

Immutable学习资料：
* [Immutable.js](http://facebook.github.io/immutable-js/)
* [Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)


----
## 2、如何在Redux中使用Immutable
目标：将`state` -> Immutable化。
关键的库：[gajus/redux-immutable](https://github.com/gajus/redux-immutable)
将原来 Redux提供的combineReducers改由上面的库提供：
``` JavaScript
// rootReducers.js
// import { combineReducers } from 'redux'; // 旧的方法
import { combineReducers } from 'redux-immutable'; // 新的方法

import prop1 from './prop1';
import prop2 from './prop2';
import prop3 from './prop3';

const rootReducer = combineReducers({
  prop1, prop2, prop3,
});


// store.js
// 创建store的方法和常规一样
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);
export default store;
```
通过新的`combineReducers`将把store对象转化成Immutable，在container中使用时也会略有不同（但这正是我们想要的）：

``` JavaScript
const mapStateToProps = (state) => ({
  prop1: state.get('prop1'),
  prop2: state.get('prop2'),
  prop3: state.get('prop3'),
  next: state.get('next'),
});
export default connect(mapStateToProps)(App);
```

----
## 3、Web Audio Api
游戏里有很多不同的音效，而实际上只引用了一个音效文件：[/build/music.mp3](https://github.com/chvin/react-tetris/blob/master/build/music.mp3)。借助`Web Audio Api`能够以毫秒级精确、高频率的播放音效，这是`<audio>`标签所做不到的。在游戏进行中按住方向键移动方块，便可以听到高频率的音效。

![网页音效进阶](https://img.alicdn.com/tps/TB1fYgzNXXXXXXnXpXXXXXXXXXX-633-358.png)

`WAA` 是一套全新的相对独立的接口系统，对音频文件拥有更高的处理权限以及更专业的内置音频效果，是W3C的推荐接口，能专业处理“音速、音量、环境、音色可视化、高频、音向”等需求，下图介绍了WAA的使用流程。

![流程](https://img.alicdn.com/tps/TB1nBf1NXXXXXagapXXXXXXXXXX-520-371.png)

其中Source代表一个音频源，Destination代表最终的输出，多个Source合成出了Destination。
源代码：[/src/unit/music.js](https://github.com/chvin/react-tetris/blob/master/src/unit/music.js) 实现了ajax加载mp3，并转为WAA，控制播放的过程。

`WAA` 在各个浏览器的最新2个版本下的支持情况（[CanIUse](http://caniuse.com/#search=webaudio)）

![浏览器兼容](https://img.alicdn.com/tps/TB15z4VOVXXXXahaXXXXXXXXXXX-679-133.png)

可以看到IE阵营与大部分安卓机不能使用，其他ok。


Web Audio Api 学习资料：
* [Web API 接口| MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)
* [Getting Started with Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/)

----
## 4、游戏在体验上的优化
* 技术：
	* 按下方向键水平移动和竖直移动的触发频率是不同的，游戏可以定义触发频率，代替原生的事件频率，源代码：[/src/unit/event.js](https://github.com/chvin/react-tetris/blob/master/src/unit/event.js) ；
	* 左右移动可以 delay 掉落的速度，但在撞墙移动的时候 delay 的稍小；在速度为6级时 通过delay 会保证在一行内水平完整移动一次；
	* 对按钮同时注册`touchstart`和`mousedown`事件，以供响应式游戏。当`touchstart`发生时，不会触发`mousedown`，而当`mousedown`发生时，由于鼠标移开事件元素可以不触发`mouseup`，将同时监听`mouseout` 模拟 `mouseup`。源代码：[/src/components/keyboard/index.js](https://github.com/chvin/react-tetris/blob/master/src/components/keyboard/index.js)；
	* 监听了 `visibilitychange` 事件，当页面被隐藏\切换的时候，游戏将不会进行，切换回来将继续，这个`focus`状态也被写进了Redux中。所以当用手机玩来`电话`时，游戏进度将保存；PC开着游戏干别的也不会听到gameover，这有点像 `ios` 应用的切换。
	* 在`任意`时刻刷新网页，（比如消除方块时、游戏结束时）也能还原当前状态；
	* 游戏中唯一用到的图片是![image](https://img.alicdn.com/tps/TB1qq7kNXXXXXacXFXXXXXXXXXX-400-186.png)，其他都是CSS；
	* 游戏兼容 Chrome、Firefox、IE9+、Edge等；
* 玩法：
	* 可以在游戏未开始时制定初始的棋盘（十个级别）和速度（六个级别）；
	* 一次消除1行得100分、2行得300分、3行得700分、4行得1500分；
	* 方块掉落速度会随着消除的行数增加（每20行增加一个级别）；

----
## 5、开发中的经验梳理
* 为所有的`component`都编写了`shouldComponentUpdate`，在手机上的性能相对有显著的提升。中大型应用在遇到性能上的问题的时候，写好shouldComponentUpdate 一定会帮你一把。
* `无状态组件`（[Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.xjqnbfx4e)）是没有生命周期的。而因为上条因素，所有组件都需要生命周期 shouldComponentUpdate，所以未使用无状态组件。
* 在 `webpack.config.js` 中的 devServer属性写入`host: '0.0.0.0'`，可以在开发时用ip访问，不局限在localhost；
* redux中的`store`并非只能通过connect将方法传递给`container`，可以跳出组件，在别的文件拿出来做流程控制(dispatch)，源代码：[/src/control/states.js](https://github.com/chvin/react-tetris/blob/master/src/control/states.js)；
* 用 react+redux 做持久化非常的方便，只要将redux状态储存，在每一个reduers做初始化的时候读取就好。
* 通过配置 .eslintrc.js` 与 webpack.config.js` ，项目中集成了 `ESLint` 检验。使用 ESLint 可以使编码按规范编写，有效地控制代码质量。不符规范的代码在开发时（或build时）都能通过IDE与控制台发现错误。 参考：[Airbnb: React使用规范](https://github.com/dwqs/react-style-guide)；

----
## 6、总结
* 作为一个 React 的练手应用，在实现的过程中发现小小的“方块”还是有很多的细节可以优化和打磨，这时就是考验一名前端工程师的细心和功力的时候。
* 优化的方向既有 React 的本身，比如哪些状态由 Redux存，哪些状态给组件的state就好；而跳出框架又有产品的很多特点可以玩，为了达到你的需求，这些都将自然的推进技术的发展。
* 一个项目从零开始，功能一点一滴慢慢累积，就会盖成高楼，不要畏难，有想法就敲起来吧。 ^_^

----
## 7、控制流程
![控制流程](https://img.alicdn.com/tfs/TB1B6ODRXXXXXXHaFXXXXXXXXXX-1920-1080.png)

----
## 8、开发
### 安装
```
npm install
```
### 运行
```
npm start
```
浏览自动打开 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
### 多语言
在 [i18n.json](https://github.com/chvin/react-tetris/blob/master/i18n.json) 配置多语言环境，使用"lan"参数匹配语言如：`https://chvin.github.io/react-tetris/?lan=en`
### 打包编译
```
npm run build
```

在build文件夹下生成结果。



