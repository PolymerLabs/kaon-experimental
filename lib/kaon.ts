import {mix} from 'mixwith';
import * as decorators from './kaon/decorators';
import {
  _readAttributes,
  _template,
  _properties,
  _constructor} from './kaon/symbols';
import {AsyncMeasure} from './kaon/async-measure';
import {Attributes} from './kaon/attributes';
import {Kaon} from './kaon/base';
import {CustomConstructor} from './kaon/constructor';
import * as templateLib from './kaon/template';

export const property = decorators.property;
export const template = templateLib.template;
export const customElement = decorators.customElement;

export const KaonElement = mix(HTMLElement).with(
  CustomConstructor,
  Kaon,
  Attributes,
  templateLib.TemplateStamping,
  AsyncMeasure
);
