# PlayKit JS Playlist - plugin for the [PlayKit JS Player]

[![Build Status](https://github.com/kaltura/playkit-js-playlist/actions/workflows/run_canary_full_flow.yaml/badge.svg)](https://github.com/kaltura/playkit-js-playlist/actions/workflows/run_canary_full_flow.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://img.shields.io/npm/v/@playkit-js/playkit-js-playlist/latest.svg)](https://www.npmjs.com/package/@playkit-js/playkit-js-playlist)
[![](https://img.shields.io/npm/v/@playkit-js/playkit-js-playlist/canary.svg)](https://www.npmjs.com/package/@playkit-js/playkit-js-playlist/v/canary)

PlayKit JS Playlist is written in [ECMAScript6], statically analysed using [Typescript] and transpiled in ECMAScript5 using [Babel].

[typescript]: https://www.typescriptlang.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Prerequisites

The plugin requires [Kaltura Player] to be loaded first.

[kaltura player]: https://github.com/kaltura/kaltura-player-js

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-playlist.git
cd playkit-js-playlist
yarn install
```

### Building

Then, build the player

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-player.js"></script>
<!--Kaltura player-->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-playlist.js"></script>
<!--PlayKit playlist plugin-->
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var playerContainer = document.querySelector("#player-placeholder");
    var config = {
     ...
     targetId: 'player-placeholder',
     plugins: {
       playlist: {
       }
     }
     ...
    };
    var player = KalturaPlayer.setup(config);
    player.loadMedia(...);
  </script>
</div>
```

## Configuration
#### Configuration Structure

```js
//Default configuration
"playlist" = {};
//Plugin params
"playlist" = {
  expandOnFirstPlay?: boolean, // optional
  position?: string, // optional
  expandMode?: string, // optional
  playNextOnError?: boolean // optional
}
```

##

> ### config.expandOnFirstPlay
>
> ##### Type: `boolean`
>
> ##### Default: true
>
> ##### Description: if plugin should automatically open on first play.
>

##

> ### config.position
>
> ##### Type: `'right' | 'left' | 'top' | 'bottom'`
>
> ##### Default: `right`
>
> ##### Description: expand mode of side panel (‘alongside', ‘hidden’, 'over’, default 'alongside').
>

##

> ### config.expandMode
>
> ##### Type: `string`
>
> ##### Default: `alongside`
>
> ##### Description: expand mode of side panel (‘alongside', ‘hidden’, 'over’, default 'alongside').
>

##

> ### config.playNextOnError
>
> ##### Type: `boolean`
>
> ##### Default: true
>
> ##### Description: If entry playback fails the playlist will move playback to the next entry.
>

## Running the tests

The plugin uses `cypress` tool for e2e tests

```javascript
yarn run test
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-playlist/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
