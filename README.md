# Chrome Extension Reload Trigger

Getting straight to the point, what this thing does is to reload your chrome extension once you reload a target window or tab.

Sometimes, manually refreshing your chrome extension in the chrome extensions page [**chrome://extensions**](chrome://extensions) every after change is a really tiring task... So automation is a must!!!

There are existing solutions for this problem, but they are very hassle to implement and actually somehow their solution is weird and beats the purpose. Why would you create a bookmark and click that bookmark everytime there is a change??? or why would you open an another tab just to refresh the extension???

So why don't we just tell the extension to reload itself if the target window is about to reload? Isn't it a little easier and doesn't require much interaction than the other solutions?


## Purpose

If you are developing a chrome extension and everytime you have a change in your code, you don't need to go into the extensions page and manually reload the extension in order for your changes to reflect. 

You just need to refresh the target window and your extension will be able to detect it and automatically reloads and refreshes the content your extension.




## Install via NPM

    npm install chrome-extension-reload-trigger --save

## How to use

Reload the extension when any window is reloaded:

```javascript
    var XReloadTrigger = require('chrome-extension-reload-trigger');

    // if no rules are added before the init call the reloading of extension will trigger if any window is refreshed.

    // start
    XReloadTrigger.init();
```

or if you want to specify which window/windows:

```javascript
    var XReloadTrigger = require('chrome-extension-reload-trigger');

    // match url 
    XReloadTrigger.matchUrl('http://google.com');

    // match url using regex
    XReloadTrigger.matchUrlPattern(/https?:\/\/google\.com.*/);

    // using a callback function
    // You can check the documention for the list of properties in a Tab object
    // https://developer.chrome.com/extensions/tabs#type-Tab
    XReloadTrigger.matchCustom(function(tab) {

        if (tab.url == 'http://google.com') {
            return true;
        } else {
            return false;
        }

    });

    // start
    XReloadTrigger.init();
```

**NOTE** : *This code must be put inside your **background script** in order to work!*

## Webpack

By default, the module detects if the `NODE_ENV` variable exists and it will only execute if the environment is **development**. So if you compiled using the **production** flag, the reloading of the extension will not trigger when the target window refreshes, because the module will only work if the value of the environment variable is **development**.

But if you want the module to work even when your application is compiled for **production**, you can disable the check by adding this call into your code before firing the init function.

```javascript

    XReloadTrigger.disableNodeEnvCheck(true);

```

or in a full example:

```javascript
    var XReloadTrigger = require('chrome-extension-reload-trigger');

    XReloadTrigger.disableNodeEnvCheck(true);

    // start
    XReloadTrigger.init();
```

## Standalone

If you are not using node and a module bundler like webpack, you can directly include the `chrome-extension-reload-trigger.js` into your page. [Lodash](https://lodash.com/) is required so you need to include it as well before the module script.

```html
    <script src="//cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js"></script>
    <script src="chrome-extension-reload-trigger/chrome-extension-reload-trigger.js"></script>

    <script type="text/javascript">
    
        // match url 
        XReloadTrigger.matchUrl('http://google.com');

        // match url using regex
        XReloadTrigger.matchUrlPattern(/https?:\/\/google\.com.*/);

        // using a callback function
        // You can check the documention for the list of properties in a Tab object
        // https://developer.chrome.com/extensions/tabs#type-Tab
        XReloadTrigger.matchCustom(function(tab) {

            if (tab.url == 'http://google.com') {
                return true;
            } else {
                return false;
            }

        });

        // start
        XReloadTrigger.init();
    
    </script>

```

## Support and Contribution

If you are experiencing problems while using this module, you can issue at our github [repo](https://github.com/WisdomSky/chrome-extension-reload-trigger/issues).

If you want to contribute, you are free to send as a pull request anytime!