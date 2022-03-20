import {Pawn} from "../Pawn";
import { CYBR_Weapon } from "../../Weapons/CYBR_Weapon";

export class PatrolAI extends Pawn
{
    // Patrol
    private patrol: boolean = false;
    private pathStartX: number = 0;
    private pathEndX: number = 0;

    // FireWeapon
    private fireWeapon: boolean = false;
    private fireWeaponDelay: number = 1000;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number)
    {
        super(scene, x, y, texture, frame);
        this.lookOnRight();
    }

    // Init
    ////////////////////////////////////////////////////////////////////////

    public init(scene: Phaser.Scene, textureKey?: string) : void
    {
        super.init(scene, textureKey);

        if (this.fireWeapon)
        {
            let weapon = new CYBR_Weapon(scene, 30, "bullet");
            this.equipWeapon(weapon);
            this.prepareNextFire();
        }
    }

    // Update
    ////////////////////////////////////////////////////////////////////////

    public update(...args: any[]) : void
    {
        super.update(args);

        if (this.dead())
            return;

        if (this.patrol)
        {
            if (this.x <= this.pathStartX)
                this.lookOnRight();
            else if (this.x >= this.pathEndX)
                this.lookOnLeft();

            this.walk();
        }
    }

    protected updateAnimations() : void
    {
        if (this.isWalking)
            this.anims.play(this.isLookingRight ? "right" : "left", true);
        else
            this.anims.pause();
    }

    public prepareNextFire() : void
    {
        this.scene.time.addEvent({ delay: this.fireWeaponDelay, callbackScope: this, callback: () => {
            this.fire();
            this.prepareNextFire();
        }});
    }

    public setPath(pathStartX: number, pathEndX: number) : void
    {
        if (pathStartX == undefined || pathEndX == undefined)
            console.error("pathStartX or pathEndX is undefined!");
        else if (pathStartX < pathEndX)
        {
            this.pathStartX = pathStartX;
            this.pathEndX = pathEndX;
        }
        else
            console.error("pathStartX can't be higher than pathEndX!");
    }
}