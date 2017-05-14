### 中文介绍
请查看 [README.md](https://github.com/chvin/react-tetris/blob/master/README.md)

----
## Use React, Redux, Immutable to code Tetris.

----
Tetris is a classic game that has always been enthusiastically implemented in various languages. There are many versions of it in Javascript, and using React to do Tetris has become my goal.

Open [https://chvin.github.io/react-tetris/?lan=en](https://chvin.github.io/react-tetris/?lan=en) to play!

----
### Interface preview
![Interface review](https://img.alicdn.com/tps/TB1Ag7CNXXXXXaoXXXXXXXXXXXX-320-483.gif)

This is the normal speed of recording, you can see it has a smooth experience.

### Responsive
![Responsive](https://img.alicdn.com/tps/TB1AdjZNXXXXXcCapXXXXXXXXXX-480-343.gif)

Not only refers to the screen adaptation, `but the change of input depending on your platform, use of the keyboard in the PC and in the phone using the touch as input`:

![phone](https://img.alicdn.com/tps/TB1kvJyOVXXXXbhaFXXXXXXXXXX-320-555.gif)

### Data persistence
![Data persistence](https://img.alicdn.com/tps/TB1EY7cNXXXXXXraXXXXXXXXXXX-320-399.gif)

What's the worst can happen when you're playing stand-alone games? Power outage. The state is stored in the `localStorage` by subscribing to `store.subscribe`, which records exactly all the state. Web page refreshes, the program crashes, the phone is dead, just re-open the connection and you can continue playing.

### Redux state preview ([Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension))
![Redux state preview](https://img.alicdn.com/tps/TB1hGQqNXXXXXX3XFXXXXXXXXXX-640-381.gif)

Redux manages all the state that should be stored, which is a guarantee to be persisted as mentioned above.

----
The Game framework is the use of [React](https://facebook.github.io/react/) + [Redux](http://redux.js.org/), together with [Immutable.js](https://facebook.github.io/immutable-js/).

## 1. What is Immutable.js?
Immutable is data that can not be changed once it is created. Any modification or addition to or deletion of an Immutable object returns a new Immutable object.

### Acquaintance：
Let's look at the following code:
``` JavaScript
function keyLog(touchFn) {
  let data = { key: 'value' };
  f(data);
  console.log(data.key); // Guess what will be printed?
}
```
If we do not look at `f`, and do not know what it did to `data`, we can not confirm what will be printed. But if `data` is *Immutable*, you can be sure that `data` haven't changed and `value` is printed:
``` JavaScript
function keyLog(touchFn) {
  let data = Immutable.Map({ key: 'value' });
  f(data);
  console.log(data.get('key'));  // value
}
```

JavaScript uses a reference assignment, meaning that the new object simply refers to the original object, changing the new will also affect the old:
``` JavaScript
foo = {a: 1};  bar = foo;  bar.a = 2;
foo.a // 2
```
Although this can save memory, when the application is complex, it can result in the state not being controllable, posing a big risk. The advantages of saving memory, in this case, become more harm than good.

With Immutable.js the same doesn't happen:
``` JavaScript
foo = Immutable.Map({ a: 1 });  bar = foo.set('a', 2);
foo.get('a') // 1
```

### Concise：
In `Redux`, it's a good practice to return a new object (array) to each `reducer`, so we often see code like this:
``` JavaScript
// reducer
...
return [
   ...oldArr.slice(0, 3),
   newValue,
   ...oldArr.slice(4)
];
```
In order modify one item in the array and return the new object (array), the code has this strange appearance above, and it becomes worse the deeper the data structure.
Let's take a look at Immutable.js's approach:
``` JavaScript
// reducer
...
return oldArr.set(4, newValue);
```
Isn't it simpler?

### About “===”：
We know that ```===``` operator for the `Object` and `Array` compares the reference to the address of the object rather than its "value comparison", such as:
``` JavaScript
{a:1, b:2, c:3} === {a:1, b:2, c:3}; // false
[1, 2, [3, 4]] === [1, 2, [3, 4]]; // false
```

To achieve the above we could only `deepCopy` and `deepCompare` to traverse the objects, but this is not only cumbersome it also harms performance.

Let's check `Immutable.js` approach!
``` JavaScript
map1 = Immutable.Map({a:1, b:2, c:3});
map2 = Immutable.Map({a:1, b:2, c:3});
Immutable.is(map1, map2); // true

// List1 = Immutable.List([1, 2, Immutable.List[3, 4]]);
List1 = Immutable.fromJS([1, 2, [3, 4]]);
List2 = Immutable.fromJS([1, 2, [3, 4]]);
Immutable.is(List1, List2); // true
```
It's smooth like a breeze blowing.

React has a big trick when it comes to performance tuning. It uses `shouldComponentUpdate()` to check (as the name says) if the component should be re-rendered, it returns `true` by default, which always executes the `render()` method followed by the Virtual DOM comparison.

If we don't return a new object when making state updates, we would have to use `deepCopy` and `deepCompare` to calculate if the new state is equal to the previous one, the consumption of the performance is not worth it. With Immutable.js, it's easy to compare deep structures using the method above.

For Tetris, imagine that the board is a `two-dimensional array`. The square that can be moved is `shape (also a two-dimensional array) + coordinates`. The superposition of the board and the box is composed of the final result of `Matrix`. The properties above are built by `Immutable.js`, through its comparison method, you can easily write `shouldComponentUpdate`. Source Code:[/src/components/matrix/index.js#L35](https://github.com/chvin/react-tetris/blob/master/src/components/matrix/index.js#L35)

Immutable learning materials:
* [Immutable.js](http://facebook.github.io/immutable-js/)
* [Immutable Detailed and React in practice](https://github.com/camsong/blog/issues/3)


----
## 2. How to use Immutable.js in Redux
Goal: `state` -> Immutable.
Important plug-ins: [gajus/redux-immutable](https://github.com/gajus/redux-immutable)
Will be provided by the original Redux combineReducers provided by the above plug-ins:
``` JavaScript
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
Through the new `combineReducers` the store object will be stored as an Immutable.js object, the container will be slightly different, but this is what we want:
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
## 3. Web Audio Api
There are many different sound effects in the game, but in fact we keep only a reference to a sound file: [/build/music.mp3](https://github.com/chvin/react-tetris/blob/master/build/music.mp3). With the help of `Web Audio Api`, you can play audio in millisecond precision, with a high frequency, which is not possible with the `<audio>` tag. Press the arrow keys to move the box while the game is in progress, you can hear high-frequency sound.

![Web audio advanced](https://img.alicdn.com/tps/TB1fYgzNXXXXXXnXpXXXXXXXXXX-633-358.png)

`WAA` is a new set of relatively independent interface system, the audio file has a higher processing power and more professional built-in audio effects, is the W3C recommended interface, can deal with professional "sound speed, volume, environment, sound visualization, High-frequency, sound to " and other needs. The following figure describes the use of WAA process.

![Process](https://img.alicdn.com/tps/TB1nBf1NXXXXXagapXXXXXXXXXX-520-371.png)

Where `Source` represents an audio source, `Destination` represents the final output. Multiple Sources compose the Destination.
Source Code:[/src/unit/music.js](https://github.com/chvin/react-tetris/blob/master/src/unit/music.js). To achieve ajax loading mp3, and to WAA, control the playback process.

`WAA` is supported in the latest 2 versions of each browser([CanIUse](http://caniuse.com/#search=webaudio))

![browser compatibility](https://img.alicdn.com/tps/TB15z4VOVXXXXahaXXXXXXXXXXX-679-133.png)

IE and Android lack support though.

Web Audio Api learning materials:
* [Web audio concepts and usage| MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [Getting Started with Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/)


----
## 4. Game on the experience of optimization
* Experience:
	* Press the arrow keys to move vertically and horizontally. The trigger frequency is different, the game can define the trigger frequency, instead of the original event frequency, the source code:[/src/unit/event.js](https://github.com/chvin/react-tetris/blob/master/src/unit/event.js) ;
	* Left and right to move the delay can drop the speed, but when moving in the wall smaller delay; in the speed of 6 through the delay will ensure a complete horizontal movement in a row;
	* The `touchstart` and `mousedown` events are also registered for the button for responsive games. When `touchstart` occurs, `mousedown` is not triggered, and when `mousedown` occurs, the `mouseup` simulator `mouseup` will also be listened to as `mouseup`, since the mouse-removed event element can not fire. Source Code:[/src/components/keyboard/index.js](https://github.com/chvin/react-tetris/blob/master/src/components/keyboard/index.js);
	* The `visibilitychange` event, when the page is hidden\switch, the game will not proceed, switch back and it will continue, the `focus` state has also been written into the Redux. So when playing with the phone and the phone has a `call`, the progress of the game will be saved; PC open the game do not hear any other gameover, which is a bit like `ios` application switch;
	* In the game `any` time you refresh the page, (such as the closing the tab or the end of the game) can restore the current state;
	* The only pictures used in the game are ![image](https://img.alicdn.com/tps/TB1qq7kNXXXXXacXFXXXXXXXXXX-400-186.png), all the rest is CSS;
	* Game compatible with Chrome, Firefox, IE9 +, Edge, etc .;
* Rules：
	* You can specify the initial board (ten levels) and speed (six levels) before the start of the game;
	* 100 points for 1 line, 300 points for 2 lines, 700 points for 3 lines, 1500 points for 4 lines;
	* The drop speed of the box increases with the number of rows eliminated (one level for every 20 lines);


----
## 5. Experience in Development
* `shouldComponentUpdate` is written for all react components, which on the phone causes a significant performance improvement. For Large and medium-sized applications when facing performance problems, try writing your own  `shouldComponentUpdate`, it will most probably help you.
* `Stateless Functional Components`([Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.xjqnbfx4e)) has no lifecycle hooks. And because all components need to write the life cycle hook `shouldComponentUpdate`, they are not used.
* In the `webpack.config.js` `devServer` attribute is written `host: '0.0.0.0'`, but you can be use in the development any other ip, not limited to localhost;
* Redux in the `store` not only connect to the method passed to `container`, you can jump out of the component, in other documents out to do flow control (dispatch), the source code:[/src/control/states.js](https://github.com/chvin/react-tetris/blob/master/src/control/states.js)；
* Dealing with persistence in React + Redux is very convenient, as long as the redux state of storage, reducers do read in each of the initialization time.
* By configuring `.eslintrc.js` and `webpack.config.js`, the `ESLint` test is integrated in the project. Using ESLint allows coding to be written to specifications, effectively controlling code quality. Code that does not conform to the specifications can be found through the IDE and the console at development time (or build time). reference:[Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)；


----
## 6. Summary
* As a React hand application, in the realization of the process found a small "box" or a lot of details can be optimized and polished, this time is a test of a front-end engineers and the skill of the time carefully.
* Optimization of the direction of both React itself, such as what state is stored by the Redux, which states to the state of the component like; and out of the framework of the product can have a lot of features to play, in order to meet your needs, these will be natural propulsion technology development of.
* An application from scratch, the function slowly accumulate bit by bit, it will build into a high-rise, do not fear it difficult to have the idea to knock on it. ^_^


----
## 7. Flowchart
![Flowchart](https://img.alicdn.com/tfs/TB1B6ODRXXXXXXHaFXXXXXXXXXX-1920-1080.png)

----
## 8. Development
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
In the [i18n.json](https://github.com/chvin/react-tetris/blob/master/i18n.json) is the configuration for the multi-language environment. You can change the language by passing the url parameter `lan` like this: `https://chvin.github.io/react-tetris/?lan=en`
### Build
```
npm run build
```

Will build the application in the build folder.



