import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '网站首页', icon: 'dashboard', affix: true }
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/map',
    children: [{
      path: 'map',
      name: 'Map',
      component: () => import('@/views/map/index'),
      meta: { title: '地图呈现', icon: 'map', affix: true }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/5g',
    children: [{
      path: 'FiveG',
      name: 'FiveG',
      component: () => import('@/views/5g/index'),
      meta: { title: '5G网络覆盖', icon: 'eye-open' }
    }]
  },
  {
    path: '/complain',
    component: Layout,
    alwaysShow: true,
    redirect: '/complain/complain-List',
    name: 'Complain',
    meta: { title: '无线投诉', icon: 'wireless' },
    children: [
      {
        path: 'complain-list',
        name: 'ComplainList',
        component: () => import('@/views/complain/list/index'),
        meta: { title: '投诉清单', icon: 'list' }
      },
      {
        path: 'complain-plan',
        name: 'ComplainPlan',
        component: () => import('@/views/complain/plan/index'),
        meta: { title: '方案跟踪', icon: 'tracking' }
      },
      {
        path: 'complain-analysis',
        name: 'ComplainAnalysis',
        component: () => import('@/views/complain/analysis'),
        meta: { title: '分析报表', icon: 'analysis' },
        children: [
          {
            path: 'complain-workorder',
            name: 'ComplainWorkorder',
            component: () => import('@/views/complain/analysis/workorder/index'),
            meta: { title: '落单投诉' }
          },
          {
            path: 'complain-all',
            name: 'ComplainAll',
            component: () => import('@/views/complain/analysis/all/index'),
            meta: { title: '广义投诉' }
          }
        ]
      },
      {
        path: 'complain-case',
        name: 'ComplainCase',
        component: () => import('@/views/complain/case/index'),
        meta: { title: '投诉案例', icon: 'case' }
      },
      {
        path: 'complain-event',
        name: 'ComplainEvent',
        component: () => import('@/views/complain/event/index'),
        meta: { title: '考试&活动', icon: 'event' }
      }
    ]
  },

  {
    path: '/fault',
    component: Layout,
    alwaysShow: true,
    redirect: '/fault',
    name: 'Fault',
    meta: { title: '基站退服', icon: 'site' },
    children: [
      {
        path: 'falut-list',
        name: 'FalutList',
        component: () => import('@/views/fault/index'),
        meta: { title: '退服清单', icon: 'site' }
      },
      {
        path: 'falut-analysis',
        name: 'FalutAnalysis',
        // component: () => import('@/views/fault/index'),
        meta: { title: '分析报表', icon: 'analysis' },
        children: [
          {
            path: 'menu1-2-1',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
            name: 'Menu1-2-1',
            meta: { title: 'Menu1-2-1' }
          },
          {
            path: 'menu1-2-2',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
            name: 'Menu1-2-2',
            meta: { title: 'Menu1-2-2' }
          }
        ]
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '有线故障',
      icon: 'wired'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '故障清单' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: '/demo',
    component: Layout,
    alwaysShow: true,
    redirect: '/demo',
    name: 'demo',
    meta: { title: '组件演示', icon: 'list' },
    children: [
      {
        path: 'map-demo',
        name: 'MapDemo',
        component: () => import('@/views/demo/mapdemo'),
        meta: { title: '百度地图', icon: 'list' }
      },
      {
        path: 'demo2',
        name: 'demo2',
        component: () => import('@/views/demo/i'),
        meta: { title: '蜂窝效果', icon: 'list' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
