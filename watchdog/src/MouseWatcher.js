class MouseWatcher {
    constructor(sender, recorderId) {
        this.sender = sender;
        this.recorderId = recorderId;

        this.startupTime = +new Date();
        this.lastUpdateTime = 0;

        this.recordInterval = 300;
        this.moveTimer = null;
        this.scrollTimer = null;

        this.scrollTrackFun = this.scrollTrack.bind(this);
        this.moveTrackFun = this.moveTrack.bind(this);
        this.clickTrackFun = this.clickTrack.bind(this);
    }

    start() {
        window.addEventListener('scroll', this.scrollTrackFun);
        document.documentElement.addEventListener('mousemove', this.moveTrackFun);
        document.documentElement.addEventListener('click', this.clickTrackFun);
    }

    stop() {
        window.removeEventListener('scroll', this.scrollTrackFun);
        document.documentElement.removeEventListener('mousemove', this.moveTrackFun);
        document.documentElement.removeEventListener('click', this.clickTrackFun);
    }

    scrollTrack() {
        if (!this.inactiveCheck()) return;

        if (!this.scrollTimer) {
            this.scrollTimer = setTimeout(() => {

                let data = {
                    i: this.recorderId,
                    a: 'scroll',
                    t: +new Date(),
                    d: [window.scrollX, window.scrollY]
                };
                this.sender.send(data);
                this.scrollTimer = null;

            }, this.recordInterval);
        }
    }

    moveTrack(e) {
        if (!this.inactiveCheck()) return;

        if (!this.moveTimer) {
            this.moveTimer = setTimeout(() => {

                let data = {
                    i: this.recorderId,
                    a: 'move',
                    t: +new Date(),
                    d: [e.pageX, e.pageY]
                };
                this.sender.send(data);
                this.moveTimer = null;

            }, this.recordInterval);
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