import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;
const Navbar = ({ links = [] }) => {
    return  <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[0]}>
        
        {links.map((link, index) => <Menu.Item className={index === links.length - 1 ? "last": ""} key={index}>{link}</Menu.Item>)}
        
        
      </Menu>
    </Header>
    </Layout>
}

export default Navbar;
