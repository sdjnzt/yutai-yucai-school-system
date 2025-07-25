// Ant Design 主题配置
export const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,
    
    // 圆角
    borderRadius: 4,
    
    // 间距
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,
    
    // 盒子阴影
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    
    // 动画
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Button: {
      borderRadius: 4,
      paddingInline: 16,
    },
    Card: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#262626',
      headerSplitColor: '#f0f0f0',
      rowHoverBg: '#f5f5f5',
    },
    Menu: {
      itemHeight: 40,
      itemHoverBg: 'rgba(0, 0, 0, 0.06)',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
    },
    Layout: {
      headerHeight: 64,
      headerPadding: '0 24px',
      headerColor: '#262626',
      headerBg: '#fff',
      siderBg: '#001529',
    },
    Form: {
      labelHeight: 32,
      marginLG: 24,
    },
    Input: {
      borderRadius: 4,
      paddingBlock: 4,
      paddingInline: 11,
    },
    Select: {
      borderRadius: 4,
      optionSelectedBg: '#e6f7ff',
    },
    Modal: {
      borderRadius: 4,
      headerPadding: '16px 24px',
      bodyPadding: '24px',
      footerPadding: '10px 16px',
    },
    Tabs: {
      inkBarColor: '#1890ff',
      itemSelectedColor: '#1890ff',
      itemHoverColor: '#40a9ff',
    },
  },
};

// 自定义主题变量
export const customTheme = {
  // 学校主题色
  schoolPrimary: '#1890ff',
  schoolSecondary: '#096dd9',
  
  // 布局
  sidebarWidth: 256,
  sidebarCollapsedWidth: 80,
  headerHeight: 64,
  
  // 响应式断点
  screenXS: 480,
  screenSM: 576,
  screenMD: 768,
  screenLG: 992,
  screenXL: 1200,
  screenXXL: 1600,
  
  // 间距
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // 字体大小
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  
  // 动画
  transition: {
    slow: '0.3s',
    normal: '0.2s',
    fast: '0.1s',
  },
  
  // 阴影
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  
  // z-index 层级管理
  zIndex: {
    dropdown: 1050,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1060,
    popover: 1070,
    tooltip: 1080,
  },
};

// 导出默认配置
export default {
  theme,
  customTheme,
}; 