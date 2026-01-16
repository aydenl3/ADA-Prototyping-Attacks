class prototype extends Phaser.Scene {
    constructor(){
        super("prototype");
    }
    
    preload(){
        this.load.setPath("./assets/");
        this.load.image("hero","tomato.png")
        this.load.image("dummy","crabby.png")
        this.load.image("AA1","Auto1.png")
        this.load.image("AA2","Auto2.png")
        this.load.image("AA3","Auto3.png")
        
    }
    create(){
        this.textures.generate('blank', {
            data: ['.'],
            pixelWidth: 1,
            pixelHeight: 1
        });

        this.paused = false;
        this.heroObj = {
            sprite: this.physics.add.sprite(game.config.width / 2,game.config.height / 2,"hero").setScale(0.2),
            accelX: 150,
            accelY:150,
                // DASH
            dashSpeed: 600,
            dashDuration: 120,     // ms
            dashCooldown: 400,     // ms
            isDashing: false,
            canDash: true,

    lastMoveX: 1,
    lastMoveY: 0
        }

        this.dummyObj = {
            sprite: this.physics.add.sprite(game.config.width / 2,game.config.height / 2,"dummy").setScale(0.05),
            accelX: 150,
            accelY:150,
            shiftmode: ""
        }
        this.dummyObj.sprite.setDrag(800, 800);
        //this.dummyObj.sprite.setMaxVelocity(200, 200);



//HITBOXES// ----------------------------------------------------------------------------------
        this.hitboxCA1 = {
            Width: 5,
            Height:5,
            Displace:120,
            Lifetime:320,
            Damage: 10,
            sprite: this.physics.add.sprite(100,100,"blank").setVisible(true).setImmovable(true).setScale(6),
        }
        this.hitboxCA1.sprite.setSize(this.hitboxCA1.Width,this.hitboxCA1.Height);

        this.hitboxAA1 = {
            Width: 5,
            Height:20,
            Displace:80,
            Lifetime:320,
            Damage: 4,
            sprite: this.physics.add.sprite(100,100,"AA1").setVisible(true).setImmovable(true).setScale(6),
            Crit:this.hitboxCA1
        }
        this.hitboxAA1.sprite.setSize(this.hitboxAA1.Width,this.hitboxAA1.Height);

        this.hitboxCA2 = {
            Width: 14,
            Height:5,
            Displace:100,
            Lifetime:320,
            Damage: 10,
            sprite: this.physics.add.sprite(100,100,"blank").setVisible(true).setImmovable(true).setScale(6),
        }
        this.hitboxCA2.sprite.setSize(this.hitboxCA2.Width,this.hitboxCA2.Height);

        this.hitboxAA2 = {
            Width: 14,
            Height:12,
            Displace:80,
            Lifetime:320,
            Damage: 4,
            sprite: this.physics.add.sprite(100,100,"AA2").setVisible(true).setImmovable(true).setScale(6),
            Crit:this.hitboxCA2
        }
        this.hitboxAA2.sprite.setSize(this.hitboxAA2.Width,this.hitboxAA2.Height);

        this.hitboxAA3 = {
            Width: 9,
            Height:9,
            Displace:100,
            Lifetime:320,
            Damage: 4,
            sprite: this.physics.add.sprite(100,100,"AA3").setVisible(true).setImmovable(true).setScale(6),
        }
        this.hitboxAA3.sprite.setSize(this.hitboxAA3.Width,this.hitboxAA3.Height)



        this.hitboxList = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.hitboxList.add(this.hitboxAA1.sprite);
        this.hitboxList.add(this.hitboxCA1.sprite);
        this.hitboxList.add(this.hitboxAA2.sprite);
        this.hitboxList.add(this.hitboxCA2.sprite);
        this.hitboxList.add(this.hitboxAA3.sprite);
        console.log(this.hitboxList)
        //----------------------------------------------------------------------------------------------


//INPUT KEYS//
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.Q = this.input.keyboard.addKey("Q");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
//AUTO ATTACK//
        this.attackChainList = [
            this.hitboxAA1,
            this.hitboxAA2,
            this.hitboxAA3
        ]
        this.AAcounter = 0;
        this.AAcooldown = 0;
        this.AAcooldownCntr = 40;
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && !this.paused && !this.heroObj.isDashing && this.AAcooldown <= 0) {
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
//COLLISION//
        this.physics.add.overlap(
            this.hitboxAA1.sprite,
            this.dummyObj.sprite,
            (hitbox, enemy) => {
                this.dealDamage(hitbox,enemy,this.hitboxAA1.Damage);
            }
        );
        this.physics.add.overlap(
            this.hitboxCA1.sprite,
            this.dummyObj.sprite,
            (hitbox, enemy) => {
                this.dealDamage(hitbox,enemy,this.hitboxCA1.Damage);
            }
        );
        this.physics.add.overlap(
            this.hitboxAA2.sprite,
            this.dummyObj.sprite,
            (hitbox, enemy) => {
                this.dealDamage(hitbox,enemy,this.hitboxAA2.Damage);
            }
        );
        this.physics.add.overlap(
            this.hitboxCA2.sprite,
            this.dummyObj.sprite,
            (hitbox, enemy) => {
                this.dealDamage(hitbox,enemy,this.hitboxCA2.Damage);
            }
        );
        this.physics.add.overlap(
            this.hitboxAA3.sprite,
            this.dummyObj.sprite,
            (hitbox, enemy) => {
                this.dealDamage(hitbox,enemy,this.hitboxAA3.Damage);
            }
        );
        this.physics.add.collider(this.heroObj.sprite, this.dummyObj.sprite);
    }
update(){
    this.movementLogic();
    this.decrementCounters();
}

dealDamage(hitbox, enemy,damage) {
    if (!hitbox.body.enable) return;
    hitbox.body.enable = false;
    console.log('Damage:', damage);
}


decrementCounters(){
    this.AAcooldown -=1;
}


movementLogic() {
    if (this.heroObj.isDashing) return;
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
        this.heroObj.lastMoveX = moveX;
        this.heroObj.lastMoveY = moveY;
        const length = Math.hypot(moveX, moveY);
        moveX /= length;
        moveY /= length;
    }

    // ----- DASH -----
    let speed = this.heroObj.accelX;
    if (
        Phaser.Input.Keyboard.JustDown(this.shift) &&
        this.heroObj.canDash &&
        !this.paused
    ) {
    this.startDash();
    return;
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

startDash() {
    const body = this.heroObj.sprite.body;

    this.heroObj.isDashing = true;
    this.heroObj.canDash = false;

    const dx = this.heroObj.lastMoveX;
    const dy = this.heroObj.lastMoveY;

    body.setVelocity(
        dx * this.heroObj.dashSpeed,
        dy * this.heroObj.dashSpeed
    );

    // End dash
    this.time.delayedCall(this.heroObj.dashDuration, () => {
        this.heroObj.isDashing = false;
        body.setVelocity(0, 0);
    });

    // Cooldown
    this.time.delayedCall(this.heroObj.dashCooldown, () => {
        this.heroObj.canDash = true;
    });
}


spawnAttackHitbox(pointer, hitboxdata, player) {
    //console.log(hitboxdata.Crit)
    if(hitboxdata.Crit != null){
        this.spawnAttackHitbox(pointer,hitboxdata.Crit,player);
    }
    //console.log(hitboxdata.Width)
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
    hitbox.body.enable = true;
    hitbox.setVisible(true);
    hitbox.rotation = Math.atan2(dirY, dirX);

    this.time.delayedCall(hitboxdata.Lifetime/2, () => {
        this.paused = false;
    });
    // Disable after attack window
    this.time.delayedCall(hitboxdata.Lifetime, () => {
        hitbox.body.enable = false;
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