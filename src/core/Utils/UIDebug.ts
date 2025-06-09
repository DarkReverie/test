import { ItemManager } from '../Managers/ItemsManager';

export class UIManager {
  private itemManager: ItemManager;
  private container: HTMLElement;
  private groupContainer: HTMLElement;
  private itemContainer: HTMLElement;

  constructor(itemManager: ItemManager) {
    this.itemManager = itemManager;

    this.container = document.createElement('div');
    this.container.id = 'ui-container';
    this.container.style.position = 'absolute';
    this.container.style.top = '50px';
    this.container.style.left = '10px';
    this.container.style.padding = '10px';
    this.container.style.borderRadius = '4px';
    this.container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
    document.body.appendChild(this.container);

    this.groupContainer = document.createElement('div');
    this.groupContainer.id = 'group-buttons';
    this.container.appendChild(this.groupContainer);

    this.itemContainer = document.createElement('div');
    this.itemContainer.id = 'item-buttons';
    this.itemContainer.style.marginTop = '10px';
    this.itemContainer.style.overflow = 'hidden';
    this.itemContainer.style.transition = 'max-height 0.5s ease';
    this.itemContainer.style.maxHeight = '0';
    this.container.appendChild(this.itemContainer);
  }

  public renderGroupButtons(): void {
    this.groupContainer.innerHTML = '';
    const groups = this.itemManager.getGroups();
    groups.forEach((group) => {
      const button = document.createElement('button');
      button.innerText = group;
      button.style.marginRight = '5px';
      button.style.padding = '5px 10px';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#2196F3';
      button.style.color = '#fff';
      button.onclick = () => this.renderItemButtons(group);
      this.groupContainer.appendChild(button);
    });
  }

  private renderItemButtons(group: string): void {
    this.itemContainer.innerHTML = '';
    this.itemContainer.style.maxHeight = '0';

    const items = this.itemManager.getItemsByGroup(group);

    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';

    items.forEach((itemId) => {
      const li = document.createElement('li');
      li.style.marginBottom = '5px';

      const button = document.createElement('button');
      button.innerText = itemId;
      button.style.padding = '5px 10px';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#4CAF50';
      button.style.color = '#fff';
      button.onclick = () => {
        this.itemManager.addItem(itemId);
      };

      li.appendChild(button);
      ul.appendChild(li);
    });

    this.itemContainer.appendChild(ul);

    const scrollHeight = this.itemContainer.scrollHeight;
    this.itemContainer.style.maxHeight = scrollHeight + 'px';
  }
}
