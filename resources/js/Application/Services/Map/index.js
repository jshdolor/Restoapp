import GClient from '~/Infrastructure/GoogleClient/Maps';

export default class MapService {

    static getConfig() {
        return {
            libraries: ['places', 'drawing']
        }
    }

    static handle() {
        return new GClient(this.getConfig())
            .get()
            .then(data => data);
    }

}