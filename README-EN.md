### 中文介绍
请查看 [README.md](https://github.com/chvin/react-tetris/blob/master/README.md)
<hr />
## Use React, Redux, Immutable to code Tetris.
<hr />
Tetris is a classic game that has always been enthusiastically implemented in various languages. There are many versions of Javascript, and using React to do Tetris has become my goal.

Open [https://chvin.github.io/react-tetris/?lan=en](https://chvin.github.io/react-tetris/?lan=en) to play!

<hr />
### Interface preview
![Interface review](https://img.alicdn.com/tps/TB1Ag7CNXXXXXaoXXXXXXXXXXXX-320-483.gif)

The normal speed of recording, experience smooth.
<br />
### Responsive
![Responsive](https://img.alicdn.com/tps/TB1AdjZNXXXXXcCapXXXXXXXXXX-480-343.gif)

Not only refers to the screen adaptation, `but the use of the keyboard in the PC, in the phone using the finger of the response type of operation`:

![phone](https://img.alicdn.com/tps/TB1kvJyOVXXXXbhaFXXXXXXXXXX-320-555.gif)
<br />
### Data persistence
![Data persistence](https://img.alicdn.com/tps/TB1EY7cNXXXXXXraXXXXXXXXXXX-320-399.gif)

Playing stand-alone games are most afraid of? Power outage. Store the state in localStorage by subscribing to `store.subscribe`, which records all states exactly. Web page off the refresh, the program crashes, the phone is dead, re-open the connection, you can continue.
<br />
### Redux state preview
![Redux state preview](https://img.alicdn.com/tps/TB1hGQqNXXXXXX3XFXXXXXXXXXX-640-381.gif)

Redux manages all the state that should be kept, which is a guarantee of persistence above.
<br />
<hr />
Game framework is the use of React + Redux, which joined Immutable, with its examples to do to Redux state. (React and Redux on the introduction can see:[React entry examples](http://www.ruanyifeng.com/blog/2015/03/react.html)、[Redux Chinese documentation](https://camsong.github.io/redux-in-chinese/index.html))
<br />
## 1. What is Immutable?
Immutable is data that can not be changed once it is created. Any modification or addition to or deletion of an Immutable object returns a new Immutable object.
<br />
### Acquaintance：
Let's look at the following code:
```js
function keyLog(touchFn) {
  let data = { key: 'value' };
  f(data);
  console.log(data.key); // Guess what will print?
}
```
Do not look at f, do not know what it did to `data`, can not confirm what will be printed. But if `data` is Immutable, you can be sure that` value` is printed:
```js
function keyLog(touchFn) {
  let data = Immutable.Map({ key: 'value' });
  f(data);
  console.log(data.get('key'));  // value
}
```

JavaScript xxxx and aaaa use a reference assignment, the new object simply refers to the original object, change the new will also affect the old:
```js
foo = {a: 1};  bar = foo;  bar.a = 2;
foo.a // 2
```
Although this can save memory, but when the application of complex, resulting in the state is not controllable, is a big risk, the advantages of saving memory become more harm than good.

Immutable is not the same, the corresponding:
```js
foo = Immutable.Map({ a: 1 });  bar = foo.set('a', 2);
foo.get('a') // 1
```
<br />
### Concise：
In `Redux`, it's a good practice to return a new object (array) to each `reducer`, so we often see code like this:
```js
// reducer
...
return [
   ...oldArr.slice(0, 3),
   newValue,
   ...oldArr.slice(4)
];
```
In order to return to the new object (array), had the strange appearance of the above, and in the use of deeper data structure will become more difficult.
Let's take a look at Immutable's approach:
```js
// reducer
...
return oldArr.set(4, newValue);
```
Is not very simple?
<br />
### About “===”：
We know that ```===``` comparison for the `Object` and `Array` is a reference to the address rather than the "value comparison", such as:
```js
{a:1, b:2, c:3} === {a:1, b:2, c:3}; // false
[1, 2, [3, 4]] === [1, 2, [3, 4]]; // false
```

For the above can only be used `deepCopy`, `deepCompare` to traverse the comparison, not only cumbersome and good performance.

We feel about to `Immutable` approach!
```js
map1 = Immutable.Map({a:1, b:2, c:3});
map2 = Immutable.Map({a:1, b:2, c:3});
Immutable.is(map1, map2); // true

// List1 = Immutable.List([1, 2, Immutable.List[3, 4]]);
List1 = Immutable.fromJS([1, 2, [3, 4]]);
List2 = Immutable.fromJS([1, 2, [3, 4]]);
Immutable.is(List1, List2); // true
```
It seems that a breeze blowing.

React has a big trick when it comes to performance tuning, and it uses `shouldComponentUpdate()`, but it return `true` by default, which always executes the `render()` method followed by the Virtual DOM comparison.

When using native properties, it is `true` or `false` to get the correct shouldComponentUpdate, Have to use deepCopy, deepCompare to calculate the answer, the consumption of the performance is not worth. With the Immutable, it is easy to compare the deep structure using the above method.

For Tetris, imagine that the board is a `two-dimensional array`，The square that can be moved is `shape (also a two-dimensional array) + coordinates`, Superposition of the board and the box is composed of the final result of `Matrix`. The above properties are built by `Immutable`, through its comparison method, you can easily write `shouldComponentUpdate`. Source Code:[/src/components/matrix/index.js#L35](https://github.com/chvin/react-tetris/blob/master/src/components/matrix/index.js#L35)

Immutable learning materials:
* [Immutable.js](http://facebook.github.io/immutable-js/)
* [Immutable Detailed and React in practice](https://github.com/camsong/blog/issues/3)

<br />
<hr />
## 2. How to use Immutable in Redux
Goal: `state` -> Immutable.
Important plug-ins: [gajus/redux-immutable](https://github.com/gajus/redux-immutable)
Will be provided by the original Redux combineReducers provided by the above plug-ins:
``` js
// rootReduers.js
// import { combineReducers } from 'redux'; // The old method
import { combineReducers } from 'redux-immutable'; // The new method

import prop1 from './prop1';
import prop2 from './prop2';
import prop3 from './prop3';

const rootReducer = combineReducers({
  prop1, prop2, prop3,
});


// store.js
// Create a store method and the same general
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);
export default store;
```
Through the new `combineReducers` will store object into Immutable, in the container will be slightly different (but this is what we want):
``` js
const mapStateToProps = (state) => ({
  prop1: state.get('prop1'),
  prop2: state.get('prop2'),
  prop3: state.get('prop3'),
  next: state.get('next'),
});
export default connect(mapStateToProps)(App);
```

<br />
<hr />
## 3. Web Audio Api
There are many different sound effects in the game, but in fact only a reference to a sound file: [/build/music.mp3](https://github.com/chvin/react-tetris/blob/master/build/music.mp3)。With the help of `Web Audio Api`, you can play audio in millisecond precision, with a high frequency, which is not possible with the `<audio>` tag. Press the arrow keys to move the box while the game is in progress, you can hear high-frequency sound.

![Web audio advanced](https://img.alicdn.com/tps/TB1fYgzNXXXXXXnXpXXXXXXXXXX-633-358.png)

`WAA` is a new set of relatively independent interface system, the audio file has a higher processing power and more professional built-in audio effects, is the W3C recommended interface, can deal with professional "sound speed, volume, environment, sound visualization, High-frequency, sound to "and other needs, the following figure describes the use of WAA process.

![Process](https://img.alicdn.com/tps/TB1nBf1NXXXXXagapXXXXXXXXXX-520-371.png)

Where Source represents an audio source, Destination represents the final output, and multiple Source compose the Destination.
Source Code:[/src/unit/music.js](https://github.com/chvin/react-tetris/blob/master/src/unit/music.js) To achieve ajax loading mp3, and to WAA, control the playback process.

`WAA` support in the latest 2 versions of each browser([CanIUse](http://caniuse.com/#search=webaudio))

![browser compatibility](https://img.alicdn.com/tps/TB15z4VOVXXXXahaXXXXXXXXXXX-679-133.png)

IE camp can be seen with most of the Andrews machine can not be used, the other ok.

Web Audio Api learning materials:
* [Web audio concepts and usage| MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [Getting Started with Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/)

<br />
<hr />
## 4. Game on the experience of optimization
* Experience:
	* Press the arrow keys to move the level of vertical and horizontal movement of the trigger frequency is different, the game can define the trigger frequency, instead of the original event frequency, the source code:[/src/unit/event.js](https://github.com/chvin/react-tetris/blob/master/src/unit/event.js) ;
	* Left and right to move the delay can drop the speed, but when moving in the wall smaller delay; in the speed of 6 through the delay will ensure a complete horizontal movement in a row;
	* The `touchstart` and `mousedown` events are also registered for the button for responsive games. When `touchstart` occurs, `mousedown` is not triggered, and when `mousedown` occurs, the `mouseup` simulator `mouseup` will also be listened to as `mouseup`, since the mouse-removed event element can not fire. Source Code:[/src/components/keyboard/index.js](https://github.com/chvin/react-tetris/blob/master/src/components/keyboard/index.js);
	* The `visibilitychange` event, when the page is hidden\switch, the game will not proceed, switch back will continue, the `focus` state has also been written into the Redux. So when playing with the phone to `call`, the progress of the game will be saved; PC open the game do not hear any other gameover, which is a bit like `ios` application switch;
	* In the game `any` time to refresh the page, (such as the elimination of the box, the end of the game) can restore the current state;
	* The only game used in the picture is ![image](https://img.alicdn.com/tps/TB1qq7kNXXXXXacXFXXXXXXXXXX-400-186.png), the other is CSS;
	* Game compatible with Chrome, Firefox, IE9 +, Edge, etc .;
* Rules：
	* You can specify the initial board (ten levels) and speed (six levels) when the game does not start;
	* 100 points for 1 line, 300 points for 2 lines, 700 points for 3 lines, 1500 points for 4 lines;
	* The drop speed of the box increases with the number of rows eliminated (one level for every 20 lines);

<br />
<hr />
## 5. Experience in Development
* For all `component` are written `shouldComponentUpdate`, on the phone's performance is relatively significant improvement. Large and medium-sized applications in the face of performance problems, write `shouldComponentUpdate` will help you.
* `Stateless Functional Components`([Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.xjqnbfx4e)) is no lifecycle. And because the above factors, all components need to life cycle shouldComponentUpdate, so no stateless components.
* In the `webpack.config.js` devServer attribute to write `host: '0.0.0.0'`, can be used in the development of ip visit, not limited to localhost;
* Redux in the `store` not only connect to the method passed to `container`, you can jump out of the component, in other documents out to do flow control (dispatch), the source code:[/src/control/states.js](https://github.com/chvin/react-tetris/blob/master/src/control/states.js)；
* React + Redux do with the persistence is very convenient, as long as the redux state of storage, reducers do read in each of the initialization time.
* By configuring `.eslintrc.js` and `webpack.config.js`, the `ESLint` test is integrated in the project. Using ESLint allows coding to be written to specifications, effectively controlling code quality. Code that does not conform to the specifications can be found through the IDE and the console at development time (or build time). reference:[Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)；

<br />
<hr />
## 6. Summary
* As a React hand application, in the realization of the process found a small "box" or a lot of details can be optimized and polished, this time is a test of a front-end engineers and the skill of the time carefully.
* Optimization of the direction of both React itself, such as what state is stored by the Redux, which states to the state of the component like; and out of the framework of the product can have a lot of features to play, in order to meet your needs, these will be natural propulsion technology development of.
* An application from scratch, the function slowly accumulate bit by bit, it will build into a high-rise, do not fear it difficult to have the idea to knock on it. ^_^

<br />
<hr />
## 7. Development
### Install
```
npm install
```
### Run
```
npm start
```
The browser will go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
### multi-language
In the [i18n.json](https://github.com/chvin/react-tetris/blob/master/i18n.json) configuration in the multi-language environment, the use of "lan" parameter matching language such as: `https://chvin.github.io/react-tetris/?lan=en`
### Build
```
npm run build
```

Build the results in the build folder.


