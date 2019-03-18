import style from '~style/app.scss';

import App from '~/Framework/Components/Application';
import Store from '~/Framework/Store';

class Bootstrap {
    constructor() {
        
    }

    init() {

        window.Store = Store;
        let app = new Vue({
            render : (h) => {
                return h(App);

            }, 
            store:Store
        });

        app.$mount('#app');
        // this.loadStyle();
        // this.loadDependencyScripts();

        // this.loadApp();
    }

    loadStyle() {
        style.use();

    }

    loadApp() {
        App.load();
    }

    loadDependencyScripts() {
        
        // (Config.dependencyScripts || []).forEach(scriptObj => {
        //     new ScriptElement(scriptObj, this['test']);
        // })
        
    }

    
}

export default Bootstrap;