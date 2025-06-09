import { Container, TextStyle, Sprite, Assets, Texture, Text, Graphics } from 'pixi.js';
// import { Select } from '@pixi/ui';
import { playSound } from '../Utils/Sound';
import { ItemManager } from '../Managers/ItemsManager';
import { LIST } from '../../config';
import { Event } from '../Managers/EventManager';
import gsap from 'gsap';
export class List {
  public container: Container;
  public helperStepOne: boolean = false;
  public helperStepTwo: boolean = false;
  public helperStart: boolean = false;
  private shopIcon: Sprite | undefined; 
  private listContainer: Container; 
  private selectedBG: any

  private isListVisible: boolean = false;

  constructor() {
    this.container = new Container();
    this.listContainer = new Container();
    this.container.addChild(this.listContainer);

    this.initList();
    this.initShopIcon();
      this.helperStart = true;
  }

  private initShopIcon(): void {
    const shopTexture = Assets.get(LIST.texOpen);
    this.shopIcon = new Sprite(shopTexture);
    this.shopIcon.anchor.set(0.5);
    this.shopIcon.x = LIST.x + 200;
    this.shopIcon.y = LIST.y;
    this.shopIcon.width = 100;
    this.shopIcon.height = 100;
    this.shopIcon.eventMode = 'static';
    this.shopIcon.cursor = 'pointer';

    this.shopIcon.on('pointerdown', () => {
      playSound('sound_click');
      if (!this.helperStepOne && this.helperStart) {
        Event.dispatch('HELPER:NEXT:STEP');
        this.helperStepOne = true;
      }
      this.toggleListVisibility();
      this.toggleShopTexture();
    });

    this.container.addChild(this.shopIcon);
  }
  private toggleListVisibility(): void {
    this.isListVisible = !this.isListVisible;
    this.listContainer.visible = this.isListVisible;
    Event.dispatch('GRID:TOGGLE', this.isListVisible);
  }
  private toggleShopTexture(): void {
    if (this.shopIcon) {
      const newTexture = this.isListVisible ? Assets.get(LIST.texClose) : Assets.get(LIST.texOpen);
      this.shopIcon.texture = newTexture;
      gsap.to(this.shopIcon.scale, {
        x: this.shopIcon.scale.x + 0.05,
        y: this.shopIcon.scale.y + 0.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'elastic.out(1, 0.3)',
      });
    }
  }

private createSelectList(): void {
  const itemManager = ItemManager.getInstance();
  const listItems: string[] = LIST.listItems;
  const listIDs: string[] = LIST.listID;
  console.log('List Items:', listItems);
  console.log('List IDs:', listIDs);

  const centerX = LIST.x;
  const centerY = LIST.y;
  const buttonWidth = 100;
  const buttonHeight = 100;
  const spacingX = 120;
  const spacingY = 20;

  for (let i = 0; i < listItems.length; i++) {
    let texture: Texture;
    try {
      texture = Assets.get(listIDs[i].split('_')[0]);
    } catch {
      texture = Texture.WHITE;
    }

    const background = new Graphics();
    background.beginFill(0x000000, 0.6);
    background.drawRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
    background.endFill();
    background.x = centerX + (i % 2) * spacingX - spacingX / 2;
    background.y = centerY + Math.floor(i / 2) * (buttonHeight + spacingY);

    const btn = new Sprite(texture);
    btn.width = btn.height = 60;
    btn.anchor.set(0.5);
    btn.x = background.x;
    btn.y = background.y;

    btn.eventMode = 'static';
    btn.cursor = 'pointer';

    const label = new Text(listItems[i], new TextStyle(LIST.itemStyle));
    label.scale.set(0.8);
    label.anchor.set(0.5);
    label.x = btn.x;
    label.y = btn.y + 35;
    const buttonContainer = new Container()
    buttonContainer.addChild(background, btn, label)
    this.listContainer.addChild(buttonContainer);

    btn.on('pointerdown', () => {
      playSound('sound_click');
      itemManager.selectedItem = listIDs[i];
      gsap.to(background.scale, { x: background.scale.x + 0.2, y: background.scale.y + 0.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'elastic' });
      gsap.to(btn.scale, { x: btn.scale.x + 0.05, y: btn.scale.y + 0.05, duration: 0.05, yoyo: true, repeat: 1, ease: 'elastic' });
      gsap.to(label.scale, { x: label.scale.x + 0.15, y: label.scale.y + 0.15, duration: 0.2, yoyo: true, repeat: 1, ease: 'elastic' });
      if (this.selectedBG) {
        this.selectedBG.clear();
        this.selectedBG.beginFill(0x000000, 0.6); // Revert to original black color
        this.selectedBG.drawRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
        this.selectedBG.endFill();
      }

      background.clear();
      background.beginFill(0x4287f5, 0.6); // Change to red color
      background.drawRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
      background.endFill();

      this.selectedBG = background

      if (!this.helperStepOne && this.helperStart) {
        Event.dispatch('HELPER:NEXT:STEP');
        console.log('Helper Step One Triggered');
        this.helperStepOne = true;
      }
      if (!this.helperStepTwo && this.helperStart) {
        Event.dispatch('HELPER:NEXT:STEP');
        Event.dispatch('GRID:ENABLE');
        this.helperStepTwo = true;
      }
    });
  }
  this.createDeselectButton(buttonWidth, buttonHeight, centerX, centerY, listItems, spacingY, itemManager);
  this.listContainer.visible = false;
  itemManager.selectedItem = listIDs[0]; // Set default selected item
}

  private createDeselectButton(buttonWidth: number, buttonHeight: number, centerX: number, centerY: number, listItems: string[], spacingY: number, itemManager): void {
    const deselectButton = new Graphics();
  deselectButton.beginFill(0xFF0000, 0.8); // Red color
  deselectButton.drawRoundedRect((-buttonWidth * 1.5) / 2, -buttonHeight / 4, buttonWidth * 1.5, buttonHeight * 0.5, 10); // Draw rectangle
  deselectButton.endFill();

  const deselectLabel = new Text('DESELECT', new TextStyle(LIST.itemStyle));
  deselectLabel.anchor.set(0.5);
  deselectLabel.x = 0;
  deselectLabel.y = 0;

  const deselectContainer = new Container();
  deselectContainer.addChild(deselectButton, deselectLabel);
  deselectContainer.x = centerX; // Center the button horizontally
  deselectContainer.y = centerY + Math.ceil(listItems.length / 2) * (buttonHeight + spacingY) + spacingY; // Position below the list

  this.listContainer.addChild(deselectContainer);

  deselectContainer.eventMode = 'static';
  deselectContainer.cursor = 'pointer';

  deselectContainer.on('pointerdown', () => {
    playSound('sound_click');
    itemManager.selectedItem = null; // Reset the selected item

    if (this.selectedBG) {
      this.selectedBG.clear();
      this.selectedBG.beginFill(0x000000, 0.6); // Revert to original black color
      this.selectedBG.drawRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
      this.selectedBG.endFill();
      this.selectedBG = null; // Clear the selected background reference
    }
  });
  }
  // private attachEventHandlers(selectList: Select, listIDs: string[], itemManager: ItemManager): void {
  //   selectList.onSelect.connect((value: number) => {
  //     if (!this.helperStepTwo && this.helperStart) {
  //       Event.dispatch('HELPER:NEXT:STEP');
  //       Event.dispatch('GRID:ENABLE');
  //       this.helperStepTwo = true;
  //     }
  //     const id: string = listIDs[value];
  //     itemManager.selectedItem = id;
  //     gsap.to(selectList.scale, { duration: 0.25, x: LIST.scale, y: LIST.scale, ease: 'elastic' });
  //   });
  //   selectList.eventMode = 'static';
  //   selectList.addEventListener('pointerdown', () => {
  //     gsap.to(selectList.scale, { duration: 0.25, x: LIST.scale + 0.1, y: LIST.scale + 0.1, ease: 'elastic' });
  //     playSound('sound_click');
  //     if (!this.helperStepOne && this.helperStart) {
  //       Event.dispatch('HELPER:NEXT:STEP');
  //       this.helperStepOne = true;
  //     }
  //   });
  // }

  private initList(): void {
    const itemManager = ItemManager.getInstance();
    // const listItems: string[] = LIST.listItems;
    const listIDs: string[] = LIST.listID;

    // const { labelStyle, itemTextStyle } = this.createTextStyles();
    // const { openBgSprite, closeBgSprite } = this.createBackgroundSprites();

    this.createSelectList();
    // this.container.addChild(selectList);

    // this.attachEventHandlers(selectList, listIDs, itemManager);

    // selectList.position.set(LIST.x, LIST.y);
    // selectList.scale.set(LIST.scale);
    itemManager.selectedItem = listIDs[0];
  }
}
