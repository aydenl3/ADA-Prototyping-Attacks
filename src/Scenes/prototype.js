class prototype extends Phaser.Scene {
    constructor(){
        super("prototype");
    }
    
    preload(){
        this.load.setPath("./assets/");
        this.load.image("hero","tomato.png")
        this.load.image("AA1","Auto1.png")
        this.load.image("AA2","Auto2.png")
        this.load.image("AA3","Auto3.png")
    }
    create(){
        this.paused = false;
        this.heroObj = {
            sprite: this.physics.add.sprite(game.config.width / 2,game.config.height / 2,"hero").setScale(0.2),
            accelX: 150,
            accelY:150,
            shiftmode: ""
        }
        //----------------------------------------------------------------------------------
        this.hitboxCA1 = {
            Width: 5,
            Height:5,
            Displace:120,
            Lifetime:320,
            sprite: this.physics.add.sprite(100,100,null).setVisible(true).setImmovable(true).setScale(6),
        }
        this.hitboxCA1.sprite.setSize(this.hitboxCA1.Width,this.hitboxCA1.Height);

        this.hitboxAA1 = {
            Width: 5,
            Height:20,
            Displace:80,
            Lifetime:320,
            sprite: this.physics.add.sprite(100,100,"AA1").setVisible(true).setImmovable(true).setScale(6),
            Crit:this.hitboxCA1
        }
        this.hitboxAA1.sprite.setSize(this.hitboxAA1.Width,this.hitboxAA1.Height);
       
        this.hitboxCA2 = {
            Width: 14,
            Height:5,
            Displace:100,
            Lifetime:320,
            sprite: this.physics.add.sprite(100,100,null).setVisible(true).setImmovable(true).setScale(6),
        }
        this.hitboxCA2.sprite.setSize(this.hitboxCA2.Width,this.hitboxCA2.Height);

        this.hitboxAA2 = {
            Width: 14,
            Height:12,
            Displace:80,
            Lifetime:320,
            sprite: this.physics.add.sprite(100,100,"AA2").setVisible(true).setImmovable(true).setScale(6),
            Crit:this.hitboxCA2
        }
        this.hitboxAA2.sprite.setSize(this.hitboxAA2.Width,this.hitboxAA2.Height);

        this.hitboxAA3 = {
            Width: 9,
            Height:9,
            Displace:100,
            Lifetime:320,
            sprite: this.physics.add.sprite(100,100,"AA3").setVisible(true).setImmovable(true).setScale(6),
        }
        this.hitboxAA3.sprite.setSize(this.hitboxAA3.Width,this.hitboxAA3.Height)
        //----------------------------------------------------------------------------------------------
        this.hitboxList = [
            this.hitboxAA1,
            this.hitboxAA2,
            this.hitboxAA3,
            this.hitboxCA1,
            this.hitboxCA2
        ];

        this.attackChainList = [
            this.hitboxAA1,
            this.hitboxAA2,
            this.hitboxAA3
        ]

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.AAcounter = 0;
        this.AAcooldown = 0;
        this.AAcooldownCntr = 40;
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && !this.paused && this.AAcooldown <= 0) {
                if(this.AAcooldown <= -40){
                    this.AAcounter = 0;
                }
                this.spawnAttackHitbox(pointer,this.attackChainList[this.AAcounter],this.heroObj.sprite);
                this.AAcounter++;
                if(this.AAcounter >2){
                    this.AAcounter = 0;
                }
                this.AAcooldown = this.AAcooldownCntr;
            }
        });

    }
    update(){
        this.movementLogic();
        this.decrementCounters();
    }


decrementCounters(){
    this.AAcooldown -=1;
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


spawnAttackHitbox(pointer, hitboxdata, player) {
    console.log(hitboxdata.Crit)
    if(hitboxdata.Crit != null){
        this.spawnAttackHitbox(pointer,hitboxdata.Crit,player);
    }
    console.log(hitboxdata.Width)
    let hitbox = hitboxdata.sprite
    // World-space mouse position
        this.paused = true;
         player.body.setVelocity(0, 0);
    const mouseX = pointer.worldX;
    const mouseY = pointer.worldY;

    // Direction vector
    let dirX = mouseX - player.x;
    let dirY = mouseY - player.y;

    const length = Math.hypot(dirX, dirY);
    if (length === 0) return;

    dirX /= length;
    dirY /= length;

    // Position hitbox forward from player
    hitbox.setPosition(
        player.x + dirX * hitboxdata.Displace,
        player.y + dirY * hitboxdata.Displace
    );
    // Swap hitbox dimensions based on attack direction
    if (Math.abs(dirX) > Math.abs(dirY)) {
        // Horizontal attack
        hitbox.body.setSize(
            hitboxdata.Height,
            hitboxdata.Width,
            true
        );
    } else {
        // Vertical attack
        hitbox.body.setSize(
            hitboxdata.Width,
            hitboxdata.Height,
            true
        );
    }

    // Enable hitbox
    hitbox.setActive(true);
    hitbox.setVisible(true);
    hitbox.rotation = Math.atan2(dirY, dirX);

    // Disable after attack window
    this.time.delayedCall(hitboxdata.Lifetime, () => {
        hitbox.setActive(false);
        hitbox.setVisible(false);
        this.paused = false;
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