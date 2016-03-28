import * as decorators from './kaon/decorators';
import {AsyncMeasure, AsyncMeasureMixin} from './kaon/async-measure';
import {Attributes} from './kaon/attributes';
import {CustomConstructor} from './kaon/constructor';
import {Kaon} from './kaon/base';
import {TemplateStamping, TemplateStampingMixin} from './kaon/template';
import {Constructable} from './kaon/util';

export {AsyncMeasure} from './kaon/async-measure';
export {TemplateStamping, template} from './kaon/template';

export const property = decorators.property;
export const customElement = decorators.customElement;

export const KaonElement =
  AsyncMeasureMixin(
  TemplateStampingMixin(
  <any>Attributes(
  Kaon(
  CustomConstructor(
  <any>HTMLElement)))));
