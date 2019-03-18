export default class ScriptElement {

    constructor(data, config) {

        this.parent =  data.parent || 'body';
        this.el = document.createElement('script');
        this.el.async = data.async || false;
        this.el.defer = data.async || false;

        this.attach();
    }

    attach() {
        document.querySelector(this.parent)
            .append(this.el);
    }

}