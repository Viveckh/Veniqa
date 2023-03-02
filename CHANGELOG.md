# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixes
- UI misalignments mentioned in [#126](https://github.com/Viveckh/Veniqa/issues/126)

## [2.0.0]
### Fixes
- Order placed is now shown in the admin order page with pagination feature.
- Changed the logic to delete the products from the cart once the order has been placed.
- Docker container dynamic reload for servers failing is fixed. 
- Updated packages like Mongoose, MongoDB, Winston-MongoDB, Lodash and using unifiedTopology for db connections

### Added
- Added couple of new event emitters `dropInOriginalBucket` and `dropInDestinationBucket`.
- Added more documentation for events in the README.

### Changed
- Refactored the attributes addition modal for `management-server`.
- Changed the UI ports for local `docker-compose.yml` file to match with the outgoing port. 
  