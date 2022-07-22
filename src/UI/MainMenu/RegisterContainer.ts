import {CYBR_Button} from "../CYBR_Button";
import {CYBR_TextField} from "../CYBR_TextField";
import {CYBR_Scene} from "../../Scenes/CYBR_Scene";
import {IResponsePlayer} from "../../Interface/InterfaceResponse";
import {IRequestPlayer} from "../../Interface/InterfaceRequest";
import {HttpServices} from "../../Core/Http.Services";

export class RegisterContainer extends Phaser.GameObjects.Container {
    private textFieldUsername: CYBR_TextField;
    private textFieldEmail: CYBR_TextField;
    private textFieldPassword: CYBR_TextField;
    private httpService:HttpServices;
    static resultOauth;
    constructor(scene: CYBR_Scene, x?: number, y?: number) {
        super(scene, x, y);
        scene.add.existing(this);
        this.width = scene.scale.displaySize.width;
        this.height = scene.scale.displaySize.height;
        this.httpService =new HttpServices();
        this.createButtons();
        this.createTextFields();

    }

    private createButtons() : void
    {
        const buttonCancel = new CYBR_Button(this.scene, 100, 520, "Cancel");
        buttonCancel.onClicked(this.cancelClicked, this);
        (this.scene as CYBR_Scene).centerHItem(buttonCancel, -320);
        this.add(buttonCancel);

        const buttonLogin = new CYBR_Button(this.scene, 440, buttonCancel.y, "Login");
        buttonLogin.onClicked(this.confirmLoginClicked, this);
        (this.scene as CYBR_Scene).centerHItem(buttonLogin);
        this.add(buttonLogin);

        const buttonSignUp = new CYBR_Button(this.scene, 680, buttonCancel.y, "Sign Up");
        buttonSignUp.onClicked(this.signUpClicked, this);
        (this.scene as CYBR_Scene).centerHItem(buttonSignUp, 320);
        this.add(buttonSignUp);
    }

    private createTextFields(): void {
        // Username
        this.textFieldUsername = new CYBR_TextField(this.scene, 0, 110, "");
        (this.scene as CYBR_Scene).centerHItem(this.textFieldUsername);
        this.add(this.textFieldUsername);

        const labelUsername = this.scene.add.text(0, 0, "Username", {
            fontFamily: "Gemunu Libre",
            fontSize: "20px",
            color: "yellow"
        });
        labelUsername.setPosition(this.textFieldUsername.x, this.textFieldUsername.y - labelUsername.height - 8);
        this.add(labelUsername);

        // Email
        this.textFieldEmail = new CYBR_TextField(this.scene, 0, this.textFieldUsername.y + this.textFieldUsername.height + 64, "");
        Phaser.Display.Align.To.BottomCenter(this.textFieldEmail, this.textFieldUsername, 0, 60);
        this.add(this.textFieldEmail);

        const labelEmail = this.scene.add.text(0, 0, "Email", {
            fontFamily: "Gemunu Libre",
            fontSize: "20px",
            color: "yellow"
        });
        labelEmail.setPosition(this.textFieldEmail.x, this.textFieldEmail.y - labelEmail.height - 8);
        this.add(labelEmail);

        // Password
        this.textFieldPassword = new CYBR_TextField(this.scene, 0, this.textFieldEmail.y + this.textFieldEmail.height + 64, "", "password");
        Phaser.Display.Align.To.BottomCenter(this.textFieldPassword, this.textFieldEmail, 0, 60);
        this.add(this.textFieldPassword);

        const labelPassword = this.scene.add.text(0, 0, "Password", {
            fontFamily: "Gemunu Libre",
            fontSize: "20px",
            color: "yellow"
        });
        labelPassword.setPosition(this.textFieldPassword.x, this.textFieldPassword.y - labelPassword.height - 8);
        this.add(labelPassword);
    }

    public setVisible(value: boolean): this {
        super.setVisible(value);

        if (value) {
            this.textFieldUsername.clear();
            this.textFieldEmail.clear();
            this.textFieldPassword.clear();
        }
        return this;
    }
    private async ShowAuthWindow(options) {
        new Promise((res) =>
        {
            console.log('ee');
            options.windowName = options.windowName || '_blank'; // should not include space for IE
            options.windowOptions = options.windowOptions || 'location=0,status=0,width=800,height=400';
            options.callback = options.callback || function () {
                window.location.reload();
            };
            console.log(options.path);
            let _oauthWindow = window.open(options.path, options.windowName, options.windowOptions);
            console.log(_oauthWindow);

            let _oauthInterval = window.setInterval(function () {
                if (_oauthWindow.closed) {
                    console.log('closed');
                    clearInterval(_oauthInterval);
                    new HttpServices().loginValidation().then(console.log);
                }
            }, 100);
        })
    }
    private  confirmLoginClicked(): void {
        // this.httpService.register({mail:"pierreluucmillet@gmail.com",password:"A1azerty*",name:"Pldu78"}).then(res=>console.log(res));

        console.log("textFieldUsername:", this.textFieldUsername.text)
        console.log("textFieldEmail:", this.textFieldEmail.text)
        console.log("textFieldPassword:", this.textFieldPassword.text)
        this.httpService.login().then(async result =>{
            console.log(result)

            await this.ShowAuthWindow({path:JSON.parse(result.data as unknown as string).url,callback:{}});

        });


        /*  this.httpService.register({
            mail: this.textFieldEmail.text,
            password: this.textFieldPassword.text,
            name: this.textFieldUsername.text
        }).then(async res => {
            console.log(JSON.parse(res.data as unknown as string).message.token);
            await this.sharedData.setToken(JSON.parse(res.data as unknown as string).message.token);
            const playerData: IRequestPlayer = {
                playerId:JSON.parse(res.data as unknown as string).message.token ,
                level: 0,
                score: 0,
                cybr_coin_amount: 0,
                cybr_coin_per_level: 0,
                best_time: 9*3600000,
            }
            let result = await this.httpService.createPlayerData(playerData);
            console.log(JSON.parse(result.data as unknown as string).playerData);
            await this.sharedData.setUser(JSON.parse(result.data as unknown as string).playerData);
            if(result.status==403) {
                console.log(result.data.message);//
            }
        });*/

        //this.httpService.register({mail: this.textFieldEmail.text,password: this.textFieldPassword.text,name: this.textFieldUsername.text}).then(res=>console.log(res))

        this.emit("playerConnected");
    }

    private signUpClicked(): void {

        console.log("textFieldUsername:", this.textFieldUsername.text)
        console.log("textFieldEmail:", this.textFieldEmail.text)
        console.log("textFieldPassword:", this.textFieldPassword.text)
      /*  this.httpService.login({mail:this.textFieldEmail.text, password:this.textFieldPassword.text}).then(async result=>{
            let parsedResult = JSON.parse(result.data as unknown as string);
            await this.sharedData.setToken(JSON.parse(result.data as unknown as string).message.token);
            this.httpService.getPlayerData(parsedResult.message.token).then(async result=>{
                let playerParsed = JSON.parse(result.data as unknown as string);
                await this.sharedData.setUser(playerParsed.playerData);
            });
        });
        this.emit("playerConnected");*/
    }

    private cancelClicked(): void {
        this.emit("playerCancelledConnection");
    }
}