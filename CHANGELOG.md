# Changelog

<a name="next"></a>
## next

### Changed

- 🔧 Fix scripts [[455a59d](https://github.com/amoutonbrady/tiny-http/commit/455a59d54ff40d46699554af9bf7e7782e65e19c)]


<a name="0.7.0"></a>
## 0.7.0 (2021-05-02)

### Added

- ✨ Adding custom node instance [[d1b93ef](https://github.com/amoutonbrady/tiny-http/commit/d1b93efc9980e6c7a0f5e10cdd8eda631f7d2baf)]

### Changed

- ⬆️ Update dependencies [[0e4774c](https://github.com/amoutonbrady/tiny-http/commit/0e4774c68c42fcec99328ace62a8a119d7f271aa)]


<a name="0.6.0"></a>
## 0.6.0 (2021-04-27)

### Added

- ✨ Modernize the bundle to esm [[f96d9be](https://github.com/amoutonbrady/tiny-http/commit/f96d9bef92d7f41607c97953bba8c9e2af49c1a2)]
- ✨ Rewrote type signature &amp; made it more customizable [[6d04bcf](https://github.com/amoutonbrady/tiny-http/commit/6d04bcffbfa8407fc22b7181e4012da8c44ce5c3)]

### Changed

- 🔧 Replace yarn by pnpm [[c5602f8](https://github.com/amoutonbrady/tiny-http/commit/c5602f81b55d9d80293347834f53554c196f2670)]
- ⬆️ Update dependencies [[a004565](https://github.com/amoutonbrady/tiny-http/commit/a0045651c5bbc4fc225dfbb08a78da80a73854f0)]
- 🔧 Fix browser package [[cd99c87](https://github.com/amoutonbrady/tiny-http/commit/cd99c872e9a6b3cddf43ea8dc6cf68881b1fa046)]
- 🔧 Better format for browser [[bce8c1c](https://github.com/amoutonbrady/tiny-http/commit/bce8c1c13974a27154003b0224062279c731699b)]
- ⬆️ Update dependencies [[13b0f19](https://github.com/amoutonbrady/tiny-http/commit/13b0f1969b788b50f7b66d9bce32bcdbd878da0c)]
- 🔧 Fix prepack script for yarn 2 [[e7d44bd](https://github.com/amoutonbrady/tiny-http/commit/e7d44bd5b9543f25dd56ef36cbb7b894a8ac64b7)]

### Miscellaneous

- 🏷️ Fix body types 2 [[6f6b5d3](https://github.com/amoutonbrady/tiny-http/commit/6f6b5d3d0fb7585cfeef55a24bdf6cd16b3255ca)]
- 🏷️ Fix body types [[a271b35](https://github.com/amoutonbrady/tiny-http/commit/a271b3563cc7dddd497fe4068463850d5dae1a92)]
- 📝 Changelog [[bc9654f](https://github.com/amoutonbrady/tiny-http/commit/bc9654f0b6020e0658d58157290148470e04cf6e)]


<a name="0.4.0"></a>
## 0.4.0 (2020-11-07)

### Changed

- 🎨 Running prettier [[2a055ed](https://github.com/amoutonbrady/tiny-http/commit/2a055ede09de45c20b3c7cb14c981db5f665a7e0)]
- ⬆️ ➕ Adding prettier &amp; updating dev deps [[3ff83ec](https://github.com/amoutonbrady/tiny-http/commit/3ff83ece98e99bf8322fa4dcd2a05729b99a3a09)]
- 🔧 Mark package as sideeffect free [[c5b16d4](https://github.com/amoutonbrady/tiny-http/commit/c5b16d4c781337642a6cc5f785ec5e8d9f7d3fe6)]

### Removed

- 🔥 Remove unused packages [[e8ed7b8](https://github.com/amoutonbrady/tiny-http/commit/e8ed7b8ad81932f42207e43826bf88e9bcdf07bd)]


<a name="0.3.0"></a>
## 0.3.0 (2020-09-22)

### Added

- ✨ Adding real resolver &amp; catcher + differenciate json from responseType [[b87e01f](https://github.com/amoutonbrady/tiny-http/commit/b87e01fa1fb141a6d404cee4ccf24df6c3380933)]
- ✨ Add tests + improve API [[72c96f7](https://github.com/amoutonbrady/tiny-http/commit/72c96f725bbc0e85e7ac8f2dcb65ac010c2b0e1c)]
- 🎉 Initial commit [[1acd24c](https://github.com/amoutonbrady/tiny-http/commit/1acd24c61f94d5388e0f581d1ff311160cf747bc)]

### Changed

- 🎨 ✨ Refactor code and adding missing HTTP methods [[2ff4ae2](https://github.com/amoutonbrady/tiny-http/commit/2ff4ae25f5d4b2a39c50602e928d3d4b326e74ed)]
- 🔧 Reworked rollup bundle [[541b910](https://github.com/amoutonbrady/tiny-http/commit/541b910b7cfa2e27f906c14189dc38c0d547f56b)]
- ⬆️ Update dependencies [[7cc0327](https://github.com/amoutonbrady/tiny-http/commit/7cc032770a0d8f58adeda89d79154936d7dbecbc)]
- 💄 Cleanup some test code [[b47a406](https://github.com/amoutonbrady/tiny-http/commit/b47a406aa0d70ae82b1af8e463589a7428372bf3)]
- ⬆️ Update dependencies [[7970106](https://github.com/amoutonbrady/tiny-http/commit/7970106dc2c598fc74ea23c13619f3b16f992490)]
- 🔧 Prepare for publishing [[eafb369](https://github.com/amoutonbrady/tiny-http/commit/eafb3695d0340c8215af4f5121fa05e9e6e94958)]

### Removed

- 🔥 Droppping support for anything else than esm [[588b398](https://github.com/amoutonbrady/tiny-http/commit/588b398747bf7b1348f068237e28c765895bc881)]

### Fixed

- 🐛 Fix rollup input [[31c475c](https://github.com/amoutonbrady/tiny-http/commit/31c475ca5a4fc763101dc321f9b82d01859e25df)]
- 🐛 Stringify body on POST &amp; remove trailing &#x27;?&#x27; in no query params [[90fe9ba](https://github.com/amoutonbrady/tiny-http/commit/90fe9ba1c78d3579e1357cd3f2ab7d8ca5d62781)]
- 🐛 Fix a bug where query parameters weren&#x27;t properly cloned [[4786535](https://github.com/amoutonbrady/tiny-http/commit/4786535720021fe7ab1a90f88f5cf0b89c9089c9)]

### Miscellaneous

- 📦 Replaced pnpm with yarn 2 [[a2307f0](https://github.com/amoutonbrady/tiny-http/commit/a2307f05fbac77b00c92e9957a8ef3c80bb0abc1)]
- 📦 Remove source in package.json [[4390e5d](https://github.com/amoutonbrady/tiny-http/commit/4390e5d7dbff89fafd619164d49cc4afbf2f49ff)]
- 📝 Updating readme [[41dbdec](https://github.com/amoutonbrady/tiny-http/commit/41dbdec25ec9ed7b7bbbd7762f55ca3eee182c82)]
- 📝 Improve readme [[562a83f](https://github.com/amoutonbrady/tiny-http/commit/562a83fb791f6d592c45fece836f22b847df8f3f)]
- 📝 Adding release and size to keep monitoring it [[0c25beb](https://github.com/amoutonbrady/tiny-http/commit/0c25bebc74d053413d70ebc91558e1774c21de0a)]


