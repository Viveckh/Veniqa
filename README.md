# veniqa

Veniqa Client Dev: [![Netlify Status](https://api.netlify.com/api/v1/badges/db94f1df-1599-4500-9067-8e31878e3b53/deploy-status)](https://app.netlify.com/sites/dev-veniqa-client/deploys)

Veniqa Client PROD: [![Netlify Status](https://api.netlify.com/api/v1/badges/c95aadbb-cf5b-4e35-a86d-69646f345690/deploy-status)](https://app.netlify.com/sites/prod-veniqa-client/deploys)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Linting

For linting, put this in your VSCode settings.json

{
"eslint.autoFixOnSave": true,
"eslint.validate": [
{ "language": "html", "autoFix": true },
{ "language": "vue", "autoFix": true },
{ "language": "javascript", "autoFix": true },
{ "language": "javascriptreact", "autoFix": true }
],
"vetur.validation.template": false,
}
