export default class GoogleDraw {

    constructor(map) {
        this.map = map;
        this._manager = null;

        this.init();
    }

    init() {
        this.manager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.CIRCLE,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.RIGHT,
                drawingModes: ['circle']
            },
            circleOptions: {
                fillOpacity: 0.2,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });

        this.manager.setMap(this.map);
    }

    get manager() {
        return this._manager;
    }

    set manager(value) {
        this._manager = value;
    }


    
}