class prototype extends Phaser.Scene {
    constructor(){
        super("prototype");
    }
    
    preload(){
        this.load.setPath("./assets/");
        this.load.image("hero","tomato.png")
        this.load.image("AA1","Auto1.png")
    }
    create(){
        this.heroObj = {
            sprite: this.physics.add.sprite(game.config.width / 2,game.config.height / 2,"hero").setScale(0.2),
            accelX: 150,
            accelY:150,
            shiftmode: ""

        }

        this.hitboxObj = {
            AA1Width: 40,
            AA1Height:120,
            AA2Width: 120,
            AA2Height:70,
            AA3Width: 40,
            AA3Height:40,
            spriteAA1: this.physics.add.sprite(100,100,null).setVisible(true).setImmovable(true),
            spriteAA2: this.physics.add.sprite(100,100,null).setVisible(true).setImmovable(true),
            spriteAA3: this.physics.add.sprite(100,100,null).setVisible(true).setImmovable(true),
        }
        this.hitboxObj.spriteAA1.setSize(this.hitboxObj.AA1Width,this.hitboxObj.AA1Height)
        this.hitboxObj.spriteAA2.setSize(this.hitboxObj.AA2Width,this.hitboxObj.AA2Height)
        this.hitboxObj.spriteAA3.setSize(this.hitboxObj.AA3Width,this.hitboxObj.AA3Height)

        console.log(this.hitboxObj.AA1Width);
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.spawnAttackHitbox(pointer,this.hitboxObj.spriteAA1,this.heroObj.sprite);
            }
        });

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


spawnAttackHitbox(pointer, hitbox, player) {
    // World-space mouse position
    const mouseX = pointer.worldX;
    const mouseY = pointer.worldY;

    // Direction vector
    let dirX = mouseX - player.x;
    let dirY = mouseY - player.y;

    const length = Math.hypot(dirX, dirY);
    if (length === 0) return;

    dirX /= length;
    dirY /= length;

    const range = 60;       // distance from player
    const lifetime = 120;  // ms

    // Position hitbox forward from player
    hitbox.setPosition(
        player.x + dirX * range,
        player.y + dirY * range
    );
    // Swap hitbox dimensions based on attack direction
    if (Math.abs(dirX) > Math.abs(dirY)) {
        // Horizontal attack
        hitbox.body.setSize(
            this.hitboxObj.AA1Height,
            this.hitboxObj.AA1Width,
            true
        );
    } else {
        // Vertical attack
        hitbox.body.setSize(
            this.hitboxObj.AA1Width,
            this.hitboxObj.AA1Height,
            true
        );
    }

    // Enable hitbox
    hitbox.setActive(true);
    hitbox.setVisible(true);

    // Disable after attack window
    this.time.delayedCall(lifetime, () => {
        hitbox.setActive(false);
        hitbox.setVisible(false);
    });
}


/* Register overlap ONCE
this.scene.physics.add.overlap(
        hitbox,
        this.scene.enemies,
        (hitbox, enemy) => {
            enemy.takeDamage(this.attackDamage);
        }
);
*/
}