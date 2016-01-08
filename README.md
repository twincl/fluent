## FluentJS

FluentJS is a tiny Flux implementation we’re using in our site [twincl.com](https://twincl.com). It has some good features:

- **Very tiny** - less than 100 lines of code.
- **ES2015 class-based**.
- **Can be used at server-side rendering**. (For example, all [twincl.com](https://twincl.com) pages can be rendered at server side by appending a `?ssr=1` query parameter.)
- **Makes your code very terse**. No more repetitive `emitChange`, `add/removeChangeListener`, `ActionTypes` constants, etc.
- As close to Facebook Flux pattern and as few magic as possible.
- Can be used with Facebook [**Flow**](http://flowtype.org/) **type checker** effectively. (For example, if you call an action creator or store method with wrong argument types, the Flow type checker will complain.)

If you already know Flux, a quick way to glimpse FluentJS is by looking at our [`fluent-chat`](https://github.com/twincl/fluent/tree/master/examples) example modified from the Facebook `flux-chat` code. This [commit](https://github.com/twincl/fluent/commit/32aab0b6ca32ddba01151f17fbf4ac029c0c06cb) shows the code changes. As you can see, lots of repetitive code were removed.

### Installation

To install FluentJS, type:

    npm install --save fluent-js

### Usage

See [this page](https://twincl.com/@arthurtw/*613/fluent-js-a-tiny-facebook-flux-library).

