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
				path: 'home/citation',
				component: () => import('@/views/Citation.vue')
			},
			{
				path: 'saved',
				component: () => import('@/views/Saved.vue')
			},
			{
				path: '/:catchAll(.*)',
				component: () => import('@/views/404.vue')
			}
		]
	}
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;
