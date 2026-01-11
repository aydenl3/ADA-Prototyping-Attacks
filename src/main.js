let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    fps: { forceSetTimeOut: true, target: 60 },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },   // ensure consistent timing across machines
    width: 1650,
    height: 900,
    scene: [prototype]
}


const game = new Phaser.Game(config);