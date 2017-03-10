define(["require", "exports", "./kaon/async-measure", "./kaon/attributes", "./kaon/base", "./kaon/template", "./kaon/template", "./kaon/custom-element", "./kaon/property"], function (require, exports, async_measure_1, attributes_1, base_1, template_1, template_2, custom_element_1, property_1) {
    "use strict";
    exports.TemplateStamping = template_2.TemplateStamping;
    exports.template = template_2.template;
    exports.customElement = custom_element_1.customElement;
    exports.property = property_1.property;
    exports.KaonElement = async_measure_1.AsyncMeasureMixin(template_1.TemplateStampingMixin(attributes_1.Attributes(base_1.Kaon(HTMLElement))));
});
