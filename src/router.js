import { createRouter, createWebHistory } from "vue-router";
import home from './components/home.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
       
     
    ]
});

export default router;
