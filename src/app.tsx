import { AvatarDropdown, AvatarName, Footer } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import ths from './images/ths.jpeg';
import { errorConfig } from './requestErrorConfig';
const loginPath = '/user/login';

// 引入 SkyWalking 脚本
const skywalkingScript = document.createElement('script');
skywalkingScript.src = 'https://s.thsi.cn/hxapp/m/base/js/skywalking.1.1.13.min.js';

// 在页面加载时添加 SkyWalking 脚本
document.head.appendChild(skywalkingScript);

skywalkingScript.onload = () => {
  try {
    if (typeof ClientMonitor !== 'undefined') {
      ClientMonitor.register({
        collector: 'https://apm.hexin.cn/skywalking-web',
        rate: 1,
        service: 'mobileweb-training-camp-group8',
        pagePath: location.hash.replace('#', '') || '/root',
        enableSPA: false,
        useFmp: true,
        gourp: 'camp8',
      });
    } else {
      console.warn('ClientMonitor is undefined. SkyWalking may not be properly loaded.');
    }
  } catch (e) {
    console.warn('Error registering SkyWalking:', e.message);
  }
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  // 初始化查询用户信息方法
  const fetchUserInfo = async () => {
    try {
      const data = {
        access: 'admin',
        avatar: null,
        country: 'China',
        email: 'gongshaoxu@gmail.com',
        name: '同花顺B2C第八组',
        signature: '我愿意看见一只只白帆',
        title: '前端开发工程师',
      };
      return data;
    } catch (error) {
      return { access: 'admin', avatar: null };
    }
  };
  // 如果不是登录页面，执行查询用户信息方法
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  return {
    fetchUserInfo,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    title: '工业品采购管理系统',
    siderWidth: 180,
    token: {
      header: {
        colorBgHeader: '#071023',
        colorHeaderTitle: '#fff',
        colorTextMenu: '#dfdfdf',
        colorTextMenuSecondary: '#dfdfdf',
        colorTextMenuSelected: '#fff',
        colorBgMenuItemSelected: '#22272b',
        colorTextMenuActive: 'rgba(255,255,255,0.85)',
        colorTextRightActionsItem: '#dfdfdf',
      },
      colorTextAppListIconHover: '#fff',
      colorTextAppListIcon: '#dfdfdf',
      sider: {
        colorBgCollapsedButton: '#fff',
        colorTextCollapsedButtonHover: 'rgba(0,0,0,0.65)',
        colorTextCollapsedButton: 'rgba(0,0,0,0.45)',
        colorMenuBackground: '#071023',
        colorBgMenuItemCollapsedHover: 'rgba(0,0,0,0.06)',
        colorBgMenuItemCollapsedSelected: 'rgba(0,0,0,0.15)',
        colorBgMenuItemCollapsedElevated: 'rgba(0,0,0,0.85)',
        colorMenuItemDivider: 'rgba(255,255,255,0.15)',
        colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
        colorBgMenuItemSelected: 'rgba(0,0,0,0.52)',
        colorTextMenuSelected: '#fff',
        colorTextMenuItemHover: 'rgba(255,255,255,0.95)',
        colorTextMenu: 'rgba(255,255,255,0.75)',
        colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
        colorTextMenuTitle: 'rgba(255,255,255,0.95)',
        colorTextMenuActive: 'rgba(255,255,255,0.95)',
        colorTextSubMenuSelected: 'rgba(255,255,255,1)',
      },
    },
    avatarProps: {
      src: ths, // initialState?.currentUser?.avatar
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    // 验证登陆态
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    collapsedButtonRender: false,
    collapsed: false,
    ...defaultSettings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
