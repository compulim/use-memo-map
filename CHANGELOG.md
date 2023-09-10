# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Added type-checking for test, by [@compulim](https://github.com/compulim), in PR [#16](https://github.com/compulim/use-memo-map/pull/16)
- Updates `tsconfig.json` to extend from [`@tsconfig/strictest`](https://npmjs.com/package/@tsconfig/strictest), by [@compulim](https://github.com/compulim), in PR [#16](https://github.com/compulim/use-memo-map/pull/16) and PR [#17](https://github.com/compulim/use-memo-map/pull/17)
   - Development dependencies
      - [`@testing-library/react@14.0.0`](https://npmjs.com/package/@testing-library/react)
      - [`@types/react-dom@18.2.7`](https://npmjs.com/package/@types/react-dom)
      - [`@types/react@18.2.21`](https://npmjs.com/package/@types/react)
      - [`esbuild@0.19.2`](https://npmjs.com/package/esbuild)
      - [`react-dom@18.2.0`](https://npmjs.com/package/react-dom)
      - [`react-test-renderer@18.2.0`](https://npmjs.com/package/react-test-renderer)
      - [`react@18.2.0`](https://npmjs.com/package/react)
      - [`typescript@5.2.2`](https://npmjs.com/package/typescript)

### Fixed

- Updated `exports` field to workaround [TypeScript resolution bug](https://github.com/microsoft/TypeScript/issues/50762), by [@compulim](https://github.com/compulim), in PR [#16](https://github.com/compulim/use-memo-map/pull/16)

## [0.0.3] - 2023-03-21

### Fixed

- Fixes [#8](https://github.com/compulim/use-memo-map/issues/8), exports typings through conditional exports, by [@compulim](https://github.com/compulim), in PR [#9](https://github.com/compulim/use-memo-map/pull/9)

### Changed

- Bump dependencies, by [@compulim](https://github.com/compulim), in PR [#7](https://github.com/compulim/use-memo-map-pull/7)
   - Production dependencies
      - [`@babel/runtime-corejs3@7.21.0`](https://npmjs.com/package/@babel/runtime-corejs3)
   - Development dependencies
      - [`@babel/cli@7.21.0`](https://npmjs.com/package/@babel/cli)
      - [`@babel/core@7.21.0`](https://npmjs.com/package/@babel/core)
      - [`@babel/plugin-transform-runtime@7.21.0`](https://npmjs.com/package/@babel/plugin-transform-runtime)
      - [`@babel/preset-typescript@7.21.0`](https://npmjs.com/package/@babel/preset-typescript)
      - [`@types/react@17.0.53`](https://npmjs.com/package/@types/react)
      - [`@typescript-eslint/eslint-plugin@5.53.0`](https://npmjs.com/package/@typescript-eslint/eslint-plugin)
      - [`@typescript-eslint/parser@5.53.0`](https://npmjs.com/package/@typescript-eslint/parser)
      - [`eslint-plugin-react@7.32.2`](https://npmjs.com/package/eslint-plugin-react)
      - [`eslint@8.34.0`](https://npmjs.com/package/eslint)
      - [`jest-environment-jsdom@29.4.3`](https://npmjs.com/package/jest-environment-jsdom)
      - [`jest@29.4.3`](https://npmjs.com/package/jest)
      - [`prettier@2.8.4`](https://npmjs.com/package/prettier)
      - [`typescript@4.9.5`](https://npmjs.com/package/typescript)

## [0.0.2] - 2023-01-03

### Changed

- Use [`use-ref-from`](https://npmjs.com/package/use-ref-from), by [@compulim](https://github.com/compulim) in PR [#2](https://github.com/compulim/use-memo-map/pull/2)

## [0.0.1] - 2023-01-02

### Added

- First public release
