import {customElement} from './kaon/custom-element';
import {property} from './kaon/property';
import {AsyncMeasure, AsyncMeasureMixin} from './kaon/async-measure';
import {Attributes} from './kaon/attributes';
import {CustomConstructor} from './kaon/constructor';
import {Kaon} from './kaon/base';
import {TemplateStamping, TemplateStampingMixin} from './kaon/template';
import {Constructable} from './kaon/util';

export {AsyncMeasure} from './kaon/async-measure';
export {TemplateStamping, template} from './kaon/template';

export {customElement} from './kaon/custom-element';
export {property} from './kaon/property';

export const KaonElement =
  AsyncMeasureMixin(
  TemplateStampingMixin(
  <any>Attributes(
  Kaon(
  CustomConstructor(
  <any>HTMLElement)))));
