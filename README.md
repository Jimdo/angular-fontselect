Angular Font-Selector
=====================

[![Build Status](https://magnum.travis-ci.com/Jimdo/angular-fontselect.png?token=QVKuqZGwRrn1qkuX6PH1&branch=v0.0.12)](https://magnum.travis-ci.com/Jimdo/angular-fontselect)

A fontselect directive for AngularJS

Directive:
----------

	<jd-fontselect />


Provider Name
-------------

	jdFontselect


Building
--------

We use [Grunt](http://gruntjs.com/) for building and
[Karma](http://karma-runner.github.io/) and
[Protractor](https://github.com/angular/protractor) for testing.  
Before you can use the `grunt` command you need to install our
npm package dependencies and bower components by executing

	npm install
	bower install


Then you should be able to execute the following commands:

__Complete build:__ `grunt`

__All tests without build:__ `grunt test`

__Watch and test on every file change:__ `grunt watch:start`

__Run e2e tests:__ `grunt test:e2e`


API KEYS
--------


#### For Development / Testing

The tests expect a valid API Key for Google Web fonts.
[Get one](https://developers.google.com/fonts/docs/developer_api#Auth)

You should set your key into the environment Variable
`JD_FONTSELECT_GOOGLE_FONTS_API_KEY="__yourKeyHere__"`
The build and test tasks will then create a file named `tmp.apikeys.js` in the
project root and include it in the demos and tests.

#### In Production

You can provide your production API Keys by setting them as constants no your application.

```js
angular.module('myApp', ['jdFontselect']).constant('jdFontselectConfig', {
	googleApiKey: '__yourKeyHere__'
});
```

Demo
----

There is a Sandbox for building castles playing around.  
In the projects root folder execute `node scripts/web-server.js`

Then go to [http://localhost:8000/demo/index.html](http://localhost:8000/demo/index.html)
in your favorite browser.


End to End Testing
------------------

Make sure you have a silenium standalone server running at port 4444  
See [protractor README](https://github.com/angular/protractor/blob/master/README.md) 
for details.

Start the build in webserver with `node-dev scripts/web-server.js`

Execute `grunt test:e2e`


About Khmer
-----------

There are several google web fonts, supporting the khmer subset
but the Typekit Webfont Loader does not support them, so we're skipping
them, too.


Todo
----

* Move subset selection into own global service and provide a special directive for it.

* Make the font sources (google fonts, websafe, evetually typekit someday) checkboxes which you can activated or deactivate

* the directive should always generate the seach for fonts input field with the placeholder ="current font"

* toggle button will hide .jdfs-toggle and show .jdfs-search and put focus inside .jdfs-search





Future Features
---------------

* We'd like to have the ability to filter/extend the font collection per directive.
