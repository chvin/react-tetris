### 中文介绍
请查看 [README.md](https://github.com/chvin/react-tetris/blob/master/README.md)

### English introduction
Please view [README-EN.md](https://github.com/chvin/react-tetris/blob/master/README-EN.md)

----
## Usa React, Redux, Immutable para crear Tetris. 

----
Tetris es un juego clásico que siempre ha sido entusiastamente implementado en varios idiomas. Hay muchas versiones de él en Javascript por ello usar React para hacer Tetris se ha convertido en mi objetivo.

Abre [https://chvin.github.io/react-tetris/?lan=es](https://chvin.github.io/react-tetris/?lan=es) para jugar!

----
### Prevista de la interfaz
![Interface review](https://img.alicdn.com/tps/TB1Ag7CNXXXXXaoXXXXXXXXXXXX-320-483.gif)

Esta es una velocidad normal de grabación, puedes ver que tiene una experiencia suave.

### Responsive
![Responsive](https://img.alicdn.com/tps/TB1AdjZNXXXXXcCapXXXXXXXXXX-480-343.gif)

No solo se refiere a la adaptación de la pantalla, `sino que también depende de la plataforma, el uso del teclado en la PC y el uso del toque en el teléfono como entrada`:

![phone](https://img.alicdn.com/tps/TB1kvJyOVXXXXbhaFXXXXXXXXXX-320-555.gif)

### Guardado de datos
![Data persistence](https://img.alicdn.com/tps/TB1EY7cNXXXXXXraXXXXXXXXXXX-320-399.gif)

La página web se actualiza, el programa se bloquea o el teléfono sé muere, simplemente reabra la conexión y puede continuar jugando. Los datos del estado se almacena en tiempo real en el `localStorage` al llamar el método `store.subscribe`, que registra exactamente todo el estado.

### Prevista del estado de Redux ([Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension))
![Redux state preview](https://img.alicdn.com/tps/TB1hGQqNXXXXXX3XFXXXXXXXXXX-640-381.gif)

Redux maneja todo el estado que debe ser almacenado, lo que garantiza todo lo mencionado antes.

----
El juego usa React para ser construído [React](https://facebook.github.io/react/) + [Redux](http://redux.js.org/), together with [Immutable.js](https://facebook.github.io/immutable-js/).

## 1. Qué es Immutable.js?
Immutable son datos que no pueden ser cambiados una vez que son creados. Cualquier modificación o adición a o eliminación de un objeto Immutable devuelve un nuevo objeto Immutable.

### Acquaintance：
Echemos un vistazo al siguiente código:
``` JavaScript
function keyLog(touchFn) {
  let data = { key: 'value' };
  f(data);
  console.log(data.key); // Adivina qué sale de output
}
```
Si no miramos `f`, y no sabemos lo que hizo a `data`, no podemos confirmar lo que se imprimirá. Pero si `data` es *Immutable*, puedes estar seguro de que `data` no ha cambiado y se imprime `value`:
``` JavaScript
function keyLog(touchFn) {
  let data = Immutable.Map({ key: 'value' });
  f(data);
  console.log(data.get('key'));  // value
}
```

JavaScript usa una asignación de referencia, lo que significa que el nuevo objeto simplemente se refiere al objeto original, cambiar el nuevo también afectará al viejo:
``` JavaScript
foo = {a: 1};  bar = foo;  bar.a = 2;
foo.a // 2
```

Esto ayuda a reducir malgasto de memória cuando la applicación es compleja, y ayuda a reducir el riesgo de que el estado no sea controlable. Las ventajas de ahorrar memoria, en este caso, se convierten en más daño que beneficio.

Con Immutable.js esto no sucede:
``` JavaScript
foo = Immutable.Map({ a: 1 });  bar = foo.set('a', 2);
foo.get('a') // 1
```

### Conciso：
En `Redux`, es una buena práctica devolver un nuevo objeto (array) a cada `reducer`, por lo que a menudo vemos código como este:
``` JavaScript
// reducer
...
return [
   ...oldArr.slice(0, 3),
   newValue,
   ...oldArr.slice(4)
];
```
En orden de modificar un elemento en el array y devolver el nuevo objeto (array), el código tiene esta extraña apariencia de arriba, y se vuelve peor a medida que la estructura de datos se vuelve más profunda.
``` JavaScript
// reducer
...
return oldArr.set(4, newValue);
```
No es más simple?

### About “===”：
Sabemos que el operador ```===``` para el `Object` y `Array` compara la referencia a la dirección del objeto en lugar de su "comparación de valor", como:
``` JavaScript
{a:1, b:2, c:3} === {a:1, b:2, c:3}; // false
[1, 2, [3, 4]] === [1, 2, [3, 4]]; // false
```

Para lograr lo anterior, solo podríamos `deepCopy` y `deepCompare` para recorrer los objetos, pero esto no solo es engorroso, también perjudica el rendimiento.

Vamos a ver el enfoque de `Immutable.js`!
``` JavaScript
map1 = Immutable.Map({a:1, b:2, c:3});
map2 = Immutable.Map({a:1, b:2, c:3});
Immutable.is(map1, map2); // true

// List1 = Immutable.List([1, 2, Immutable.List[3, 4]]);
List1 = Immutable.fromJS([1, 2, [3, 4]]);
List2 = Immutable.fromJS([1, 2, [3, 4]]);
Immutable.is(List1, List2); // true
```
Es suave como una brisa que sopla.

React tiene una ventaja grande cuando se trata de optimización de rendimiento. Usa `shouldComponentUpdate()` para comprobar (como el nombre dice) si el componente debe ser re-renderizado, devuelve `true` por defecto, que siempre ejecuta el método `render()` seguido de la comparación del Virtual DOM. Si devuelve `false`, el componente no se renderiza.

Si no devolvemos un nuevo objeto al hacer actualizaciones de estado, tendremos que usar `deepCopy` y `deepCompare` para calcular si el nuevo estado es igual al anterior, el consumo del rendimiento no vale la pena. Con Immutable.js, es fácil comparar estructuras profundas usando el método anterior. 

Para Tetris, imagina que el tablero es un `array bidimensional`. El cuadrado que se puede mover es `forma (también un array bidimensional) + coordenadas`. La superposición del tablero y la caja está compuesta por el resultado final de `Matrix`. Las propiedades anteriores están construidas por `Immutable.js`, a través de su método de comparación, puedes escribir fácilmente `shouldComponentUpdate`. Código fuente:[/src/components/matrix/index.js#L35](https://github.com/chvin/react-tetris/blob/master/src/components/matrix/index.js#L35)

Material de aprendizaje para Immutable.js:
* [Immutable.js](http://facebook.github.io/immutable-js/)
* [Immutable Detallado y React en practica](https://github.com/camsong/blog/issues/3)


----
## 2. Cómo usar Immutable.js en Redux
Meta: `state` -> Immutable.
Plugin importante: [gajus/redux-immutable](https://github.com/gajus/redux-immutable)
Será proporcionado por el combinador de reducers original de Redux proporcionado por el complemento anterior:
``` JavaScript
// rootReducers.js
// import { combineReducers } from 'redux'; // El método original
import { combineReducers } from 'redux-immutable'; // El nuevo método

import prop1 from './prop1';
import prop2 from './prop2';
import prop3 from './prop3';

const rootReducer = combineReducers({
  prop1, prop2, prop3,
});


// store.js
// Crea un store y el mismo método general
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);
export default store;
```
Por el nuevo `combineReducers` el objeto de la tienda se almacenará como un objeto Immutable.js, el contenedor será ligeramente diferente, pero esto es lo que queremos:
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

Hay muchos efectos de sonido diferentes en el juego, pero solo mantenemos una referencia a un archivo de sonido: [/build/music.mp3](https://github.com/chvin/react-tetris/blob/master/build/música.mp3). Con la ayuda de `Web Audio Api`, puede reproducir audio con precisión de milisegundos, con una alta frecuencia, lo que no es posible con la etiqueta `<audio>`. Presione las teclas de flecha para mover el cuadro mientras el juego está en progreso, puede escuchar un sonido de alta frecuencia.

![Web audio advanced](https://img.alicdn.com/tps/TB1fYgzNXXXXXXnXpXXXXXXXXXX-633-358.png)

`WAA` es un nuevo conjunto de sistema de interfaz relativamente independiente, el archivo de audio tiene una mayor potencia de procesamiento y efectos de audio integrados más profesionales, es la interfaz recomendada por W3C, puede manejar "velocidad de sonido profesional, volumen, entorno, visualización de sonido , Alta frecuencia, sonido a "y otras necesidades. La siguiente figura describe el uso del proceso WAA.

![Process](https://img.alicdn.com/tps/TB1nBf1NXXXXXagapXXXXXXXXXX-520-371.png)

Donde `Fuente` representa una fuente de audio, `Destino` representa la salida final. Múltiples fuentes componen el destino.
Código fuente:[/src/unit/music.js](https://github.com/chvin/react-tetris/blob/master/src/unit/music.js). Para lograr cargar ajax mp3 y WAA, controle el proceso de reproducción.

`WAA` es soportado en las últimas 2 versiones de cada navegador ([CanIUse](http://caniuse.com/#search=webaudio))

![browser compatibility](https://img.alicdn.com/tps/TB15z4VOVXXXXahaXXXXXXXXXXX-679-133.png)

IE y Android no tienen soporte.

Material de aprendizaje de Web Audio Api `WAA`:
* [Web audio, conceptos y uso| MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [Primeros pasos con Web Audio API](http://www.html5rocks.com/en/tutorials/webaudio/intro/)


----
## 4. El juego optimizado para la mejor experiencia
* Experiencia de juego:
	* Presiona las flechas para moverte vertical y horizontalmente. La frecuencia de activación es diferente, el juego puede definir la frecuencia de activación, en lugar de la frecuencia del evento original, el código fuente:[/src/unit/event.js](https://github.com/chvin/react-tetris/blob/maester/src/unit/event.js) ;
	* Izquierda y derecha para mover el retraso puede disminuir la velocidad, pero cuando se mueve en la pared, el retraso es menor; en la velocidad de 6 a través del retraso asegurará un movimiento horizontal completo en una fila ;
	* Los eventos `touchstart` y `mousedown` también se registran para el botón para juegos receptivos. Cuando ocurre `touchstart`, `mousedown` no se activa, y cuando ocurre `mousedown`, el simulador `mouseup` `mouseup` también se escuchará como `mouseup`, ya que el elemento de evento eliminado del mouse no puede activarse. Código fuente:[/src/components/keyboard/index.js](https://github.com/chvin/react-tetris/blob/master/src/components/keyboard/index.js);
	* El evento `cambio de visibilidad`, cuando la página está oculta\switch, el juego no continuará, volverá y continuará, el estado `foco` también se ha escrito en Redux. Entonces, cuando juegue con el teléfono y el teléfono tenga una "llamada", se guardará el progreso del juego; La PC abre el juego, no escucha ningún otro juego, que es un poco como el cambio de aplicación 'ios';
  * En el juego, el estado de la aplicación se guarda en el almacenamiento local, incluso si se cierra el navegador, se puede restaurar el estado del juego;
  * La unica imagen usada en el juego es ![image](https://img.alicdn.com/tps/TB1qq7kNXXXXXacXFXXXXXXXXXX-400-186.png), todo lo demás es CSS;
	* Máxima compabilidad con Chrome, Firefox, IE9 +, Edge, etc .;
  * Juego compatible con teléfono móvil, tableta, PC, etc .;
* Reglas：
  * Puedes especificar el nivel de inicio (diez niveles) y la velocidad (seis niveles) antes del inicio del juego;
  * 100 puntos por línea, 300 puntos por 2 líneas, 700 puntos por 3 líneas, 1500 puntos por 4 líneas;
  * La velocidad de caída de la caja aumenta con el número de líneas eliminadas (un nivel por cada 20 líneas);


----
## 5. Experiencia de desarrollo
* `shouldComponentUpdate` está escrito para todos los componentes de react, que causa una mejora significativa del rendimiento en el teléfono. Para aplicaciones grandes y medianas cuando se enfrentan a problemas de rendimiento, intente escribir su propio `shouldComponentUpdate`, lo más probable es que le ayude.
* `Stateless Functional Components`([Stateless Functional Components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.xjqnbfx4e)) no tiene hooks de ciclo de vida. Y porque todos los componentes necesitan escribir el ciclo de vida `shouldComponentUpdate`, no se usan.
* En el `webpack.config.js` `devServer` atributo está escrito `host: '0.0.0.0'`, pero puede ser utilizado en el desarrollo de cualquier otra ip, no limitado a localhost;
* Redux en el `store` no solo se conecta al método pasado a `container`, sino que también puede saltar fuera del componente, en otros documentos para hacer el control de flujo (dispatch), el código fuente:[/src/control/states.js](https://github.com/chvin/react-tetris/blob/master/src/control/states.js);
* Tratar con la persistencia en React + Redux es muy conveniente, siempre que el estado de redux del almacenamiento, los reductores lean en cada uno de los tiempos de inicialización.
* Al configurar `.eslintrc.js` y `webpack.config.js`, la prueba `ESLint` se integra en el proyecto. El uso de ESLint permite que la codificación se escriba según las especificaciones, controlando de manera efectiva la calidad del código. El código que no se ajusta a las especificaciones se puede encontrar a través del IDE y la consola en tiempo de desarrollo (o tiempo de compilación). referencia:[Guía de estilo de Airbnb React/JSX](https://github.com/airbnb/javascript/tree/master/react);


----
## 6. Summary
* As a React hand application, in the realization of the process found a small "box" or a lot of details can be optimized and polished, this time is a test of a front-end engineers and the skill of the time carefully.
* Optimization of the direction of both React itself, such as what state is stored by the Redux, which states to the state of the component like; and out of the framework of the product can have a lot of features to play, in order to meet your needs, these will be natural propulsion technology development of.
* An application from scratch, the function slowly accumulate bit by bit, it will build into a high-rise, do not fear it difficult to have the idea to knock on it. ^_^


----
## 7. Gráfica de flujo
![Flowchart](https://img.alicdn.com/tfs/TB1B6ODRXXXXXXHaFXXXXXXXXXX-1920-1080.png)

----
## 8. Desarrollo
### Instalación
```
npm install
```
### Run
```
npm start
```
El juego se ejecutará en el servidor [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
### Multilenguaje
En el [i18n.json](https://github.com/chvin/react-tetris/blob/master/i18n.json) está la configuración para el entorno multi-idioma. Puede cambiar el idioma pasando el parámetro de URL `lan` de esta manera: `https://chvin.github.io/react-tetris/?lan=en`
### Construcción
```
npm run build
```

Construirá la aplicación en la carpeta de `build` (docs).



