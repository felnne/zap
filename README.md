# Zap ⚡️

## Developing

### Local development environment

```
$ brew install nvm
$ nvm install --lts
$ node -v
$ npm install -g npm@latest
$ npm -v

$ git clone https://gitlab.data.bas.ac.uk/felnne/zap.git
$ cd zap
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

## License

Copyright (c) 2021-2023 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
