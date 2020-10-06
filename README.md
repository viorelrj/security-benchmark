# General

This project is a desktop application developed in context of the `Cryptography and Securty` TUM course. The application is meant to:
* import [Nesus .audit policy files](https://www.tenable.com/downloads/download-all-compliance-audit-files) (Which provide OS security audit)
* Write a custom parser for `.audit` files and import it as a custom data structure
* Run OS audits based on imported files
* Add ability to enforce settings `failed` audit tests.

# Personal

I use this project as an opportunity to deepen my understanding of Angular. Here I experiment with `theming` best practices, build custom UI library, learn how to make a better separation of logic and get more comfortable with rxjs and angular internals.

# Implementation


The project is based on Angular 10 and Electron 9 (Typescript + SASS + Hot Reload) [Base repo](https://github.com/maximegris/angular-electron), which allows Angular to run as a desktop application

Currently runs with:

- Angular v10.0.14
- Electron v9.3.0
- Electron Builder v22.8.0

/!\ Hot reload only pertains to the renderer process. The main electron process is not able to be hot reloaded, only restarted.

/!\ Angular 10.x CLI needs Node 10.13 or later to work correctly.

## To build for development

- **in a terminal window** -> npm start
The command will open an electron window and browser window on localhost:4200 (though only the electron window has access to OS files)

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve`| Execute the app in the browser |
|`npm run build`| Build the app. Built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Built files are in the /dist folder. |


## E2E Testing

E2E Test scripts can be found in `e2e` folder.

|Command|Description|
|--|--|
|`npm run e2e`| Execute end to end tests |

Note: To make it work behind a proxy, you can add this proxy exception in your terminal  
`export {no_proxy,NO_PROXY}="127.0.0.1,localhost"`

