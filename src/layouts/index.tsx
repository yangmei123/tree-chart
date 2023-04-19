import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';

import { Menu } from '@/common/components';

import '@/common/style/style.less';
import styles from './index.less';

const { Header, Footer, Sider, Content } = Layout;
const Wrapper: React.FC = (props: any) => {
  return <div className={styles.container}>{props.children}</div>;
};

function BasicLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <ConfigProvider locale={zhCN}>
      <RecoilRoot>
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.sider}
          >
            <div className={styles.logo} />
            <Menu></Menu>
          </Sider>
          <Layout className={styles['site-layout']}>
            <Header className={styles['site-layout-background']}>
              <Button
                type="primary"
                onClick={toggleCollapsed}
                className={styles.trigger}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
            </Header>
            <Content className={`${styles.content} site-layout-background`}>
              <Wrapper {...props}></Wrapper>
            </Content>
            <Footer style={{ textAlign: 'center' }}>umi template ©2022 </Footer>
          </Layout>
        </Layout>
      </RecoilRoot>
    </ConfigProvider>
  );
}

export default BasicLayout;
