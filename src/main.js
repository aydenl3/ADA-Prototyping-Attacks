let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: false
    },
    fps: { forceSetTimeOut: true, target: 60 },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },   // ensure consistent timing across machines
    width: 800,
    height: 800,
    scene: [prototype]
}


const game = new Phaser.Game(config);