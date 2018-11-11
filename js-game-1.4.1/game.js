'use strict';

class Vector {
	constructor(x = 0, y = 0) {
	this.x = x;
	this.y = y;
	}

	plus(vector) {
		if (!(vector instanceof Vector)) {
			throw new Error('Можно прибавлять к вектору только вектор типа Vector');
		}
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	times(factor) {
		return new Vector(this.x * factor, this.y * factor);
	}
}

class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if (!(pos instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
      throw new Error('pos, size или speed не является объектом класса Vector');
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
  }

	act() {};

	get left() {
		return this.pos.x;
	};

	get top() {
		return this.pos.y;
	};

	get right() {
		return this.pos.x + this.size.x;
	};

	get bottom() {
		return this.pos.y + this.size.y;
	};

	get type() {
		return 'actor';
	}

	isIntersect(actor) {
		if (!(actor instanceof Actor)) {
		 throw new Error('Не передан объект типа Actor');
		}
		if (actor === this) {
			return false;
		}
		return this.left < actor.right && this.top < actor.bottom && this.right > actor.left && this.bottom > actor.top;
	}
}

class Level {
	constructor(grid = [], actors = []) {
		this.grid = grid;
		this.actors = actors;
		this.player = actors.find(elem => elem.type === 'player');
		this.height = this.grid.length;
		this.width = Math.max(0, ...(this.grid.map(item => item.length)));
		this.status = null;
		this.finishDelay = 1;
	}

	isFinished() {
		return this.status !== null && this.finishDelay < 0;
	}

	actorAt(actor) {
		if (actor === undefined || !(actor instanceof Actor)) {
			throw new Error('Не передан объект Actor');
		}
		return this.actors.find((curActor) => actor.isIntersect(curActor));
	}

	obstacleAt(pos, size) {
		if (!(pos instanceof Vector) || !(size instanceof Vector)) {
			throw new Error('pos и size не являются объектами класса Vector');
		}

		const leftBorder = Math.floor(pos.x);
		const rightBorder = Math.ceil(pos.x + size.x);
		const topBorder = Math.floor(pos.y);
		const bottomBorder = Math.ceil(pos.y + size.y);

		if ((leftBorder < 0) || (rightBorder > this.width) || (topBorder < 0)) {
			return 'wall';
		}
		if (bottomBorder > this.height) {
			return 'lava';
		}

		for (let x = leftBorder; x < rightBorder; x++) {
			for (let y = topBorder; y < bottomBorder; y++) {
				if ((this.grid[y][x] === 'wall') || (this.grid[y][x] === 'lava')) {
					return this.grid[y][x];
				}
			}
		}
	}

	removeActor(actor) {
    const result = this.actors.indexOf(actor);
    if (result !== -1) {
      this.actors.splice(result, 1);
    }
  }

	noMoreActors(type) {
		return !this.actors.some((actor) => actor.type === type);
	}

	playerTouched(touch, actor) {
		if (['lava', 'fireball'].some((block) => block === touch)) {
			return this.status = 'lost';
		}
		if (touch === 'coin' && actor.type === 'coin') {
			this.removeActor(actor);
			if (this.noMoreActors('coin')) {
				return this.status = 'won';
			}
		}
	}
}

class LevelParser {
	constructor(book = {}) {
		this.book = book;
		this.obstacleBook = {
			'x': 'wall',
			'!': 'lava',
		};
	}

	actorFromSymbol(symbol) {
		return this.book[symbol];
	}

	obstacleFromSymbol(symbol) {
		return this.obstacleBook[symbol];
	}

	createGrid(grid) {
		return grid.map(line => line.split('').map(symbol => this.obstacleFromSymbol(symbol)));
	}

	createActors(grid) {
		const actors = [];
		grid.forEach((line, lineIndex) => {
			line.split('').forEach((symbol, symbolIndex) => {
				const actorClass = this.actorFromSymbol(symbol);
				if (typeof actorClass === 'function') {
					const actor = new actorClass(new Vector(symbolIndex, lineIndex));
					if (actor instanceof Actor) {
						actors.push(actor);
					}
				}
			});
		});
		return actors;
	}

	parse(grid) {
		return new Level(this.createGrid(grid), this.createActors(grid));
	}
}

class Fireball extends Actor {
	constructor(pos, speed) {
		let size = new Vector(1, 1);
		super (pos, size, speed);
	}

	get type() {
		return 'fireball';
	}

	getNextPosition(time = 1) {
		return this.pos.plus(this.speed.times(time));
	}

	handleObstacle() {
		this.speed = this.speed.times(-1);
	}

	act(time, level) {
		const nextPosition = this.getNextPosition(time);
		if (level.obstacleAt(nextPosition, this.size)) {
			this.handleObstacle();
		} else {
			this.pos = nextPosition;
		}
	}
}

class HorizontalFireball extends Fireball {
	constructor(pos) {
		let speed = new Vector(2, 0);
		super(pos, speed);
	}
}

class VerticalFireball extends Fireball {
	constructor(pos) {
		let speed = new Vector(0, 2);
		super(pos, speed);
	}
}

class FireRain extends Fireball {
	constructor(pos) {
		let speed = new Vector(0, 3);
		super(pos, speed);
		this.startPosition = pos;
	}

	handleObstacle() {
		this.pos = this.startPosition;
	}
}

class Coin extends Actor {
	constructor(pos = new Vector(0, 0)) {
		super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
		this.basePos = this.pos;
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.spring = Math.random() * 2 * Math.PI;
	}

	get type() {
		return 'coin';
	}

	updateSpring(time = 1) {
		this.spring += this.springSpeed * time;
	}

	getSpringVector() {
		return new Vector(0, Math.sin(this.spring) * this.springDist);
	}

	getNextPosition(time = 1) {
		this.updateSpring(time);
		return this.basePos.plus(this.getSpringVector());
	}

	act(time) {
		this.pos = this.getNextPosition(time);
	}
}

class Player extends Actor {
	constructor(pos = new Vector(0, 0)) {
		super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0));
		}

	get type() {
		return 'player';
	}
}



const actors = {
  '@': Player,
  'o': Coin,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'v': FireRain
};

const parser = new LevelParser(actors);

loadLevels()
  .then(schemas => {
    return runGame(JSON.parse(schemas), parser, DOMDisplay).then(() => alert('Вы выиграли приз!'));
  });