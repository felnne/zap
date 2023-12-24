# Scoundrel

## Developing

### Local development environment

```
$ brew install nvm
$ nvm install --lts
$ node -v
$ npm install -g npm@latest
$ npm -v

$ git clone ...
$ cd scoundrel
$ npm install

$ npm run dev
```

### Local development IDE

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type checking

[TypeScript](https://www.typescriptlang.org) is used for typing. TypeScript doesn't recognise type information for 
`.vue` imports by default so the `tsc` CLI is replaced with `vue-tsc` for type checking. 

To explicitly check types:

```
$ npm run type-check
```

For use with VSCode, the 
[TypeScript Vue (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) plugin
is needed to make the TypeScript language service aware of `.vue` types.


### Linting

[ESLint](https://eslint.org/) is used for code linting:

```
npm run lint
```

### Code formatting

[Prettier](http://prettier.io) is used for code formatting:

```
npm run format
```

## Deployment

```
npm run build
```
