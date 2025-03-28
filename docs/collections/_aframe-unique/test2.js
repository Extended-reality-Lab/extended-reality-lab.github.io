/* global AFRAME */

AFRAME.registerComponent('follow-shadow', {
    schema: { type: 'selector' },

    init() {this.el.object3D.renderOrder = -1; },
    tick() {
            if (this.data) {
        this.el.object3D.position.copy(this.data.object3D.position);
    this.el.object3D.position.y -= 0.001; // stop z-fighting
            }
        }
});


AFRAME.registerComponent('event-manager', {

    init: function () {
        this.bindMethods();

        this.boxGeometryEl = document.querySelector('#boxGeometry');
        this.sphereGeometryEl = document.querySelector('#sphereGeometry');
        this.torusGeometryEl = document.querySelector('#torusGeometry');

        this.boxButtonEl = document.querySelector('#boxButton');
        this.sphereButtonEl = document.querySelector('#sphereButton');
        this.torusButtonEl = document.querySelector('#torusButton');
        this.darkModeButtonEl = document.querySelector('#darkModeButton');

        this.buttonToGeometry = {
            'boxButton': this.boxGeometryEl,
            'sphereButton': this.sphereGeometryEl,
            'torusButton': this.torusGeometryEl
        };

        this.boxButtonEl.addEventListener('click', this.onClick);
        this.sphereButtonEl.addEventListener('click', this.onClick);
        this.torusButtonEl.addEventListener('click', this.onClick);
        this.darkModeButtonEl.addEventListener('click', this.onClick);
        this.boxButtonEl.addState('pressed');
    },

    bindMethods: function () {
        this.onClick = this.onClick.bind(this);
    },

    onClick: function (evt) {
        var targetEl = evt.target;
        if (targetEl === this.boxButtonEl ||
            targetEl === this.sphereButtonEl ||
            targetEl === this.torusButtonEl) {
            this.boxButtonEl.removeState('pressed');
            this.sphereButtonEl.removeState('pressed');
            this.torusButtonEl.removeState('pressed');
            this.boxGeometryEl.object3D.visible = false;
            this.sphereGeometryEl.object3D.visible = false;
            this.torusGeometryEl.object3D.visible = false;
            this.buttonToGeometry[targetEl.id].object3D.visible = true;
        }

        if (targetEl === this.darkModeButtonEl) {
            if (this.el.sceneEl.is('starry')) {
                targetEl.setAttribute('button', 'label', 'Dark Mode');
                this.el.sceneEl.setAttribute('environment', { preset: 'default' });
                this.el.sceneEl.removeState('starry');
            } else {
                targetEl.setAttribute('button', 'label', 'Light Mode');
                this.el.sceneEl.setAttribute('environment', { preset: 'starry' });
                this.el.sceneEl.addState('starry');
            }
        } else {
            targetEl.addState('pressed');
        }
    }
});


AFRAME.registerComponent('gesture-listener', {
    schema: {
        hand: { type: "string" }
    },
    init: function () {
        this.el.addEventListener('hand-tracking-updated', (event) => {
            const handData = event.detail.hand;

            // pointing gesture
            const isPointing = handData.fingers[1].extended && handData.fingers.slice(2).every(finger => !finger.extended);

            if (isPointing) {	// Enable clicking and make line opaque when pointing
                this.el.setAttribute("raycaster", "enabled", true);
                this.el.setAttribute("raycaster", "showline", true);
            } else {	// Disable clicking and make line transparent when not pointing
                this.el.setAttribute("raycaster", "enabled", false);
                this.el.setAttribute("raycaster", "showline", false)
            }
        });
    }
});