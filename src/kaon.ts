import {AsyncMeasure} from './lib/async-measure.js';
import {Attributes} from './lib/attributes.js';
import {Constructor} from './lib/util.js';
import {Renderable} from './lib/renderable.js';
import { RenderHTML } from "./lib/render-html.js";

export {AsyncMeasure} from './lib/async-measure.js';
export {Attributes} from './lib/attributes.js';
export {customElement} from './lib/custom-element.js';
export {property} from './lib/property.js';
export {Renderable} from './lib/renderable.js';
export {html} from '../lit-html/lib/lit-html.js';

export const KaonElement  =
  AsyncMeasure(
  RenderHTML(
  <any>Attributes(
  Renderable(HTMLElement)))) as Constructor<AsyncMeasure & RenderHTML & Renderable & HTMLElement>;
