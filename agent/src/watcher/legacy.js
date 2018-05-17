import * as logger from '../logger';

class MouseWatcher {

    constructor(sender, recorderId) {
        this.sender = sender;
        this.recorderId = recorderId;

        this.startupTime = +new Date();
        this.lastUpdateTime = 0;

        this.collectInterval = 300;
        this.timer = null;
        this.timer = null;

        this.scrollTrackFun = this.scrollTrack.bind(this);
        this.moveTrackFun = this.moveTrack.bind(this);
        this.run = this.clickTrack.bind(this);
    }

    start() {
        window.addEventListener('scroll', this.scrollTrackFun);
        document.documentElement.addEventListener('mousemove', this.moveTrackFun);
        document.documentElement.addEventListener('click', this.run);
    }

    stop() {
        window.removeEventListener('scroll', this.scrollTrackFun);
        document.documentElement.removeEventListener('mousemove', this.moveTrackFun);
        document.documentElement.removeEventListener('click', this.run);
    }

    scrollTrack() {
        if (!this.inactiveCheck()) return;

        if (!this.timer) {
            this.timer = setTimeout(() => {

                let data = {
                    i: this.recorderId,
                    a: 'scroll',
                    t: +new Date(),
                    d: [window.scrollX, window.scrollY]
                };
                this.sender.send(data);
                this.timer = null;

            }, this.collectInterval);
        }
    }

    moveTrack(e) {
        if (!this.inactiveCheck()) return;

        if (!this.timer) {
            this.timer = setTimeout(() => {

                let data = {
                    i: this.recorderId,
                    a: 'move',
                    t: +new Date(),
                    d: [e.pageX, e.pageY]
                };
                this.sender.send(data);
                this.timer = null;

            }, this.collectInterval);
        }
    }

    clickTrack(e) {
        if (!this.inactiveCheck()) return;

        let data = {
            i: this.recorderId,
            a: 'click',
            t: +new Date(),
            d: [e.pageX, e.pageY]
        };
        this.sender.send(data);
    }

    inactiveCheck() {
        let timeout = 300000;
        let runningTime = (+new Date() - this.startupTime);
        if (runningTime - this.lastUpdateTime >= timeout) {
            this.stop();
            return false;
        }
        else {
            this.lastUpdateTime = runningTime;
            return true;
        }
    }

}

export default MouseWatcher;