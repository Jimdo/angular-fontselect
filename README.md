Angular Font-Selector
=====================

[![Build Status](https://travis-ci.org/Jimdo/angular-fontselect.png?branch=master)](https://travis-ci.org/Jimdo/angular-fontselect)

A fontselect directive for AngularJS

#### Directive:

	<jd-fontselect />


#### Provider Name

	jdFontselect


BUILD
-----

We assume you have [node.js](http://nodejs.org/) installed.  
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


DEMO
----

There is a Sandbox for building castles playing around.  

You need to [build this project successfully](#build) once.
If you want to see google fonts in the demo, you need to setup an 
[Google API KEY](#api-keys)

Then you can execute `grunt demo` and go to 
[http://localhost:8000/demo](http://localhost:8000/demo).


TEST
----

We use [Karma](http://karma-runner.github.io/) and
[Protractor](https://github.com/angular/protractor) for testing.  

Before the tests, you need to [build this project successfully](#build) once.

Note that the End to End tests require an [Google API KEY](#api-keys)

#### Unit Tests 
```sh
grunt test:unit
```

#### End to End Tests 
```sh
grunt test:e2e
```

#### Why not both ?
```sh
grunt test
```

#### Execute karma on every file change.
```sh
grunt watch:start
```


API KEYS
--------

#### For Development / Testing

The tests expect a valid API Key for Google Web fonts.

How to get one:
* Go to the [Google Developers Console](https://developers.google.com/fonts/docs/developer_api#Auth) and create a new project (or use an existing one if the font selection is part of it)
* Enable `APIs & auth` / `APIs` / `Web Fonts Developer API`
* Go to `APIs & auth` / `Credentials` and click on `CREATE NEW KEY` in the `Public API access` section.
* Copy your API key to the clipboard
* Set your key into the environment Variable
`export JD_FONTSELECT_GOOGLE_FONTS_API_KEY="__yourKeyHere__"`
The build and test tasks will then create a file named `tmp.apikeys.js` in the
project root and include it in the demos and tests.

#### In Production

You can provide your production API Keys by setting them as a constant in your application.

```js
angular.module('myApp', ['jdFontselect']).constant('jdFontselectConfig', {
	googleApiKey: '__yourKeyHere__'
});
```


LICENSE
-------

> The MIT License
> 
> Copyright (c) 2014 Jimdo GmbH http://jimdo.com
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
