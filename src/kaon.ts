import {AsyncMeasure} from './lib/async-measure.js';
import {Attributes} from './lib/attributes.js';
import {Constructor} from './lib/util.js';
import {Renderable} from './lib/renderable.js';
import { RenderHTML } from "./lib/render-html.js";

export {AsyncMeasure} from './lib/async-measure.js';
export {Attributes} from './lib/attributes.js';
export {customElement} from './lib/custom-element.js';
export {property, initializeProperties} from './lib/property.js';
export {query, queryAll} from './lib/query.js';
export {Renderable} from './lib/renderable.js';
export {html} from '../lit-html/lib/lit-html.js';
export {observe} from './lib/observe.js';

export const KaonElementBase = 
  AsyncMeasure(
  RenderHTML(
  <any>Attributes(
  Renderable(HTMLElement)))) as Constructor<AsyncMeasure & RenderHTML & Renderable & HTMLElement>;

export class KaonElement extends KaonElementBase {
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
}
