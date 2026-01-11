class prototype extends Phaser.Scene {
    constructor(){
        super("prototype");
    }
    
    preload(){
        this.load.setPath("./assets/");
        this.load.image("hero","tomato.png")
    }
    create(){
        this.heroObj = {
            sprite: this.physics.add.sprite(game.config.width / 2,game.config.height / 2,"hero").setScale(0.2),
            accelX: 150,
            accelY:150,
            shiftmode: ""

        }

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }
    update(){
        this.movementLogic();
    }



movementLogic() {
    if (this.paused) return;

    const body = this.heroObj.sprite.body;
    let moveX = 0;
    let moveY = 0;

    // ----- INPUT -----
    if (this.left.isDown)  { moveX -= 1; moveY = moveY; }
    if (this.right.isDown) { moveX += 1; moveY = moveY; }
    if (this.up.isDown)    { moveX = moveX; moveY -= 1; }
    if (this.down.isDown)  { moveX = moveX; moveY += 1; }

    // ----- NORMALIZE (prevents diagonal speed boost) -----
    if (moveX !== 0 || moveY !== 0) {
        const length = Math.hypot(moveX, moveY);
        moveX /= length;
        moveY /= length;
    }

    // ----- DASH -----
    let speed = this.heroObj.accelX;

    if (this.shift.isDown && this.heroObj.shiftmode === "dash") {
        speed = this.heroObj.dashSpeed;
    }

    // ----- APPLY VELOCITY -----
    body.setVelocity(
        moveX * speed,
        moveY * speed
    );

    // ----- SPRITE FLIP -----
    if (moveX < 0) this.heroObj.sprite.setFlip(true, false);
    else if (moveX > 0) this.heroObj.sprite.resetFlip();

    // ----- IDLE -----
    if (moveX === 0 && moveY === 0) {
        body.setVelocity(0, 0);

        if (this.heroObj.JuggleCooldownCntr <= 0) {
            this.heroObj.sprite.play('idle', true);
        }
    }
}

}