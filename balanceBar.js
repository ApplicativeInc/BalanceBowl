var X_SIZE = 800;
var Y_SIZE = 600;

var game = new Phaser.Game(X_SIZE, Y_SIZE, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('pad', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var pad;
var player;
var cursors;
var score = 0;
var scoreText;
var star;
var star_x;
var star_y;
var life = 3;
var lifeText;
var playButton;

function create() {
    cursors = game.input.keyboard.createCursorKeys();
    playButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.add.sprite(0, 0, 'sky');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();
    platforms.enableBody = true;
    pad = platforms.create(200, game.world.height - 64, 'pad');
    pad.body.immovable = true;

    player = createPlayer();

    stars = game.add.group();
    stars.enableBody = true;
    createNewStar(stars);

    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    lifeText = game.add.text(680, 16, 'Life: 3', {fontSize: '32px', fill: '#000'});
}

function collectStar(player, star) {
    star.kill();
    score += 10 * Math.abs(player.body.velocity.x);
    scoreText.text = 'Score: ' + score;
    createNewStar(stars);
}

function createNewStar(stars) {
    star_x = Math.random() * (pad.body.width - 40) + 220;
    star_y = game.world.height - 100;
    star = stars.create(star_x, star_y, 'star');
    star.body.gravity.y = 100;
}

function createPlayer() {
    var player = game.add.sprite(300, 150, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 600;
    player.checkWorldBounds = true;
    player.events.onOutOfBounds.add(resetPlayer, this);
    return player;
}

function resetPlayer(player) {
    player.reset(300, 150);
    life -= 1;
    lifeText.text = 'Life: ' + life;
    if (life == 1) {
        player.events.onOutOfBounds.removeAll(this);
        player.events.onOutOfBounds.add(gameOver, this);
    }
}

function gameOver() {
    game.add.text(300, 200, 'GAME OVER', {fontSize: '64px', fill: '#000'});
    game.add.text(220, 233, 'Press Space to Restart', {fontSize: '24px', fill: '#000'});
}

function update() {
    if (life == 0) {
        if (playButton.isDown) {
            life = 3;
            score = 0;
            resetPlayer();
        }
    } else {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        if (cursors.left.isDown) {
            player.body.velocity.x -= 30;
        } else if (cursors.right.isDown) {
            player.body.velocity.x += 30;
        }
        star.body.x = star_x + (Math.random() - 0.5) * 2;
        star.body.y = star_y + (Math.random() - 0.5) * 2;
    }
}
