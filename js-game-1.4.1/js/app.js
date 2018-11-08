'use strict';

class Vector {
/*Необходимо реализовать класс Vector, который 
позволит контролировать расположение объектов в 
двумерном пространстве и управлять их размером 
и перемещением.*/

/*Конструктор
Принимает два аргумента — координаты по оси X и по оси Y, числа, по умолчанию 0.

Создает объект со свойствами x и y, равными переданным в конструктор координатам.*/
constructor(x = 0, y = 0){
	this.x = x;
	this.y = y;
}

/*Метод plus
Принимает один аргумент — вектор, объект Vector.

Если передать аргумент другого типа, то бросает исключение 
Можно прибавлять к вектору только вектор типа Vector.

Создает и возвращает новый объект типа Vector, 
координаты которого будут суммой соответствующих 
координат суммируемых векторов.*/
plus(vector){
if(!(vector instanceof Vector)){
	throw new Error('Можно прибавлять к вектору только вектор типа Vector');
}
return new Vector(this.x + vector.x, this.y + vector.y);
}
/*Метод times
Принимает один аргумент — множитель, число.

Создает и возвращает новый объект типа Vector,
координаты которого будут равны соответствующим
координатам исходного вектора, умноженным на множитель.*/
times(factor){
	return new Vector(this.x * factor, this.y * factor);
}
}

class Actor {
/*Движущийся объект
Необходимо реализовать класс Actor, который позволит 
контролировать все движущиеся объекты на игровом поле 
и контролировать их пересечение.*/

/*Конструктор
Принимает три аргумента: расположение, объект типа Vector, 
размер, тоже объект типа Vector и скорость, тоже объект 
типа Vector. Все аргументы необязательные. По умолчанию 
создается объект с координатами 0:0, размером 1x1 и скоростью 0:0.

Если в качестве первого, второго или третьего аргумента 
передать не объект типа Vector, то конструктор должен 
бросить исключение.*/
constructor(pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)){
	if(!(pos instanceof Vector)||(size instanceof Vector)||(speed instanceof Vector)){
		throw new Error('pos, size или speed не является объектом класса Vector');
	}
	this.pos = pos;
	this.size = size;
	this.speed = speed;
}

act(){};

/*Свойства
Должно быть определено свойство pos, в котором размещен Vector.

Должно быть определено свойство size, в котором размещен Vector.

Должно быть определено свойство speed, в котором размещен Vector.

Должен быть определен метод act, который ничего не делает.

Должны быть определены свойства только для чтения left, top, right, 
bottom, в которых установлены границы объекта по осям X и Y с учетом 
его расположения и размера.*/

get left{
	return this.pos.x;
};
get top{
	return this.pos.y;
};
get right{
	return this.pos.x + this.size.x;
};
get bottom{
	return this.pos.y + this.size.y;
};
get type{
	return 'actor';
}
/*Должен иметь свойство type — строку со значением actor, только для чтения.*/

/*Метод isIntersect
Метод проверяет, пересекается ли текущий объект с переданным объектом, 
и если да, возвращает true, иначе – false.

Принимает один аргумент — движущийся объект типа Actor. Если передать 
аргумент другого типа или вызвать без аргументов, то метод бросает 
исключение.

Если передать в качестве аргумента этот же объект, то всегда 
возвращает false. Объект не пересекается сам с собой.

Объекты, имеющие смежные границы, не пересекаются.*/
isIntersect(actor){
	if(!(actor instanceof Actor)){
		throw new Error('Не передан объект типа Actor');
	}
	if(actor === this) {
		return false;
	}
	return this.left < actor.right && this top < actor.bottom && this.right > actor.left && this.bottom > actor.top;

}

}

class Level {
/*Игровое поле
Объекты класса Level реализуют схему игрового поля конкретного уровня, 
контролируют все движущиеся объекты на нём и реализуют логику игры. 
Уровень представляет собой координатное поле, имеющее фиксированную 
ширину и высоту.

Сетка уровня представляет собой координатное двумерное поле, 
представленное двумерным массивом. Первый массив — строки игрового 
поля; индекс этого массива соответствует координате Y на игровом поле. 
Элемент с индексом 5 соответствует строке с координатой Y, равной 5. 
Вложенные массивы, расположенные в элементах массива строк, 
представляют ячейки поля. Индекс этих массивов соответствует 
координате X. Например, элемент с индексом 10, соответствует ячейке 
с координатой X, равной 10.

Так как grid — это двумерный массив, представляющий сетку игрового 
поля, то, чтобы узнать, что находится в ячейке с координатами X=10 
и Y=5 (10:5), необходимо получить значение grid[5][10]. Если 
значение этого элемента равно undefined, то эта ячейка пуста. Иначе 
там будет строка, описывающая препятствие. Например, wall — для 
стены и lava — для лавы. Отсюда вытекает следующий факт: все 
препятствия имеют целочисленные размеры и координаты.

Конструктор
Принимает два аргумента: сетку игрового поля с препятствиями, массив 
массивов строк, и список движущихся объектов, массив объектов Actor. 
Оба аргумента необязательные.*/

constructor(grid = [], actors = []){
	this.grid = grid;
	this.actors = actors;
	this.player = actors.find(elem => elem.type === 'player');
	this.height = this.grid.length;
	this.width = Math.max(0, ...(this.grid.map(item => item.length)));
	this.status = null;
	this.finishDelay = 1;
}

/*Свойства
Имеет свойство grid — сетку игрового поля. Двумерный массив строк.

Имеет свойство actors — список движущихся объектов игрового поля, 
массив объектов Actor.

Имеет свойство player — движущийся объект, тип которого — свойство 
type — равно player. Игорок передаётся с остальными движущимися объектами.

Имеет свойство height — высоту игрового поля, равное числу строк 
в сетке из первого аргумента.

Имеет свойство width — ширину игрового поля, равное числу ячеек в 
строке сетки из первого аргумента. При этом, если в разных строках 
разное число ячеек, то width будет равно максимальному количеству 
ячеек в строке.

Имеет свойство status — состояние прохождения уровня, равное null 
после создания.

Имеет свойство finishDelay — таймаут после окончания игры, равен 1 
после создания. Необходим, чтобы после выигрыша или проигрыша игра 
не завершалась мгновенно.

Метод isFinished
Определяет, завершен ли уровень. Не принимает аргументов.

Возвращает true, если свойство status не равно null и finishDelay 
меньше нуля.*/

isFinished(){
	return this.status !== null && this.finishDelay < 0
}

/*Метод actorAt
Определяет, расположен ли какой-то другой движущийся объект в 
переданной позиции, и если да, вернёт этот объект.

Принимает один аргумент — движущийся объект, Actor. Если не передать 
аргумент или передать не объект Actor, метод должен бросить исключение.

Возвращает undefined, если переданный движущийся объект не пересекается 
ни с одним объектом на игровом поле.

Возвращает объект Actor, если переданный объект пересекается с ним на 
игровом поле. Если пересекается с несколькими объектами, вернет первый.*/

actorAt(actor){
	if(actor === undefined || !(actor instanceof Actor )){
		throw new Error('Не передан объект Actor');
	}
	return this.actors.find((curActor) => actor.isIntersect(curActor));
}

/*Метод obstacleAt
Аналогично методу actorAt определяет, нет ли препятствия в указанном 
месте. Также этот метод контролирует выход объекта за границы игрового 
поля.

Так как движущиеся объекты не могут двигаться сквозь стены, то метод 
принимает два аргумента: положение, куда собираемся передвинуть объект, 
вектор Vector, и размер этого объекта, тоже вектор Vector. Если первым 
и вторым аргументом передать не Vector, то метод бросает исключение.

Вернет строку, соответствующую препятствию из сетки игрового поля, 
пересекающему область, описанную двумя переданными векторами, либо 
undefined, если в этой области препятствий нет.

Если описанная двумя векторами область выходит за пределы игрового 
поля, то метод вернет строку lava, если область выступает снизу. И вернет 
wall в остальных случаях. Будем считать, что игровое поле слева, сверху и 
справа огорожено стеной и снизу у него смертельная лава.*/

obstacleAt(pos, size){
	if(!(pos instanceof Vector)&&(size instanceof Vector)){
		throw new Error('pos и size не являются объектами класса Vector');
	}

}


/*Метод removeActor
Метод удаляет переданный объект с игрового поля. Если такого объекта на 
игровом поле нет, не делает ничего.

Принимает один аргумент, объект Actor. Находит и удаляет его.

Метод noMoreActors
Определяет, остались ли еще объекты переданного типа на игровом поле.

Принимает один аргумент — тип движущегося объекта, строка.

Возвращает true, если на игровом поле нет объектов этого типа (свойство type). 
Иначе возвращает false.

Метод playerTouched
Один из ключевых методов, определяющий логику игры. Меняет состояние игрового 
поля при касании игроком каких-либо объектов или препятствий.

Если состояние игры уже отлично от null, то не делаем ничего, 
игра уже и так завершилась.

Принимает два аргумента. Тип препятствия или объекта, строка. Движущийся 
объект, которого коснулся игрок, — объект типа Actor, необязательный аргумент.

Если первым аргументом передать строку lava или fireball, то меняем статус 
игры на lost (свойство status). Игрок проигрывает при касании лавы или 
шаровой молнии.

Если первым аргументом передать строку coin, а вторым — объект монеты, 
то необходимо удалить эту монету с игрового поля. Если при этом на игровом 
поле не осталось больше монет, то меняем статус игры на won. Игрок побеждает, 
когда собирает все монеты на уровне. Отсюда вытекает факт, что уровень 
без монет пройти невозможно.*/
}

function loadLevels() {
  return new Promise((done, fail) => {
    const xhr = new XMLHttpRequest();
    let url = './levels.json';
    if (location.hostname !== 'localhost') {
      url = 'https://neto-api.herokuapp.com/js/diplom/levels.json';
    }
    xhr.open('GET', url);
    xhr.addEventListener('error', e => fail(xhr));
    xhr.addEventListener('load', e => {
      if (xhr.status !== 200) {
        fail(xhr);
      }
      done(xhr.responseText);
    });
    xhr.send();
  });
}

const scale = 30;
const maxStep = 0.05;
const wobbleSpeed = 8, wobbleDist = 0.07;
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

class DOMDisplay {
  constructor(parent, level) {
    this.wrap = parent.appendChild(elt("div", "game"));
    this.wrap.setAttribute('autofocus', true)
    this.level = level;

    this.actorMap = new Map();
    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    this.drawFrame();
  }

  drawBackground() {
    var table = elt("table", "background");
    table.style.width = this.level.width * scale + "px";
    this.level.grid.forEach(function(row) {
      var rowElt = table.appendChild(elt("tr"));
      rowElt.style.height = scale + "px";
      row.forEach(function(type) {
        rowElt.appendChild(elt("td", type));
      });
    });
    return table;
  }

  drawActor(actor) {
    return elt('div', `actor ${actor.type}`);
  }

  updateActor(actor, rect) {
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  }

  drawActors() {
    var wrap = elt('div');
    this.level.actors.forEach(actor => {
      const rect = wrap.appendChild(this.drawActor(actor));
      this.actorMap.set(actor, rect);
    });
    return wrap;
  }

  updateActors() {
    for (const [actor, rect] of this.actorMap) {
      if (this.level.actors.includes(actor)) {
        this.updateActor(actor, rect);
      } else {
        this.actorMap.delete(actor);
        rect.parentElement.removeChild(rect);
      }
    }
  }

  drawFrame() {
    this.updateActors();

    this.wrap.className = "game " + (this.level.status || "");
    this.scrollPlayerIntoView();
  }

  scrollPlayerIntoView() {
    var width = this.wrap.clientWidth;
    var height = this.wrap.clientHeight;
    var margin = width / 3;

    // The viewport
    var left = this.wrap.scrollLeft, right = left + width;
    var top = this.wrap.scrollTop, bottom = top + height;

    var player = this.level.player;
    if (!player) {
      return;
    }
    var center = player.pos.plus(player.size.times(0.5))
                   .times(scale);

    if (center.x < left + margin)
      this.wrap.scrollLeft = center.x - margin;
    else if (center.x > right - margin)
      this.wrap.scrollLeft = center.x + margin - width;
    if (center.y < top + margin)
      this.wrap.scrollTop = center.y - margin;
    else if (center.y > bottom - margin)
      this.wrap.scrollTop = center.y + margin - height;
  }

  clear() {
    this.wrap.parentNode.removeChild(this.wrap);
  }
}

var arrowCodes = {37: "left", 38: "up", 39: "right"};

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display) {
  initGameObjects();
  return new Promise(done => {
    var arrows = trackKeys(arrowCodes);
    var display = new Display(document.body, level);
    runAnimation(step => {
      level.act(step, arrows);
      display.drawFrame(step);
      if (level.isFinished()) {
        display.clear();
        done(level.status);
        return false;
      }
    });
  });
}

function initGameObjects() {
  if (initGameObjects.isInit) {
    return;
  }

  initGameObjects.isInit = true;

  Level.prototype.act = function(step, keys) {
    if (this.status !== null) {
      this.finishDelay -= step;
    }

    while (step > 0) {
      var thisStep = Math.min(step, maxStep);
      this.actors.forEach(actor => {
        actor.act(thisStep, this, keys);
      });

      if (this.status === 'lost') {
        this.player.pos.y += thisStep;
        this.player.size.y -= thisStep;
      }

      step -= thisStep;
    }
  };

  Player.prototype.handleObstacle = function (obstacle) {
    if (this.wontJump) {
      this.speed.y = -jumpSpeed;
    } else {
      this.speed.y = 0;
    }
  };

  Player.prototype.move = function (motion, level) {
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
      level.playerTouched(obstacle);
      this.handleObstacle(obstacle);
    } else {
      this.pos = newPos;
    }
  };

  Player.prototype.moveX = function (step, level, keys) {
    this.speed.x = 0;
    if (keys.left) this.speed.x -= playerXSpeed;
    if (keys.right) this.speed.x += playerXSpeed;

    var motion = new Vector(this.speed.x, 0).times(step);
    this.move(motion, level);
  };

  Player.prototype.moveY = function (step, level, keys) {
    this.speed.y += step * gravity;
    this.wontJump = keys.up && this.speed.y > 0;

    var motion = new Vector(0, this.speed.y).times(step);
    this.move(motion, level);
  };

  Player.prototype.act = function (step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    var otherActor = level.actorAt(this);
    if (otherActor) {
      level.playerTouched(otherActor.type, otherActor);
    }
  };
}

function runGame(plans, Parser, Display) {
  return new Promise(done => {
    function startLevel(n) {
      runLevel(Parser.parse(plans[n]), Display)
        .then(status => {
          if (status == "lost") {
            startLevel(n);
          } else if (n < plans.length - 1) {
            startLevel(n + 1);
          } else {
            done();
          }
        });
    }
    startLevel(0);
  });
}

function rand(max = 10, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
