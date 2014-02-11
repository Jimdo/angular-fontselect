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

We assume you have [node.js](http://nodejs.org/) installed.  
We recommend a global installation of [grunt-cli](https://github.com/gruntjs/grunt-cli)
if you want to test, build and distribute with grunt.  
For building, [ruby](https://www.ruby-lang.org/) and [bundler](http://bundler.io/) are required
since the typekit webfontloader needs to be compiled before we can ship it. 

Once this dependencies are met, you can simply run:

```sh
npm install
```


If you want to rebuild the dist-files to add your changes, run:

```sh
grunt       #with tests
grunt build #without tests
```


Testing
-------

[Karma](http://karma-runner.github.io/) and
[Protractor](https://github.com/angular/protractor) for testing.  

Karma should work, once the build task is working.  
```sh
grunt test:unit
```

Protractor needs a webdriver-server and a web-server to run.
```sh
./servers.sh   # Start servers
grunt test:e2e # Execute protractor tests
```

Other testing commands
```sh
grunt test # Execute karma and protractor
```

```sh
grunt watch:start # Execute karma on every file change.
```


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

You need to [build this project successfully](#building)
Then you can execute `./servers.sh` and enjoy the magique.


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
