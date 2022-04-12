export class CYBR_Button extends Phaser.GameObjects.Container
{
    private backgroundObject: Phaser.GameObjects.Image;
    private textObject: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string)
    {
        super(scene, x, y);
        scene.add.existing(this);

        // Background
        this.backgroundObject = scene.add.image(x, y, "UI_atlas", "btn_background");
        this.setSize(this.backgroundObject.width, this.backgroundObject.height)
        this.backgroundObject.setOrigin(0);
        this.backgroundObject.setInteractive({ pixelPerfect: true });
        this.add(this.backgroundObject);
        this.backgroundObject.setX((this.width - this.backgroundObject.width) / 2);
        this.backgroundObject.setY((this.height - this.backgroundObject.height) / 2);
    
        // Text
        this.textObject = scene.add.text(0, 0, text, { fontFamily: "Gemunu Libre", fontSize: "48px", fontStyle: "bold", color: "#171822", align: "center" });
        this.textObject.setFixedSize(this.width, 0);
        this.textObject.setOrigin(0);
        this.textObject.setX((this.width - this.textObject.width) / 2);
        this.textObject.setY((this.height - this.textObject.height) / 2);
        this.add(this.textObject);

        // Behaviors
        this.backgroundObject.on("pointerover", () => { this.backgroundObject.setTexture("UI_atlas", "btn_background_hovered"); }, this);

        this.backgroundObject.on("pointerout", () => { this.backgroundObject.setTexture("UI_atlas", "btn_background"); }, this);

        this.backgroundObject.on("pointerdown", () => { this.backgroundObject.setTexture("UI_atlas", "btn_background_hovered"); }, this);

        this.backgroundObject.on("pointerup", () => { this.backgroundObject.setTexture("UI_atlas", "btn_background"); }, this);

        this.backgroundObject.on("pointermove", () => { this.backgroundObject.setTexture("UI_atlas", "btn_background_hovered"); }, this);
    }

    public setX(value?: number) : this
    {
        super.setX(value);
        this.backgroundObject.setX((this.width - this.backgroundObject.width) / 2);
        this.textObject.setX((this.width - this.textObject.width) / 2);
        return this;
    }

    public setY(value?: number) : this
    {
        super.setY(value);
        this.backgroundObject.setY((this.height - this.backgroundObject.height) / 2);
        this.textObject.setY((this.height - this.textObject.height) / 2);
        return this;
    }

    public onClicked(fn: Function, context?: any) : this
    {
        this.backgroundObject.on("pointerup", fn, context);
        return this;
    }
}