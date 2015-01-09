How to build, test and Contribute
=================================

First of all, nice to have you here. You're a beautiful person!

This document should help you getting started when you want to play around
with this project.  
If you run into any troubles, don't hesitate to open an
[issue](https://github.com/Jimdo/angular-fontselect/issues).


Dependencies
------------

We assume you have [node.js](http://nodejs.org/) installed.
For building, [ruby](https://www.ruby-lang.org/) and [bundler](http://bundler.io/)
are required since the typekit webfontloader needs to be compiled before
we can ship it.

We also recommend installing grunt-cli globally
```sh
npm install -g grunt-cli
```
If this is not possible, you can use `./node_modules/.bin/grunt`
instead of `grunt`.


Setup
-----

```sh
npm install
```

This will install npm packages, bower components, webdriver stuff for protractor
and initiate a first [build](#build).


Build
-----

```sh
grunt build
```

This builds the typekit webfontloader and our dist-files.  
Please do not check-in any of those files
(See [About PRs, dist files and releases](#about-prs-dist-files-and-releases)).

Demo/Sandbox
------------

```sh
grunt demo
```

The `--port` is changeable, defaults to 8000

You need to [build this project successfully](#build) once.  
If you want to see google fonts in the demo, you need to setup a
[Google API KEY](#api-keys).


Test
----

We use [Karma](http://karma-runner.github.io/) and
[Protractor](https://github.com/angular/protractor) for testing.  

Before the tests, you need to [build this project successfully](#build) once.  
Note that the End to End tests require a [Google API KEY](#api-keys).

#### Single run
```sh
# end to end and unit tests
grunt test
# only one of both
grunt test:unit
grunt test:e2e
```

#### Test driven development.
```sh
# end to end and unit tests
grunt tdd
# only one of both
grunt tdd:unit
grunt tdd:e2e
```

#### Options

__Browsers__

Both tasks take a `--browsers` option to specify the browser you want to test on.  
Chrome, Firefox and PhantomJS are fine.  
Try IE, Opera and Safari at your own risk - don't forget to install the launchers.  

Defaults Browsers:

	test:unit	Chrome,Firefox,PhantomJS
	test:e2e	Chrome
	tdd:unit	Chrome
	tdd:e2e		Chrome


__Reporters__

The Karma reporter can be customized using `--reporters`


Coverage
--------

Start a server to serve the coverage reports.

```sh
grunt coverage
```

The `--port` is changeable, defaults to 8000



Api Keys
--------

The tests expect a valid API Key for Google Web fonts.  
Get one from the [Google Developers Console](https://developers.google.com/fonts/docs/developer_api#Auth).  
Set it as an environment variable in your `.bashrc` with
`export JD_FONTSELECT_GOOGLE_FONTS_API_KEY="__yourKeyHere__"`

The build and test tasks will now create a file named `tmp.apikeys.js` in the
project root and include it in demos and tests.


About PRs, dist files and releases
----------------------------------

When opening a PR please exclude any changes on the `./dist` files.  
This will keep the git history clean and the dist files will always point to
the latest release.

Dist files are being auto-updated once a new release is made.
