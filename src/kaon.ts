import {AsyncMeasure} from './lib/async-measure.js';
import {Attributes} from './lib/attributes.js';
import {Constructor} from './lib/util.js';
import {Renderable} from './lib/renderable.js';
import {IncrementalJsx} from './lib/incremental-jsx.js';

export {AsyncMeasure} from './lib/async-measure.js';
export {Attributes} from './lib/attributes.js';
export {customElement} from './lib/custom-element.js';
export {Incremental} from './lib/incremental.js';
export {IncrementalJsx, createElement} from './lib/incremental-jsx.js';
export {property} from './lib/property.js';
export {Renderable} from './lib/renderable.js';

export const KaonElement  =
  AsyncMeasure(
  IncrementalJsx(
  <any>Attributes(
  Renderable(HTMLElement)))) as Constructor<AsyncMeasure & IncrementalJsx & Renderable & HTMLElement>;
