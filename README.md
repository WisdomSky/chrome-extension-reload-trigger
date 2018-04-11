## Chrome Extension Reload Trigger

Getting straight to the point, what this thing does is to reload your chrome extension once you reload a target window or tab.

Sometimes, manually refreshing your chrome extension in the [chrome extensions page](chrome://extensions) every after change is a really tiring task... So automation is a must!!!

There are existing solutions for this problem, but they are very hassle to implement and actually somehow their solution is weird and beats the purpose. Why would you create a bookmark and click that bookmark everytime there is a change??? or why would you open an another tab just to refresh the extension???

So why don't we just tell the extension to reload itself if the target window is about to reload? Isn't it a little easier and doesn't require much interaction than the other solutions?

### Install

    npm install chrome-extension-reload-trigger --save

### How to use

Reload the extension when any window is reloaded:

```javascript
    var ReloadTrigger = require('chrome-extension-reload-trigger');

    // start
    ReloadTrigger.init();
```

or if you want to specify which window/windows:

```javascript
    var ReloadTrigger = require('chrome-extension-reload-trigger');

    // match url 
    PageReloadTrigger.matchUrl('http://google.com');

    // match url using regex
    PageReloadTrigger.matchUrlPattern(/https?:\/\/google\.com.*/);

    // using a callback function
    PageReloadTrigger.matchCustom(function(tab) {

        if (tab.url == 'http://google.com') {
            return true;
        } else {
            return false;
        }

    });

    // start
    ReloadTrigger.init();
```

**NOTE** : *This code must be put inside your **background script** in order to work!*