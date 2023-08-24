var Ball = /** @class */ (function () {
    function Ball(ctx, canvaWidth, canvaHeight) {
        this._ctx = ctx;
        this._x = canvaWidth / 2;
        this._y = canvaHeight / 2;
        this._radius = 10;
        this._stopTop = this._radius;
        this._stopBottom = canvaHeight - this._radius;
        this._stopLeft = this._radius;
        this._stopRight = 80;
        this._speed = 0.1;
        this._dx = -0.5;
        this._dy = 0.0;
        this.draw();
    }
    Ball.prototype.draw = function () {
        this._ctx.fillStyle = 'red';
        this._ctx.fillRect(this._x, this._y, this._radius, this._radius);
    };
    Ball.prototype.move = function (deltaTime, racket) {
        this._x += this._dx * deltaTime * this._speed;
        this._y += this._dy * deltaTime * this._speed;
        // walls
        if (this._y > this._stopBottom) {
            this._dy = -this._dy;
            this._y = this._stopBottom;
        }
        if (this._y < this._stopTop) {
            this._dy = -this._dy;
            this._y = this._stopTop;
        }
        if (this._x > this._stopRight) {
            this._dx = -this._dx;
            this._x = this._stopRight;
        }
        if (this._x < this._stopLeft) {
            this._dx = -this._dx;
            this._x = this._stopLeft;
        }
        var racketTop = racket.ymin - this._radius;
        var racketBot = racket.ymax;
        var racketLef = racket.xmin - this._radius;
        var racketRig = racket.xmax;
        // racket
        if (racketLef < this._x &&
            this._x < racketRig &&
            racketTop < this._y &&
            this._y < racketBot) {
            // detect face
            var distance = [];
            distance[0] = this._y - racketTop;
            distance[1] = racketRig - this._x;
            distance[2] = racketBot - this._y;
            distance[3] = this._x - racketLef;
            var smallest = Math.min.apply(Math, distance);
            var indexSmallest = distance.indexOf(smallest);
            // set the direction
            switch (indexSmallest) {
                case 1: // top
                    this._dy = -Math.abs(this._dy);
                    break;
                case 2: // right
                    this._dx = Math.abs(this._dx);
                    break;
                case 3: // bottom
                    this._dy = Math.abs(this._dy);
                    break;
                case 4: // left
                    this._dx = -Math.abs(this._dx);
                    break;
            }
            if (indexSmallest % 2) {
                this._dx = -this._dx;
            }
            else
                this._dy = -this._dy;
        }
    };
    return Ball;
}());
var Racket = /** @class */ (function () {
    function Racket(ctx) {
        this._speed = 0.1;
        this._ctx = ctx;
        this._x = 20;
        this._y = 155;
        this._width = 10;
        this._heigth = 50;
        this._stopTop = 0;
        this._stopBottom = 300 - this._heigth;
        this._state = 'stand';
        this.draw();
    }
    Racket.prototype.draw = function () {
        this._ctx.fillStyle = 'green';
        this._ctx.fillRect(this._x, this._y, this._width, this._heigth);
    };
    Racket.prototype.rise = function () {
        this._state = 'rising';
    };
    Racket.prototype.downhill = function () {
        this._state = 'downhilling';
    };
    Racket.prototype.stand = function () {
        this._state = 'stand';
    };
    Racket.prototype.location = function () {
        return {
            xmin: this._x,
            xmax: this._x + this._width,
            ymin: this._y,
            ymax: this._y + this._heigth,
        };
    };
    Racket.prototype.move = function (deltaTime) {
        switch (this._state) {
            case 'rising':
                this._y -= this._speed * deltaTime;
                break;
            case 'downhilling':
                this._y += this._speed * deltaTime;
                break;
        }
        if (this._y > this._stopBottom)
            this._y = this._stopBottom;
        if (this._y < this._stopTop)
            this._y = this._stopTop;
    };
    return Racket;
}());
var BoardGame = /** @class */ (function () {
    function BoardGame() {
        var canvas = document.getElementById('boardGame');
        var ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.ctx = ctx;
        this.ball = new Ball(this.ctx, this.canvas.width, this.canvas.height);
        this.racket = new Racket(this.ctx);
        this._lastTime = 0;
        this.initInput();
        this.loop(0);
    }
    BoardGame.prototype.drawAll = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw();
        this.racket.draw();
    };
    BoardGame.prototype.initInput = function () {
        var _this = this;
        window.addEventListener('keydown', function (e) {
            if (e.key === 'l')
                _this.racket.rise();
            if (e.key === 'k')
                _this.racket.downhill();
        });
        window.addEventListener('keyup', function (e) {
            if (e.key === 'l')
                _this.racket.stand();
            if (e.key === 'k')
                _this.racket.stand();
        });
    };
    BoardGame.prototype.loop = function (time) {
        var deltaTime = time - this._lastTime;
        this.racket.move(deltaTime);
        this.ball.move(deltaTime, this.racket.location());
        this._lastTime = time;
        this.drawAll();
        window.requestAnimationFrame(this.loop.bind(this));
    };
    return BoardGame;
}());
new BoardGame();
