import Agent from './agent';
import DOMWatcher from "./watcher/dom-watcher";
import MouseMovementWatcher from "./watcher/mouse-movement-watcher";
import MouseClickWatcher from "./watcher/mouse-click-watcher";
import ScrollWatcher from "./watcher/scroll-watcher";

(function(global) {

    global.BigBrother = {
        Agent,
        DOMWatcher,
        MouseMovementWatcher,
        MouseClickWatcher,
        ScrollWatcher
    };

})(typeof window !== 'undefined' ? window : global);
