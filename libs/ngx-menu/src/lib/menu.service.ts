import { Injectable, Output, EventEmitter } from '@angular/core';

import { MenuItem, PermissionVerificationFuncType } from './menu.model';
import { MenuNode } from './menu.util';
import { MenuModule } from './menu.module';

@Injectable({
  providedIn: MenuModule,
})
export class MenuService {
  @Output() menuChange$ = new EventEmitter<MenuNode>();
  private rootNode: MenuNode = new MenuNode({ name: 'root' });
  private isAllowedFunc: PermissionVerificationFuncType = (node: MenuItem) =>
    !!(node?.allowed ?? true);

  buildMenuTree(menuItems: MenuItem[], force = false) {
    if (this.rootNode?.children?.length === 0 || force) {
      this.rootNode.children = this.makeMenuTree(menuItems);
      this.menuChange$.emit(this.rootNode);
    }
    return this.rootNode;
  }

  private makeMenuTree(
    itemList: MenuItem[],
    parent?: MenuNode,
    level = 1
  ): MenuNode[] {
    const tree: MenuNode[] = [];
    for (const item of itemList) {
      if (
        !Object.prototype.hasOwnProperty.call(item, 'name') ||
        item.name.length < 1
      ) {
        throw Error(`Menu item missing 'name'`);
      }

      if (this.isAllowedFunc(item)) {
        const newItem = new MenuNode(item);
        newItem.level = level;
        newItem.parent = parent;
        if (Object.prototype.hasOwnProperty.call(item, 'children')) {
          if (item.children.length > 0) {
            newItem.children = this.makeMenuTree(
              item.children,
              newItem,
              level + 1
            );
          }
        }
        tree.push(newItem);
      }
    }
    return tree;
  }

  setPermissionVerificationFunction(func: PermissionVerificationFuncType) {
    this.isAllowedFunc = func;
  }
}
