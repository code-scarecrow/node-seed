# 🦘 Seed Changelog

## [Unreleased]

## [2.0.0] - 2025-01-27

### Added

- Added support for Node 22 version
  - Updated to @pickit/base 3.0.0 version
  - Updated to @pickit/logger2 1.5.0 version
  - Updated to @pickit/base-tests 1.1.2 version
  - Updated to @golevelup/nestjs-rabbitmq 4.1.0 version
  - Updated to @liaoliaots/nestjs-redis 10.0.0 version
  - Updated to @nestjs/axios 3.1.2 version
  - Updated to @nestjs/common 10.4.13 version
  - Updated to @nestjs/config 3.3.0 version
  - Updated to @nestjs/core 10.4.13 version
  - Updated to @nestjs/microservices 10.4.13 version
  - Updated to @nestjs/platform-express 10.4.13 version
  - Updated to @nestjs/swagger 8.0.7 version
  - Updated to @nestjs/typeorm 10.0.2 version
  - Updated to @nestjs/cli 10.4.8 version
  - Updated to @nestjs/schematics 10.2.3 version
  - Updated to @nestjs/testing 10.4.13 version
  - Updated to @types/node 22.10.10 version
  - Updated to axios 1.3.1 version
- New Redis client with object support
- Added debug config for unit and integration testing
- Added MySQL support for integration tests
- Added npm install in dev container post creation command
- Added no implicit override rule to tsconfig.json
- Added not found endpoint e2e test
- Improved pipeline build time
  - Implemented parallel steps
  - Optimized step sizes

### Changed

- Updated devcontainer.json

### Removed

- Removed SQLite support for integration tests
- Removed GetCompatibleColumnType
- Removed better-sqlite3 dependency

### Fixed

- Fixed typo in application dir

### Security

- Updated to @aws-sdk/client-s3 3.735.0 version
- Updated to @aws-sdk/s3-request-presigner 3.735.0 version
- Updated to ts-loader 9.5.2 version
- Updated to tsarch 5.4.1 version

## [1.2.0] - 2024-09-16

### Changed

- Updated to Node 18 version
  - Updated @pickit/logger2 version to 1.4.1
  - Updated @pickit/base version to 2.3.15
- Removed TEST_URL constant
- Improved GetInfo.e2e test
- Removed naming convention rule from .eslintrc
- Removed default rule for naming convention in .eslintrc
- Core url by country simplification

### Fixed

- DATABASE_PORT variable removed
- Fixed test:arch
- Fixed Dockerfile
- Added missing axios adapter reset after each test
- Deleted duplicated line in ProcessUserCreateMessage.e2e test

## [1.1.0] - 2024-05-14

### Added

- Improve RabbitMQ implementation
- Improve unit of work implementation
  - Methods initTransaction and completeTransaction where removed
  - Instead of them we will use runSafe, wich provides automatic conection release on erros
- Added linter rule: 'require-await'
- Added new folder in unit tests for mocks
- Removed IQueueBrokerConfig and replaced with RabbitMQConfig from golevelup
- Event publisher client addded
- Added architecture tests for cross infrastructure dependencies
- Simplified Log config
- Moved safeGetConfig to pkt-base
- Added @typescript-eslint/no-unnecessary-condition
- Added @typescript-eslint/no-floating-promises
- Added @typescript-eslint/no-shadow
- Added @typescript-eslint/naming-convention !!!!!!
- Added function-name/starts-with-verb
- Added no-nested-ternary
- Added folders/match-regex
- Redo testing infrastructure moks!!!:
  - All infrastructures mock follow same structure
  - DynamoDB was reimplemented for tests:e2e and local development
  - DynamoDB don't need terraform anymore
  - DynamoDB don't need java installed in local machine (or pipeline)
  - Removed RedisConfigTest as was not necessary
- TypeOrm Updated from 0.3.17 to 0.3.20
- Moved RabbitMQ base classes to pkt-base
- Removed MsResponse
- Implemented pkt-base-test
  - Removed @pickit/rabbitmq-presset
- Added suport for S3
- Moved DB basic classes to pkt-base
- Improve Pipeline build times!!
  - More memmory to build step
  - Time reduction from 30 mins to 7 mins

### Fixed

- Removed health-check endpoint logs
- Removed jest fron linter env
- Added await to BaseTypeOrmRepository.delete
- Integration tests for RMQ now uses the whole pipeline
- Fixed logger imports
- Removed old IsBefore decorator, moved to pkt-base
- Replaced node cache in pipelines with nodemodules artifact
- Implemented pkt-base error handler
- Fixed opened connection in tests
- Removed migrations from linter folder
- Fixed path in dockerfile

## [1.0.0] - 2024-02-01

### Added

- Added docker multy stage to improve build times
- Removed env files, now we use environmental variables for configs
  - Removed clases for managing env files
  - Added local variables to docker compose
- Added new linter rule to avoid default exports
- Added Index for services and controllers
- Added Seed version
  - Added /info endpoint
- Added esModuleInterop config to avoid using "\* as"

### Fixed

- Changed sonar pipe param Dsonar.typescript.lcov.reportPaths -> Dsonar.javascript.lcov.reportPaths
  - Dsonar.typescript.lcov.reportPaths was deprecated
- removed custom user from docker compose (used only in macs)
- Removed entrypoint.sh (unused file)
- Removed apps and libs from tested files
- Removed "rest" postfix from migrations name
- Added async methods to TestDatasetSeed
- Replaced HttpStatusCodes Enum from aws-sdk/clients/lambda to @nestjs/common
