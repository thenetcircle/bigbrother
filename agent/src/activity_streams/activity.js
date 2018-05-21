var ActivityObject = require('./ActivityObject');

/**
 * @class Activity
 * @see http://activitystrea.ms/specs/json/1.0/
 */
var Activity = function () {
    this.data = {};
};
/**
 * @returns {string|null}
 */
Activity.prototype.getKey = function () {
    if (this.data.actor instanceof ActivityObject) {
        return this.data.actor.getObjectType() + '_' + this.data.actor.getId();
    }
    return null;
};
/**
 * @returns {object}
 */
Activity.prototype.getData = function () {
    return this.data;
};
/**
 * @returns {ActivityObject}
 */
Activity.prototype.getActor = function () {
    return typeof this.data.actor !== 'undefined' ? this.data.actor : new ActivityObject();
};
/**
 * @param {ActivityObject} actor
 * @returns {Activity}
 */
Activity.prototype.setActor = function (actor) {
    this.data.actor = actor;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getContent = function () {
    return typeof this.data.content !== 'undefined' ? this.data.content : '';
};
/**
 * @param {String} content
 * @returns {Activity}
 */
Activity.prototype.setContent = function (content) {
    this.data.content = content;
    return this;
};
/**
 * @returns {ActivityObject}
 */
Activity.prototype.getGenerator = function () {
    return typeof this.data.generator !== 'undefined' ? this.data.generator : new ActivityObject();
};
/**
 * @param {ActivityObject} generator
 * @returns {Activity}
 */
Activity.prototype.setGenerator = function (generator) {
    this.data.generator = generator;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getId = function () {
    return typeof this.data.id !== 'undefined' ? this.data.id : '';
};
/**
 * @param {String} id
 * @returns {Activity}
 */
Activity.prototype.setId = function (id) {
    this.data.id = id;
    return this;
};
/**
 * @returns {ActivityObject}
 */
Activity.prototype.getObject = function () {
    return typeof this.data.object !== 'undefined' ? this.data.object : new ActivityObject();
};
/**
 * @param {ActivityObject} object
 * @returns {Activity}
 */
Activity.prototype.setObject = function (object) {
    this.data.object = object;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getPublished = function () {
    return typeof this.data.published !== 'undefined' ? this.data.published : '';
};
/**
 * @param {String} published
 * @returns {Activity}
 */
Activity.prototype.setPublished = function (published) {
    this.data.published = published;
    return this;
};
/**
 * @returns {ActivityObject}
 */
Activity.prototype.getProvider = function () {
    return typeof this.data.provider !== 'undefined' ? this.data.provider : new ActivityObject();
};
/**
 * @param {ActivityObject} provider
 * @returns {Activity}
 */
Activity.prototype.setProvider = function (provider) {
    this.data.provider = provider;
    return this;
};
/**
 * @returns {ActivityObject}
 */
Activity.prototype.getTarget = function () {
    return typeof this.data.target !== 'undefined' ? this.data.target : new ActivityObject();
};
/**
 * @param {ActivityObject} target
 * @returns {Activity}
 */
Activity.prototype.setTarget = function (target) {
    this.data.target = target;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getTitle = function () {
    return typeof this.data.title !== 'undefined' ? this.data.title : '';
};
/**
 * @param {String} title
 * @returns {Activity}
 */
Activity.prototype.setTitle = function (title) {
    this.data.title = title;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getUpdated = function () {
    return typeof this.data.updated !== 'undefined' ? this.data.updated : '';
};
/**
 * @param {String} updated
 * @returns {Activity}
 */
Activity.prototype.setUpdated = function (updated) {
    this.data.updated = updated;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getUrl = function () {
    return typeof this.data.url !== 'undefined' ? this.data.url : '';
};
/**
 * @param {String} url
 * @returns {Activity}
 */
Activity.prototype.setUrl = function (url) {
    this.data.url = url;
    return this;
};
/**
 * @returns {String}
 */
Activity.prototype.getVerb = function () {
    return typeof this.data.verb !== 'undefined' ? this.data.verb : '';
};
/**
 * @param {String} verb
 * @returns {Activity}
 */
Activity.prototype.setVerb = function (verb) {
    this.data.verb = verb;
    return this;
};
/**
 * @returns {object}
 */
Activity.prototype.getContext = function () {
    return typeof this.data.context !== 'undefined' ? this.data.metadata : {};
};
/**
 * @param {object} context
 * @returns {Activity}
 */
Activity.prototype.setContext = function (context) {
    this.data.context = context;
    return this;
};
/**
 * @param {String} key
 * @param {*} value
 * @returns {Activity}
 */
Activity.prototype.addContext = function (key, value) {
    if (typeof this.data.context === 'undefined') this.data.context = {};
    this.data.context[key] = value;
    return this;
};
/**
 * @param {String} key
 * @returns {Activity}
 */
Activity.prototype.delContext = function (key) {
    if (typeof this.data.context === 'undefined') this.data.context = {};
    delete this.data.context[key];
    return this;
};
Activity.prototype.toString = function () {
    return JSON.stringify(this.data, function (key, value) {
        if (value instanceof ActivityObject) {
            return value.data;
        }
        return value;
    });
};

module.exports = Activity;