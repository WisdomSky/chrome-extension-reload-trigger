/*!
 * chrome-extension-reload-trigger <https://github.com/WisdomSky/chrome-extension-reload-trigger>
 *
 * Copyright (c) 2018, Julian Paolo Dayag.
 * Licensed under the MIT License.
 */


(function(x) {
    if (module && module.exports) {
        module.exports = x;
    } else if (window) {
        window.XReloadTrigger = x;
    } else {
        return x;
    }
})((function() {

    if (_ == undefined) {
        _ = require('lodash');
    }

    var XReloadTrigger = function() {
        this.rules = [];
        this.nodeEnvCheck = true;
    };

    XReloadTrigger.prototype.disableNodeEnvCheck = function(val) {
        this.nodeEnvCheck = val;
    };


    /**
     * Create your own custom rule by passing a function that returns a boolean value.
     * The current tab object will be passed into the function.
     * 
     * @param Function resolver 
     */
    XReloadTrigger.prototype.matchCustom = function(resolver) {

        this.rules.push({
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
    XReloadTrigger.prototype.matchUrlPattern = function(pattern) {

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
    XReloadTrigger.prototype.matchUrl = function(url) {

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
    XReloadTrigger.prototype.validate = function(tab) {

        return this.rules.reduce(function(accumulator, rule) {
            
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
    XReloadTrigger.prototype.init = function() {
        
        if (this.nodeEnvCheck && process != undefined && process.env != undefined && ['development', 'dev'].indexOf(String(process.env.NODE_ENV).trim().toLowerCase()) == -1) return false;

        var debouncedCallback = _.debounce(function(tab) {

            if (this.validate(tab)) {
                chrome.runtime.reload(); 
            } 

        }.bind(this), 50);

        chrome.extension.onMessage.addListener(function(data, sender, sendResponse){

            if (data.action == 'page-reload-trigger-start-inject') {
                debouncedCallback(data.tab);
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

    return new XReloadTrigger;

})());
