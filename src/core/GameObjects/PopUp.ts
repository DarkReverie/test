import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { playSound } from '../Utils/Sound';
import gsap from 'gsap';
import { POPUP_CONFIG } from '../../config';
import { Event } from '../Managers/EventManager';

export class Popup extends Container {
  private onYes: () => void;
  private onNo: () => void;
  private showYesButton: boolean;
  private showNoButton: boolean;

  constructor(message: string, onYes?: () => void, onNo?: () => void, showYesButton: boolean = true, showNoButton: boolean = true) {
    super();
    this.onYes =
      onYes ||
      (() => {
        this.close();
        playSound('sound_theme', true);
        Event.dispatch('HELPER:SHOW');
        Event.dispatch('CAMERA:ZOOM');
      });
    this.onNo =
      onNo ||
      (() => {
        this.close();
        Event.dispatch('HELPER:SHOW');
        Event.dispatch('CAMERA:ZOOM');
      });
      this.showYesButton = showYesButton;
      this.showNoButton = showNoButton;
    this.createPopup(message);
  }

  public close(): void {
    gsap.to(this, { alpha: 0, duration: 0.5, onComplete: () => this.destroy() });
  }

  private createPopup(message: string): void {
    const background = this.createBackground();
    this.addChild(background);

    const messageText = this.createMessageText(message);
    messageText.x = (POPUP_CONFIG.width - messageText.width) / 2;
    if(!this.showYesButton && !this.showNoButton) {
      messageText.y = POPUP_CONFIG.spacing * 1.8;
    } else {
      messageText.y = POPUP_CONFIG.spacing ;
    }
    this.addChild(messageText);

    const buttonY = messageText.y + messageText.height + POPUP_CONFIG.spacing;
       if (this.showYesButton) {
      const yesButton = this.createButton('YES', this.onYes);
      yesButton.x = POPUP_CONFIG.width / 2 - POPUP_CONFIG.button.width - POPUP_CONFIG.spacing / 2;
      yesButton.y = buttonY;
      this.addChild(yesButton);
    }

    // Conditionally create "NO" button
    if (this.showNoButton) {
      const noButton = this.createButton('NO', this.onNo);
      noButton.x = POPUP_CONFIG.width / 2 + POPUP_CONFIG.spacing / 2;
      noButton.y = buttonY;
      this.addChild(noButton);
    }
    this.x = (window.innerWidth - POPUP_CONFIG.width) / 2;
    this.y = (window.innerHeight - POPUP_CONFIG.height) / 2;
  }

  private createBackground(): Graphics {
    const bg = new Graphics();
    bg.lineStyle(POPUP_CONFIG.borderThickness, POPUP_CONFIG.borderColor);
    bg.beginFill(POPUP_CONFIG.backgroundColor);
    bg.drawRoundedRect(0, 0, POPUP_CONFIG.width, POPUP_CONFIG.height, 10);
    bg.endFill();
    return bg;
  }

  private createMessageText(message: string): Text {
    const style = new TextStyle(POPUP_CONFIG.textStyle);
    return new Text(message, style);
  }

  private createButton(label: string, callback: () => void): Container {
    const button = new Container();
    const bg = new Graphics();
    bg.lineStyle(POPUP_CONFIG.button.borderThickness, POPUP_CONFIG.button.borderColor);
    bg.beginFill(POPUP_CONFIG.button.backgroundColor);
    bg.drawRoundedRect(0, 0, POPUP_CONFIG.button.width, POPUP_CONFIG.button.height, 5);
    bg.endFill();
    button.addChild(bg);
    const style = new TextStyle(POPUP_CONFIG.button.textStyle);
    const text = new Text(label, style);
    text.x = (POPUP_CONFIG.button.width - text.width) / 2;
    text.y = (POPUP_CONFIG.button.height - text.height) / 2;

    button.addChild(text);
    button.eventMode = 'static';

    button.on('pointerdown', callback);
    return button;
  }
}
