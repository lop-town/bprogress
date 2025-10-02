# BProgress

A slim progress bar inspired by NProgress.

**NProgress V2 and Next NProgress Bar become BProgress!**

## Migration from `nprogress-v2`

If you are using `nprogress-v2`, you can migrate to `@lop-town/bprogress-core` by following the [migration guide](https://bprogress.vercel.app/docs/migration).

## Installation

### Node.js

To install BProgress, run the following command:

```bash
npm install @lop-town/bprogress-core
```

### CDN

Use **unpkg**:

- JS: https://unpkg.com/@lop-town/bprogress-core/dist/index.global.js
- ESM: https://unpkg.com/@lop-town/bprogress-core/dist/index.js
- CSS: https://unpkg.com/@lop-town/bprogress-core/dist/index.css

Use **jsDelivr**:

- JS: https://cdn.jsdelivr.net/npm/@lop-town/bprogress-core/dist/index.global.js
- ESM: https://cdn.jsdelivr.net/npm/@lop-town/bprogress-core/dist/index.js
- CSS: https://cdn.jsdelivr.net/npm/@lop-town/bprogress-core/dist/index.css

### Integrations libraries

The following frameworks have a dedicated package for using BProgress:

- [React](https://www.npmjs.com/package/@lop-town/bprogress-react)
- [Next.js](https://www.npmjs.com/package/@lop-town/bprogress-next)
- [Remix](https://www.npmjs.com/package/@lop-town/bprogress-remix)
- [Vue](https://www.npmjs.com/package/@lop-town/bprogress-vue)

## Quick Start

### Import

#### CDN

Import CSS in your `index.html` file.

```html
<link
  rel="stylesheet"
  type="text/css"
  href="https://unpkg.com/@lop-town/bprogress-core/dist/index.css"
/>
```

Import JavaScript in your `index.html` file.

```html
<script type="module">
  import { BProgress } from 'https://unpkg.com/@lop-town/bprogress-core/dist/index.js';

  BProgress.configure({
    ...
  });
</script>
```

Or you can add `BProgressJS` as a global variable using the legacy include:

```html
<script src="https://unpkg.com/@lop-town/bprogress-core/dist/index.global.js"></script>
<script>
  const { BProgress } = BProgressJS;

  BProgress.configure({
    ...
  });
</script>
```

#### Node.js

```js
import '@lop-town/bprogress-core/css';
import { BProgress } from '@lop-town/bprogress-core';
```

### Basic Usage

Simply call `start()` and `done()` to control the progress bar.

```js
BProgress.start();
BProgress.done();
```

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/lop-town/bprogress/issues) or make a PR [here](https://github.com/lop-town/bprogress).

## LICENSE

MIT
