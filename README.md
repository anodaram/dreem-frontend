[![Deploy dev CI](https://github.com/Cache2020/PRIVIweb/actions/workflows/deploy-dev.yml/badge.svg?branch=dev)](https://github.com/Cache2020/PRIVIweb/actions/workflows/deploy-dev.yml)

[![Deploy prod CI](https://github.com/Cache2020/PRIVIweb/actions/workflows/deploy-prod.yml/badge.svg?branch=prod)](https://github.com/Cache2020/PRIVIweb/actions/workflows/deploy-prod.yml)

# PRIVI Front-end
```

sudo npm cache clean -f
sudo npm install -g n
sudo n stable  # this installs the current stable version

```
## Installation and Running

To install the application, clone the project and install all dependencies:

```sh
$ yarn
```

To run the application, there are 4 options depending on the execution environment and target URL to connect to the back-end:

* Local front-end in https, connecting to local back-end in https:

```sh
$ HTTPS=true SSL_CRT_FILE=server.crt SSL_KEY_FILE=server.key REACT_APP_ENV='dev_ssl' npm start
```
* Local front-end in http, connecting to local back-end in http

```sh
$ REACT_APP_ENV='dev' yarn start
```

* Local front-end in http, connecting to server back-end in https

```sh
$ REACT_APP yarn start
```

* Production front-end in https, connecting to server back-end in https

```sh
$ REACT_APP yarn build
```

Please note that the above calling methods might vary depending on the Operating System:

For serious OS (Linux, MacOS):

```sh
$ REACT_APP_ENV='dev' yarn start
```

For non serious OS (Windows):

```sh
$ set "REACT_APP_ENV=dev" && yarn start
```

## Versioning

Please be aware on our Git methodology before pushing any change.

There are 3 basic levels of branches:

* `main` : Production branch, only to be managed by Project Leads

* `dev`: Integration branch, to push changes from your personal branch once they are approved by Project Leads

* `your_name`: Personal branch, to do all the development & testing

After cloning the project, the branches need to be refreshed:

```sh
$ git fetch
```

If your local branch is not yet created, you can proceed with:

```sh
$ git pull
$ git checkout -b your_name
```

Any developer should always use his/her personal branch, for instance, 'sergi'. Once Sergi has finished his development and it is everything working, he should commit all changes and pull the latest version from dev:

```sh
$ git checkout sergi
$ git pull origin dev
```

In case of any conflict, please contact your Project Leader. Then, all changes can optionally be pushed to the remote Sergi's branch for backup:

```sh
$ git push origin sergi
```

Afterwards, it is time to merge the changes with the local dev branch:

```sh
$ git checkout dev
$ git merge sergi
```

Finally, changes can be pushed to dev:

```sh
$ git push origin dev
```

And important, always come back to your local branch to continue with your developments:

```sh
$ git checkout sergi
```

ATTENTION! 'sergi' is an example. Please use your branch and not Sergi's one 😃

## Testing

Tests TBD

```sh
$ yarn test
```

## Technical Considerations

TBD
