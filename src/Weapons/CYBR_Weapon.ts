import { Weapon, consts, Bullet, ObjectWithTransform } from "phaser3-weapon-plugin";
import { Pawn } from "../Pawns/Pawn";

export class CYBR_Weapon extends Phaser.GameObjects.Sprite
{
    protected timerReloadWeapon: Phaser.Time.TimerEvent;
    protected weapon: Weapon;
    protected muzzleX: number = 0;
    protected muzzleY: number = 0;

    private owner: Pawn = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture?: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        if (!texture)
            this.setVisible(false);

        this.weapon = new Weapon(scene, -1, "weapon_atlas", "bullet.png");

        this.bulletGravity = new Phaser.Math.Vector2(0, -scene.physics.world.gravity.y); // So the bullets ignore the gravity
        this.timerReloadWeapon = scene.time.addEvent({}); // Create an empty timer to avoid null error

        this.on("fire", function (/*bullet: Bullet, weapon: Weapon, speed: number*/){
            this.owner.emit("shotsChanged", this.shots, this.fireLimit);
        }, this);
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(): void
    {
        this.initAnimations(this.texture.key);
        this.weapon.trackSprite(this, this.muzzleX, this.muzzleY, false);
    }

    protected initAnimations(key: string): void
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

    // Update
    ////////////////////////////////////////////////////////////////////////

    public fire(from?: Phaser.Math.Vector2 | Phaser.GameObjects.Sprite | ObjectWithTransform, x?: number, y?: number, offsetX?: number, offsetY?: number) : Bullet
    {
        this.stopReloading();
        const fireResult = this.weapon.fire(from, x, y, offsetX, offsetY);

        if (fireResult)
            this.play("firing");

        return fireResult;
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

    public trackSprite(sprite: Phaser.GameObjects.Sprite | ObjectWithTransform, offsetX?: number, offsetY?: number, trackRotation?: boolean) : void
    {
        this.setPosition(sprite.x, sprite.y);
        this.weapon.trackSprite(sprite, offsetX, offsetY, trackRotation);
    }

    public set bulletGravity(gravity: Phaser.Math.Vector2)
    {
        this.weapon.bulletGravity = gravity;
    }

    public set fireAngle(fireAngle: number)
    {
        this.weapon.fireAngle = fireAngle;
    }

    public set fireRate(fireRate: number)
    {
        this.weapon.fireRate = fireRate;
    }

    public set bulletLifespan(bulletLifespan: number)
    {
        this.weapon.bulletLifespan = bulletLifespan;
    }

    public set bulletSpeed(bulletSpeed: number)
    {
        this.weapon.bulletSpeed = bulletSpeed;
    }

    public set bulletKillType(bulletKillType: number)
    {
        this.weapon.bulletKillType = bulletKillType;
    }

    public set fireLimit(fireLimit: number)
    {
        this.weapon.fireLimit = fireLimit;
    }
}