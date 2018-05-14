import WatchDog from './watchdog';

(function(global) {
    global.WatchDog = WatchDog;
})(typeof window !== 'undefined' ? window : global);
