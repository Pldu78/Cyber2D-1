import { Weapon, consts, Bullet, ObjectWithTransform } from "phaser3-weapon-plugin";
import { Pawn } from "../Pawns/Pawn";
import { CYBR_Bullet } from "./CYBR_Bullet";

export class CYBR_Weapon extends Phaser.GameObjects.Sprite
{
    protected timerReloadWeapon: Phaser.Time.TimerEvent;
    protected weapon: Weapon;

    /** X-position from where the bullets will spawn */
    protected muzzleX: number = 0;

    /** Y-position from where the bullets will spawn */
    protected muzzleY: number = 0;

    /** X-position of the grip. It defines the origin of the weapon */
    protected gripX: number = 0;

    /** Y-position of the grip. It defines the origin of the weapon */
    protected gripY: number = 0;

    protected damage: number = 0;
    
    protected bulletPerFire: number = 1;

    private owner: Pawn = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture?: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.setVisible(!!texture);

        this.weapon = new Weapon(scene, -1, "weapon_atlas", "bullet.png");
        this.weapon.trackSprite(this, this.muzzleX, this.muzzleY, false);
        this.bulletClass = CYBR_Bullet;
        this.fireAngle = 0;
        this.bulletKillType = consts.KillType.KILL_WORLD_BOUNDS;
        this.bulletGravity = new Phaser.Math.Vector2(0, -scene.physics.world.gravity.y); // So the bullets ignore the gravity
        this.timerReloadWeapon = scene.time.addEvent({}); // Create an empty timer to avoid null error

        this.on("fire", function (bullet: CYBR_Bullet/*, weapon: Weapon, speed: number*/){
            this.play("firing");
            this.owner.emit("shotsChanged", this.shots, this.fireLimit);
            this.owner.emit("fire", bullet);
        }, this);

        this.initAnimations(this.texture.key);
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    protected initAnimations(key: string): void
    {
        if (this.visible)
        {
            this.anims.create({
                key: "idle",
                frames: this.anims.generateFrameNumbers(key, { start: 0, end: 0 }),
                frameRate: 1,
                repeat: 0
            });

            this.anims.create({
                key: "firing",
                frames: this.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
                frameRate: 10,
                repeat: 0
            });

            this.play("idle");
        }
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public fire(from?: Phaser.Math.Vector2 | Phaser.GameObjects.Sprite | ObjectWithTransform, x?: number, y?: number, offsetX?: number, offsetY?: number) : Bullet[]
    {
        this.stopReloading();

        let bullets = [];

        for (let i = 0; i < this.bulletPerFire; ++i)
        {
            this.scene.time.delayedCall(i * 300, ()=> {
                const bullet = this.weapon.fire(from, x, y, offsetX, offsetY) as CYBR_Bullet;
                bullets.push(bullet);

                if (bullet)
                    bullet.damage = this.damage;
            }, null, this);
        }
        return bullets;
    }

    public stopReloading() : void
    {
        this.timerReloadWeapon.remove();
    }

    public reload() : void
    {
        if (this.shots == 0) // Full ammunition
        {
            this.timerReloadWeapon.remove();
            return;
        }
        else if (this.timerReloadWeapon.getRemaining() == 0) // The timer is inactive or it has been triggered 
        {
            this.timerReloadWeapon = this.scene.time.delayedCall(100, () => {
                this.decrementShots();
                if (this.shots > 0)
                    this.timerReloadWeapon = this.timerReloadWeapon.reset({delay: this.timerReloadWeapon.delay, repeat: 1, callbackScope: this, callback: this.reload });
                else
                    this.stopReloading();
            }, null, this);
        }
    }

    public decrementShots() : void
    {
        this.weapon.shots -= 1;
        this.owner.emit("shotsChanged", this.weapon.shots, this.weapon.fireLimit);
    }

    public setShots(shots: number) : void
    {
        this.weapon.shots = shots;
        this.owner.emit("shotsChanged", this.weapon.shots, this.weapon.fireLimit);
    }

    public get shots() : number
    {
        return this.weapon.shots;
    }

    public get bullets(): Phaser.GameObjects.Group
    {
        return this.weapon.bullets;
    }

    public stopFiring() : void
    {
        this.reload();
    }

    public setOwner(owner: Pawn) : void
    {
        this.owner = owner;
    }

    public setFlipX(value: boolean): this
    {
        this.weapon.trackSprite(this, value ? -this.muzzleX : this.muzzleX, this.muzzleY, false);
        return super.setFlipX(value);
    }

    public setGripPosition(x: number, y?: number): void
    {
        y = y || x;
        this.gripX = x;
        this.gripY = y;
    }

    public setPosition(x?: number, y?: number, z?: number, w?: number): this
    {
        const finalGripX = !this.flipX ? this.width-this.gripX : this.gripX;
        return super.setPosition(x - finalGripX, y - this.gripY, z, w);
    }

    public setMuzzlePosition(x: number, y?: number): void
    {
        y = y || x;
        this.muzzleX = x;
        this.muzzleY = y;
    }

    public setBulletPerFire(bulletPerFire: number): void
    {
        this.bulletPerFire = Math.max(bulletPerFire, 1);
    }

    public trackSprite(sprite: Phaser.GameObjects.Sprite | ObjectWithTransform, offsetX?: number, offsetY?: number, trackRotation?: boolean) : void
    {
        this.setPosition(sprite.x, sprite.y);
        this.weapon.trackSprite(sprite, offsetX, offsetY, trackRotation);
    }

    protected set bulletGravity(gravity: Phaser.Math.Vector2)
    {
        this.weapon.bulletGravity = gravity;
    }

    protected set bulletClass(bulletClass: typeof Bullet)
    {
        this.weapon.bulletClass = bulletClass;
    }

    public set fireAngle(fireAngle: number)
    {
        this.weapon.fireAngle = fireAngle;
    }

    protected set fireRate(fireRate: number)
    {
        this.weapon.fireRate = fireRate;
    }

    protected set bulletLifespan(bulletLifespan: number)
    {
        this.weapon.bulletLifespan = bulletLifespan;
    }

    protected set bulletSpeed(bulletSpeed: number)
    {
        this.weapon.bulletSpeed = bulletSpeed;
    }

    protected set bulletKillType(bulletKillType: number)
    {
        this.weapon.bulletKillType = bulletKillType;
    }

    protected set fireLimit(fireLimit: number)
    {
        this.weapon.fireLimit = fireLimit;
    }
}