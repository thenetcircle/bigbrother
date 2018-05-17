var Activity       = require('./Activity');
var ActivityObject = require('./ActivityObject');

module.exports = {
    /**
     * Create Activity By Params
     *
     * @param {ActivityObject} provider
     * @param {ActivityObject} actor
     * @param {String}         verb
     * @param {ActivityObject} object
     * @param {ActivityObject} target
     * @param {Object}         context
     *
     * @return {Activity}
     */
    createActivity: function (provider, actor, verb, object, target, context) {
        var activity = new Activity();

        activity.setPublished(this.getISODateString(new Date()));
        if (provider) activity.setProvider(this.createActivityObject(provider));
        if (actor)    activity.setActor(this.createActivityObject(actor));
        if (verb)     activity.setVerb(verb);
        if (object)   activity.setObject(this.createActivityObject(object));
        if (target)   activity.setTarget(this.createActivityObject(target));
        if (context)  activity.setContext(context);

        return activity;
    },

    /**
     * Create ActivityObject By Array
     *
     * @param    args   format: [id {String}, type {String}, content? {JsonString/Object}]
     *
     * @returns {ActivityObject}
     */
    createActivityObject: function (args) {

        var activityObject = new ActivityObject();
        if (Array.isArray(args)) {
            switch (true) {
                case args.length === 1:
                    activityObject.setObjectType('unknown');
                    activityObject.setId(args[0]);
                    break;

                case args.length === 2:
                    activityObject.setId(args[0]);
                    activityObject.setObjectType(args[1]);
                    break;

                case args.length === 3:
                    activityObject.setId(args[0]);
                    activityObject.setObjectType(args[1]);
                    activityObject.setContent(args[2]);
                    break;
            }
        }
        return activityObject;

    },

    getISODateString: function (d) {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        return d.getUTCFullYear() + '-'
            + pad(d.getUTCMonth() + 1) + '-'
            + pad(d.getUTCDate()) + 'T'
            + pad(d.getUTCHours()) + ':'
            + pad(d.getUTCMinutes()) + ':'
            + pad(d.getUTCSeconds()) + 'Z';
    }
};