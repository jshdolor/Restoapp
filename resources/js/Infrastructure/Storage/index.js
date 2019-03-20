export default class Storage {

    static localStorage() {
        return window.localStorage;
    } 

    static get(key) {
        return this.localStorage().getItem(key);
    }

    static set(key, value) {
        this.localStorage().setItem(key, value);
    }

    static remove(key) {
        this.localStorage().removeItem(key);
    }

    static clear() {
        this.localStorage().clear();
    }

}