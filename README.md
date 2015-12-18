# Kaon

Kaon is a very, very rough set of experiments with ES6, ES7+, and Web
Components.

It only works in recent versions of Chrome and isn't even pretending to be
production ready. It's not clear that many of the experiments in Kaon will bear
fruit. Please do not use it.

## Why

Kaon is a set of experiments and an exploration of what a web components
framework could look like in the near-ish future if it:

 * Took advantage of new and speculative JavaScript features, like class
   properties and decorators
 * Enabled pay-for-play by packaging features as mixins to be applied by element
   authors
 * Used JavaScript compilers like Babel if necessary or helpful
 * Assumed native implementation of web components
 * Used libraries like incremental-dom to achieve fast incremental DOM updates,
   and PolymerExpressions for expression evaluation
 * Used simple data-binding with one-way, top-down, ordered data-flow
 * Updated element state asynchronously, to batch DOM changes and to enable
   top-down data-flow while preserving OOP-style element APIs
 * Broke some previously fundamental assumptions about elements,
   list synchronous layout. In Kaon using APIs like offsetWidth requires care.
 * Used low-cost templating abstractions for control-flow, rather than custom
   template elements as control flow constructs.
 * Implemented the "constructor-call-trick" to enable user-defined ES6 class
   constructors

Kaon explores both syntax changes that could potentially be applied to Polymer
1.x, and behavior changes that might, or might not, fit with Polymer 1.x, but
could possibly influence future versions of Polymer or other web components
frameworks if they are shown to be successful.

While Kaon is essentially a grab bag of different experiments tied together, the
goals of each experiment are usually similar: to improve developer ergonomics,
reduce implementation complexity, and help keep developers on the fast path.

The big gambit is that async rendering and incremental DOM updates can provide
ergonomics and performance benefits. This is not at all certain, and it could be
that breaking synchronous layout is too big of a pill to swallow, or that
incremental-dom isn't fast enough for re-render-the-world style templating.

## Features

### JavaScript Classes and OOP for Elements

Custom elements ultimately must extend `HTMLElement`, JavaScript classes let us
express this explicitly:

```javascript
class MyElement extends HTMLElement {}

class MyButton extends HTMLButtonElement {}
```

We need to place Kaon on the prototype chain to implement certain features, like
attribute de-serialization, so Kaon is written as a mixin:

```javascript
class MyElement extends Kaon(HTMLElement) {}

class MyButton extends Kaon(HTMLButtonElement) {}
```

The style of mixins used in Kaon is described here:
https://github.com/justinfagnani/mixwith.js

Most of Kaon's features are optional and can mixed in individually:

```javascript
// An element with attribute deserialization and template stamping:
class MyElement extends TemplateStamping(Attributes(Kaon(HTMLElement))) {}
```

mixwith.js can help make the syntax nicer:

```javascript
// An element with attribute deserialization and template stamping:
class MyElement extends mix(HTMLElement).with(Kaon, Attributes, TemplateStamping) {}
```

`KaonElement` is provided with all the features already mixed into HTMLElement.

```javascript
// An element with attribute deserialization and template stamping:
class MyElement extends KaonElement {}
```

Kaon implements custom element lifecycle methods like createdCallback. Rather
than define new callbacks for element authors to use, standard method overriding
for elements and any further subclasses:

```javascript
class MyElement extends Kaon(HTMLElement) {
  createdCallback() {
    super.createdCallback();
    // custom initialization here
  }
}
```

#### Benefits

Compared to Polymer 1.0, using standard OOP practices and mixins eliminates the
need for behaviors and custom lifecycle methods (like `created`). It allows
authors to control when they call into framework code by the placement of
`super` calls. It reduces the number of new concepts introduced on top of
JavaScript OOP and standard web components.

#### Drawbacks

Developers must remember to call into the framework, like with
`super.createdCallback`, for their elements to work. However, this is normal in
OOP and could be checked with a linter.

### Class Properties, Type Annotations and Decorators for Properties

ES2017? class properties give us a standard syntax to declare properties,
instead of Polymer's `properties` block. Type annotations give us a standard
syntax for specifying the type of a property, useful for attribute
de-serialization. Decorators let users specify other metadata, and perform
transformations on properties.

`@property` transforms a property into a getter/setter pair that trigger
side-effects when the property is set. It can take an optional equality check
function to control whether a value triggers invalidation.

```javascript
class MyElement extends Kaon(HTMLElement) {
  @property @notify
  myProperty : String;

  @property(equality: identity)
  myImmutableValuedProperty : Object;
}
```

#### Benefits

Cleaner and standard syntax, which will compatible with more tools. Using
decorators for the property transformation encapsulates the accessor logic into
a single, relative simple function that can be composed with other decorators,
and works with user-defined getter/setter pairs.

#### Drawbacks

Non-standard, but there is a proposal.

### Dataflow and Rendering Updates

Databinding systems can be categorized on two axes: synchronous vs.
asynchronous, and ordered vs unordered.

|          | Synchronous | Asynchronous    |
|---------:|:-----------:|:---------------:|
|Ordered   | React       | Om, Kaon?       |
|Unordered | Polymer 1.0 | Polymer 0.5/MDV |

Part of the motivation for Kaon is to explore the Asynchronous+Ordered quadrant
within the web components ecosystem, to try to get the best of both worlds of
easy-to-reason about React-style dataflow, and OOP-style access and web
components standards of Polymer.

Also, the frameworks that do async rendering, like Om and Mercury tend to be the
fastest on benchmarks (though the validity of some of these benchmarks is
disputable).

#### React: Functional, Synchronous, Coordinated

React and similar approaches gain a lot of simplicity because of the functional
approach to DOM construction. React basically model components as a synchronous
render function from state to DOM. One major benefit is that component
composition essentially becomes function composition. When state is updated, the
render function is invoked, and thus its composed functions.

There are many benefits to this approach.

First, it's relatively easy to understand what happens and when. Components are
rendered top-down, and data flows top-down. A component starts rendering when
its render functions starts, and stops when the render function stops. This
means you can easily time it, set breakpoints, etc.

Second, it's easy to implement (modulo the Virtual DOM library to make the
updates fast).

The downside to the Reach approach is that it forces all components to have the
API `setProps(props)` - normal object-oriented access to fields and methods with
side-effects is discouraged. This is in tension with the web components model of
elements as objects that have the normal array of element APIs like properties,
methods and attributes.

#### Polymer 1.x: OO, Synchronous, Uncoordinated

Polymer takes a different approach: it synchronously updates state when setters
are called. Data flows up and down the tree, possibly triggering other data
updates along the way, which in turn flow up and down the tree...

This has a few problems:

  1. The ordering is difficult to reason about
  2. Data may be out of sync with related data due to the synchronous updates.
     Developers may need to write guards against this.

#### MDV: OO, Asynchronous, Uncoordinated

Polymer 0.5 and MDV used Object.observe, which was asynchronous and un-ordered.
This has major usability problems, as users expected their templates to be
evaluated in document order. A template/if with a guard condition couldn't
actually be used to guard against null in an expression within the template/if
because the expressions inside the template might update before the condition
itself.

#### Kaon: OO, Asynchronous, Coordinated

Kaon attempts to have the best of React-style coordinated updates and the
OOP-style APIs of web components. It does this by delaying side-effects of state
changes to a microtask. This lets synchronous state updates to occur and settle,
before the reconciliation task executes.

For a contrived example, imagine an element which represents a point on a unit
circle with `x` and `y` properties. `x` and `y` must meet specific constraints,
and updating either without updating both can lead the element to be in an
invalid state. By deferring property observers and DOM updates to a microtask,
a user of the element can synchronously set both `x` then `y` and observers
will not be called in between.

```javascript
class PointOnCircle extends Kaon(HTMLElement) {
  @property
  x : Number;

  @property
  y : Number;

  @observe('x', 'y')
  _validate(x, y) {
    if (!(x*x + y*y === 1) {
      this.showError();
    }
  }
}

// updates x, marks element as invalid and queues a reconciliation task
pointOnCircle.x = 1.0;
// updates y, defers to existing reconciliation task
pointOnCircle.y = 0.0;

// at a later microtask, pointOnCircle._validate is called, x and y are set
```

A generic tree-of-elements example:

    Elements:
                           +-----------+
                           |           |
                           |     A     |
                           |           |
                           +-----------+
                                 |
                  +-----------------------------+
                  |              |              |
            +-----------+  +-----------+  +-----------+
            |           |  |           |  |           |
            |     B     |  |     C     |  |     D     |
            |           |  |           |  |           |
            +-----------+  +-----------+  +-----------+
                  |
          +---------------+
          |               |
    +-----------+   +-----------+
    |           |   |           |
    |     E     |   |     F     |
    |           |   |           |
    +-----------+   +-----------+

When properties are set on A, the elements are always updated in order, each in
a separate microtask, A, B, C, D, E, F. If properties are set on B, only B and
its subtree update, in order of B, E, F.

### Benefits

  * Elements are "normal" objects with state, properties and methods. They don't
    have to try to be state-less functional objects like in React.
    Interoperability is enabled on this point.
  * The ordering of updates to elements is easy to understand
  * DOM updates are inherently batched
  * Because sync measurement is broken in this model, we can guard against it
    being called, and provide an async measurement API, keeping users on the DOM
    fast-path.

### Drawbacks

  * Breaks synchronous layout assumptions. If a property drive some DOM
    structure, changing the property won't update the DOM immediately, so layout
    measuring methods like `offsetHeight` won't work properly. This harms
    interoperabiltiy with code that assumes sync layout of HTML elements.
  * Events have to be handled carefully. The simplest solution is to always
    defer firing events until after layout so that they bubble up the correct
    DOM structure. This isn't always feasible for browser-fired events like
    mouse and focus. Mercury has apparently attacked this problem.
  * Two-way data-binding is difficult to impossible

### Performance

Queuing and de-queing microtasks has overhead. It's been measured to be in the
low single-digit microsecond on desktop Chrome. This is pretty small, but in a
large app there might be thousands of custom elements, adding up to milliseconds
of total overhead, potentially eating into frame budget.

There are a few things that mitigate this impact:

  1. It should be rare that the whole tree will update. Since Kaon supports
     custom equality checks and identity checks, it will be possible to prune
     updates to subtrees when their data hasn't changed. Kaon will play
     particularly well with immutable data models, much like Om.
  2. Updates can be flushed synchronously. If we know that no other code will
     mutate an element, we can reconcile it immediately after applying updates
     from within Kaon, skipping the microtasks altogether. This should be
     common: properties might be set on the root of the app, or the root of a
     section. This will have to schedule a microtask to be sure reconciliation
     occurs after all mutations, but from within that task all updates to the
     root's content are performed by Kaon (in observers or templating). Kaon can
     detect if any content elements perform async layout by default, and flush
     them in the correct order.

### Templating: incremental-dom and composable template

Kaon uses the stampino library for templating, which enables template
inheritance and composition.

See https://github.com/justinfagnani/stampino

Stampino uses incremental-dom for DOM mutations. This means that the general
approach to updates in to re-render the whole template and like incremental-dom
figure out which parts have changed and need updating. The templating system is
therefore pretty simple (stampino weighs in at ~200 lines and Kaon has a few
lines to call into it), should be fast (needs benchmarks!), and yet very
powerful.

Since stampino templating is a mixin, an element could choose to use another
template system. One idea is to provide a static template system with no
data-binding at all. This would be very, very cheap in terms of code size and
performance.

### Event handling

Kaon supports declarative event handlers. The handler is a Polymer expression,
which is evaluated when the event fires and has its `this` pointer set to the
current data-model, and `$event` property set to the event.

This approach means that declarative event handlers can call any JavaScript
method, even ones that don't receive events:

```html
  <input on-change="{{_setSomething($event.target.value)}}">
```

Handlers can call methods on the model:

```html
  <template type="repeat" items="{{animals}}">
    <button on-click="{{item.makeNoise()}}">Make Noise</button>
  </template>
```

### Observers

*Not Yet Implemented*

```javascript
class MyElement extends KaonElement {
  @property
  foo : String;

  @property
  bar : Number;

  @observe('foo', 'bar')
  bas(foo, bar) {
    return `foo is ${foo} and bar is ${bar}.`;
  }
}
```

### Two-way Data-binding

Kaon doesn't currently support two-way data-binding.

Kaon is intended to be used with unidirectional dataflow patterns. Elements that
modify data should fire an event which is handled by the owner of the data,
applied, and the new state is passed back down the tree. Flux and other
unidirectional data-store patterns should be applicable.

Kaon could however fire Polymer compatible property changed event, and so can
be compatible with Polymer's two-way data-binding.

Kaon could also listen to such events enabling two-way data-binding. This
could be provided via an optional mixin, like the other features.

## Development

Building Kaon requires Node 5.x

    $ cd kaon
    $ bower install
    $ npm install
    $ gulp

## Demos

There aren't much in the way of demos yet.

### Hello World:

    $ cd kaon
    $ gulp
    $ cd build
    $ polyserve

Open http://localhost:8080/components/build/test/test.html

### TodoMVC

TodoMVC is not yet complete, and probably requires more work on Kaon to be
fully implementable.

    $ cd kaon
    $ gulp
    $ cd build/demo/todomvc
    $ polyserve

Open http://localhost:8080/components/todomvc-kaon/
