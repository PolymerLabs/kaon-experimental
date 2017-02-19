import {customElement} from './kaon/custom-element';
import {property} from './kaon/property';
import {AsyncMeasure, AsyncMeasureMixin} from './kaon/async-measure';
import {Attributes} from './kaon/attributes';
import {Constructable} from './kaon/util';
import {Renderable} from './kaon/renderable';
import {Incremental} from './kaon/incremental';

export {AsyncMeasure} from './kaon/async-measure';
export {customElement} from './kaon/custom-element';
export {property} from './kaon/property';

export const KaonElement =
  AsyncMeasureMixin(
  Incremental(
  <any>Attributes(
  Renderable(HTMLElement))));
