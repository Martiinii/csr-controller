# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- `crudTemplate` fetcher parameter is now mandatory

## [1.5.3] - 2023-03-20
### Changed
- `crudTemplate` now accepts one parameter, fetch function. Useful for Electron, where fetch is not available in main process.

## [1.5.2] - 2023-03-19
### Fixed
- Controller registry now allows to pass controller as second parameter.

## [1.5.1] - 2023-03-19
### Added
- Register module unit test

### Fixed
- Controller registry types

## [1.5.0] - 2023-03-19
### Added
- Added `$clone` method to controller. It is useful when sharing controllers in multiple projects with using different templates

### Changed
- When creating subcontrollers we don't need to provide template anymore. It is inherited by parent
- Controller `changeServer` method is now named `$changeServer` to make it visually stand out as internal method

## [1.4.10] - 2023-03-18
### Changed
- Fetcher and electron route can throw errors. It is useful when using `useSWR`, because it will be passed as error instead of data

## [1.4.9] - 2023-03-18
### Fixed
- Subcontrollers now shows in controller registry. It was caused by using `never` instead of `unknown`

## [1.4.8] - 2023-03-15
### Added
- Electron support: `withElectronInvokations` and `ipcTemplate`
- `badRequestResponse` with status `400` if handler throws error when executing

### Changed
- TypeScript compilation module to `CommonJS`

### Fixed
- Second generic of controller (create) doesn't need to extend CRUDBase
- controllerRegistry `register` function type when registering more than one controller (previosuly was of type any)

## [1.4.7] - 2023-03-05
### Added
- `server` param to fetcher
- `changeServer` to each controller

## [1.4.6] - 2023-03-05
### Fixed
- `read` and `index` methods are null when nothing was specified during controllerRegistry
- Registry subcontroller types when methods weren't provided during controller creation
- Fetcher when dataId was null

## [1.4.5] - 2023-03-05
### Added
- `index` to subcontrollers

### Changed
- fetcher, now accepts subcontroller without providing data
- Next.js api route first search for subcontrollers, then pass query param as id

## [1.4.4] - 2023-03-05
### Fixed
- Documentation
- Default values for controller's custom methods and subcontrollers

## [1.4.3] - 2023-03-05
### Added
- Custom methods inside controllers

### Fixed
- Template generics
- Passing props from controller to registry routes

## [1.4.2] - 2023-03-02
### Fixed
- Passing data down from controller to subcontrollers

## [1.4.1] - 2023-03-02
### Added
- Added req and res to middlewares

## [1.4.0] - 2023-03-01
### Added
- Subcontrollers
- Debug middleware

### Fixed
- Type augmentation for controllers

## [1.3.1] - 2023-02-22
### Added
- Scripts: copy, bundle, devRelease
- ES Linter

### Changed
- File structure
- package.json

### Fixed
- Circular dependencies

## [1.2.2] - 2023-02-19
### Fixed
- package.json 'files' from `lib` to `dist`

## [1.2.1] - 2023-02-19
### Added
- Readme file

### Fixed
- File declarations for entire project

## [1.2.0] - 2023-02-19
### Added
- Support for middleware
- Protected middleware

### Fixed
- Changelog versions

## [1.1.0] - 2023-02-19
### Added
- Changelog

## 1.0.1 - 2023-02-18
### Added
- Initial commit

[Unreleased]: https://github.com/Martiinii/csr-controller/compare/v1.5.3...HEAD
[1.5.3]: https://github.com/Martiinii/csr-controller/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/Martiinii/csr-controller/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/Martiinii/csr-controller/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/Martiinii/csr-controller/compare/v1.4.10...v1.5.0
[1.4.10]: https://github.com/Martiinii/csr-controller/compare/v1.4.9...v1.4.10
[1.4.9]: https://github.com/Martiinii/csr-controller/compare/v1.4.8...v1.4.9
[1.4.8]: https://github.com/Martiinii/csr-controller/compare/v1.4.7...v1.4.8
[1.4.7]: https://github.com/Martiinii/csr-controller/compare/v1.4.6...v1.4.7
[1.4.6]: https://github.com/Martiinii/csr-controller/compare/v1.4.5...v1.4.6
[1.4.5]: https://github.com/Martiinii/csr-controller/compare/v1.4.4...v1.4.5
[1.4.4]: https://github.com/Martiinii/csr-controller/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/Martiinii/csr-controller/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/Martiinii/csr-controller/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/Martiinii/csr-controller/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/Martiinii/csr-controller/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/Martiinii/csr-controller/compare/v1.2.2...v1.3.1
[1.2.2]: https://github.com/Martiinii/csr-controller/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/Martiinii/csr-controller/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Martiinii/csr-controller/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Martiinii/csr-controller/compare/v1.0.1...v1.1.0
