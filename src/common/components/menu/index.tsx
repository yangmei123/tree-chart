import { routes } from '@/config/route';
import { DesktopOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const iconData = {
  MailOutlined: <MailOutlined />,
  DesktopOutlined: <DesktopOutlined />,
};
const menuData = (menu: any[]) =>
  menu.map((item) => {
    const { level, routes, title, icon, path } = item;
    if (level) {
      return icon
        ? getItem(title, path, iconData[icon], routes ? menuData(routes) : '')
        : getItem(title, path);
    }
  });

const items: MenuItem[] = menuData(routes[0].routes);

const MenuComponents: React.FC = () => {
  const [current, setCurrent] = useState('1');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    history.push(e.key);
  };

  return (
    <div className="menu-wrap">
      <Menu
        defaultOpenKeys={['/example']}
        selectedKeys={[current]}
        onClick={onClick}
        mode="inline"
        theme="dark"
        inlineCollapsed={true}
        items={items}
      />
    </div>
  );
};

export default MenuComponents;
