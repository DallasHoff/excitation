import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: Tabs,
		children: [
			{
				path: '',
				redirect: '/home'
			},
			{
				path: 'home',
				component: () => import('@/views/Home.vue')
			},
			{
				path: 'history',
				component: () => import('@/views/History.vue')
			},
			{
				path: '/:catchAll(.*)',
				component: () => import('@/views/404.vue')
			}
		]
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router
