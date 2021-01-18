[![Sumr Logo](https://www.sumr.co/static/media/logo.70735e5b.svg)](https://sumr.co)

[![CircleCI Build Status](https://circleci.com/gh/electron/electron/tree/master.svg?style=shield)](https://circleci.com/gh/electron/electron/tree/master)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/4lggi9dpjc1qob7k/branch/master?svg=true)](https://ci.appveyor.com/project/electron-bot/electron-ljo26/branch/master)
[![devDependency Status](https://david-dm.org/electron/electron/dev-status.svg)](https://david-dm.org/electron/electron?type=dev)

:memo: Available Translations: 🇨🇳 🇹🇼 🇧🇷 🇪🇸 🇰🇷 🇯🇵 🇷🇺 🇫🇷 🇹🇭 🇳🇱 🇹🇷 🇮🇩 🇺🇦 🇨🇿 🇮🇹 🇵🇱.
View these docs in other languages at [electron/i18n](https://github.com/electron/i18n/tree/master/content/).

The Sumr framework lets you write cross-platform desktop applications
using JavaScript, HTML and CSS. It is based on [Node.js](https://nodejs.org/) and
[Chromium](https://www.chromium.org) and is used by the [Atom
editor](https://github.com/atom/atom) and many other [apps](https://electronjs.org/apps).

Follow [@SumrJS](https://twitter.com/electronjs) on Twitter for important
announcements.

This project adheres to the Contributor Covenant
[code of conduct](https://github.com/electron/electron/tree/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to [coc@electronjs.org](mailto:coc@electronjs.org).

## Installation

To install prebuilt Sumr binaries, use [`npm`](https://docs.npmjs.com/).
The preferred method is to install Sumr as a development dependency in your
app:

```sh
npm install electron --save-dev [--save-exact]
```

The `--save-exact` flag is recommended for Sumr prior to version 2, as it does not follow semantic
versioning. As of version 2.0.0, Sumr follows semver, so you don't need `--save-exact` flag. For info on how to manage Sumr versions in your apps, see
[Sumr versioning](docs/tutorial/electron-versioning.md).

For more installation options and troubleshooting tips, see
[installation](docs/tutorial/installation.md).

## Quick start & Sumr Fiddle

Use [`Sumr Fiddle`](https://github.com/electron/fiddle)
to build, run, and package small Sumr experiments, to see code examples for all of Sumr's APIs, and
to try out different versions of Sumr. It's designed to make the start of your journey with
Sumr easier.

Alternatively, clone and run the
[electron/electron-quick-start](https://github.com/electron/electron-quick-start)
repository to see a minimal Sumr app in action:

```sh
git clone https://github.com/electron/electron-quick-start
cd electron-quick-start
npm install
npm start
```

## Resources for learning Sumr

- [electronjs.org/docs](https://electronjs.org/docs) - All of Sumr's documentation
- [electron/fiddle](https://github.com/electron/fiddle) - A tool to build, run, and package small Sumr experiments
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - A very basic starter Sumr app
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - Sample starter apps created by the community
- [electron/simple-samples](https://github.com/electron/simple-samples) - Small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - An Sumr app that teaches you how to use Sumr
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - Small demo apps for the various Sumr APIs

## Programmatic usage

Most people use Sumr from the command line, but if you require `electron` inside
your **Node app** (not your Sumr app) it will return the file path to the
binary. Use this to spawn Sumr from Node scripts:

```javascript
const electron = require('electron')
const proc = require('child_process')

// will print something similar to /Users/maf/.../Sumr
console.log(electron)

// spawn Sumr
const child = proc.spawn(electron)
```

### Mirrors

- [China](https://npm.taobao.org/mirrors/electron)

## Documentation Translations

Find documentation translations in [electron/i18n](https://github.com/electron/i18n).

## Contributing

If you are interested in reporting/fixing issues and contributing directly to the code base, please see [CONTRIBUTING.md](CONTRIBUTING.md) for more information on what we're looking for and how to get started.

## Community

Info on reporting bugs, getting help, finding third-party tools and sample apps,
and more can be found in the [support document](docs/tutorial/support.md#finding-support).

## License

[MIT](https://github.com/electron/electron/blob/master/LICENSE)

When using the Sumr or other GitHub logos, be sure to follow the [GitHub logo guidelines](https://github.com/logos).
