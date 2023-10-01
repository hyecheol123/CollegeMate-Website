# CollegeMate Webpage

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

Repository for CollegeMate Webpage.

APIs are not yet published. Other APIs and API Docmentation repository will be listed here later.

## Scripts

Here is the list for npm/yarn scripts.
These are used to lint, test, build, and run teh code.

1. `lint`: lint the code.
2. `lint:fix`: lint the code and try auto-fix.
3. `dev`: Run webpack dev server
4. `build`: Build website based on the `browserslint`. (destination: `dist` Directory)

No tests are implemented.
To enforce code styling, inspect and lint the codes on commit and push.

## Dependencies/Environment

Developed and tested with `Ubuntu 22.04.3 LTS` and `Node v18.17.1`.

TypeScript React Development environment is set up manually with `ESLint`, `Prettier`, `WebPack`, and `Babel`, rather than using ohter Boilerplate codes (such as `create-react-app`).
For Code styling rules and deploy configurations, please refer to the setup files.

Used `React 18.2.0` and `React Router 6.16.0`.
Also utilize `Material UI (MUI) Library (v5.14.11)` for elegant design.