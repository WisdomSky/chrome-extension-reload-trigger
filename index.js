/*!
 * chrome-extension-reload-trigger <https://github.com/WisdomSky/chrome-extension-reload-trigger>
 *
 * Copyright (c) 2018, Julian Paolo Dayag.
 * Licensed under the MIT License.
 */


module.exports = (function() {

    var _ = require('lodash');
    var _RULES = [];
    var PageReloadTrigger = function() {};
    var nodeEnvCheck = true;


    PageReloadTrigger.prototype.disableNodeEnvCheck = function() {
        nodeEnvCheck = false;
    };


    /**
     * Create your own custom rule by passing a function that returns a boolean value.
     * The current tab object will be passed into the function.
     * 
     * @param Function resolver 
     */
    PageReloadTrigger.prototype.matchCustom = function(resolver) {

        _RULES.push({
            type: Function,
            value: resolver
        });

        return this;
    }


    /**
     * Add a rule which validates if the url of the current tab matches the provided Regex pattern.
     * 
     * @param RegExp pattern 
     */
    PageReloadTrigger.prototype.matchUrlPattern = function(pattern) {

        this.matchCustom((function(p) {

            return function(tab) {
                return (p instanceof RegExp && p.test(tab.url));
            };

        })(pattern));

        return this;
    };


    /**
     * Add a rule which validates if the url of the current tab is the same with the provided url.
     * 
     * @param String url 
     */
    PageReloadTrigger.prototype.matchUrl = function(url) {

        this.matchCustom((function(u) {

            return function(tab) {
                return u == tab.url;
            };

        })(url));

        return this;
    };


    /**
     * Apply rules to the passed Tab object
     * 
     * @param Object tab  
     * @returns Boolean
     */
    PageReloadTrigger.prototype.validate = function(tab) {

        return _RULES.reduce(function(accumulator, rule) {
            
            if (!accumulator) return false;

            if (rule.type instanceof Function) {
                return rule.value(tab);
            }

        }, true);

    };


    /**
     * Initialize the event listeners
     * 
     * @returns Boolean
     */
    PageReloadTrigger.prototype.init = function() {
        
        if (nodeEnvCheck && ['development', 'dev'].indexOf(String(process.env.NODE_ENV).trim().toLowerCase()) == -1) return false;

        var debouncedCallback = _.debounce(function(tab) {

            if (this.validate(tab)) {
                chrome.runtime.reload(); 
            } 

        }.bind(this), 50);

        chrome.extension.onMessage.addListener(function({ action, tab }, sender, sendResponse){

            if (action == 'page-reload-trigger-start-inject') {
                debouncedCallback(tab);
            }

        });    

        chrome.tabs.onUpdated.addListener(function(tabId,change,tab) {

            if (change.status == "complete") {

                chrome.tabs.executeScript(tabId, {
                    code: 'window.addEventListener("beforeunload", function(event) {chrome.extension.sendMessage({action: "page-reload-trigger-start-inject", tab: ' + JSON.stringify(tab) + '});});'
                });

            }

          });

          return true;
    };

    return new PageReloadTrigger;

})();
