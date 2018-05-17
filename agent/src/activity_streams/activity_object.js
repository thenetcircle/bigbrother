/**
 * @class ActivityObject
 *
 * @see http://activitystrea.ms/specs/json/1.0/
 */
var ActivityObject = function () {
    this.data = {};
};
/**
 * @returns {Array}
 */
ActivityObject.prototype.getAttachments = function () {
    return typeof this.data.attachments !== 'undefined' ? this.data.attachments : [];
};
/**
 * @param {Array} attachments
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setAttachments = function (attachments) {
    this.data.attachments = attachments;
    return this;
};
/**
 * @param {ActivityObject} attachment
 * @returns {ActivityObject}
 */
ActivityObject.prototype.addAttachment = function (attachment) {
    if (typeof this.data.attachments === 'undefined') this.data.attachments = [];
    this.data.attachments.push(attachment);
    return this;
};
/**
 * @returns {ActivityObject}
 */
ActivityObject.prototype.getAuthor = function () {
    return typeof this.data.author !== 'undefined' ? this.data.author : new ActivityObject();
};
/**
 * @param {ActivityObject} author
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setAuthor = function (author) {
    this.data.author = author;
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getContent = function () {
    return typeof this.data.content !== 'undefined' ? this.data.content : '';
};
/**
 * @param {string} content
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setContent = function (content) {
    this.data.content = content;
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getDisplayName = function () {
    return typeof this.data.displayName !== 'undefined' ? this.data.displayName : '';
};
/**
 * @param {string} displayName
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setDisplayName = function (displayName) {
    this.data.displayName = displayName;
    return this;
};
/**
 * @returns {Array}
 */
ActivityObject.prototype.getDownstreamDuplicates = function () {
    return typeof this.data.downstreamDuplicates !== 'undefined' ? this.data.downstreamDuplicates : [];
};
/**
 * @param {Array} downstreamDuplicates
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setDownstreamDuplicates = function (downstreamDuplicates) {
    this.data.downstreamDuplicates = downstreamDuplicates;
    return this;
};
/**
 * @param {string} downstreamDuplicate
 * @returns {ActivityObject}
 */
ActivityObject.prototype.addDownstreamDuplicate = function (downstreamDuplicate) {
    if (typeof this.data.downstreamDuplicates === 'undefined') this.data.downstreamDuplicates = [];
    this.data.downstreamDuplicates.push(downstreamDuplicate);
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getId = function () {
    return typeof this.data.id !== 'undefined' ? this.data.id : '';
};
/**
 * @param {string} id
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setId = function (id) {
    this.data.id = id;
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getObjectType = function () {
    return typeof this.data.objectType !== 'undefined' ? this.data.objectType : '';
};
/**
 * @param {string} objectType
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setObjectType = function (objectType) {
    this.data.objectType = objectType;
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getPublished = function () {
    return typeof this.data.published !== 'undefined' ? this.data.published : '';
};
/**
 * @param {string} published
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setPublished = function (published) {
    this.data.published = published;
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getSummary = function () {
    return typeof this.data.summary !== 'undefined' ? this.data.summary : '';
};
/**
 * @param {string} summary
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setSummary = function (summary) {
    this.data.summary = summary;
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getUpdated = function () {
    return typeof this.data.updated !== 'undefined' ? this.data.updated : '';
};
/**
 * @param {string} updated
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setUpdated = function (updated) {
    this.data.updated = updated;
    return this;
};
/**
 * @returns {Array}
 */
ActivityObject.prototype.getUpstreamDuplicates = function () {
    return typeof this.data.upstreamDuplicates !== 'undefined' ? this.data.upstreamDuplicates : [];
};
/**
 * @param {Array} upstreamDuplicates
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setUpstreamDuplicates = function (upstreamDuplicates) {
    this.data.upstreamDuplicates = upstreamDuplicates;
    return this;
};
/**
 * @param {String} upstreamDuplicate
 * @returns {ActivityObject}
 */
ActivityObject.prototype.addUpstreamDuplicate = function (upstreamDuplicate) {
    if (typeof this.data.upstreamDuplicates === 'undefined') this.data.upstreamDuplicates = [];
    this.data.upstreamDuplicates.push(upstreamDuplicate);
    return this;
};
/**
 * @returns {string}
 */
ActivityObject.prototype.getUrl = function () {
    return typeof this.data.url !== 'undefined' ? this.data.url : '';
};
/**
 * @param {String} url
 * @returns {ActivityObject}
 */
ActivityObject.prototype.setUrl = function (url) {
    this.data.url = url;
    return this;
};
ActivityObject.prototype.toString = function () {
    return JSON.stringify(this.data);
};

module.exports = ActivityObject;