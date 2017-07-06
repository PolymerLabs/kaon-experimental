var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "kaon"], function (require, exports, kaon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let MiscElement = class MiscElement extends kaon_1.KaonElement {
        constructor() {
            super();
            this.bar = 123;
            this.foo = 'foo';
            this.baz = 1;
            this.plain = 'plain' + 'string';
            this.baz = performance.now();
            setInterval(() => {
                this.baz = performance.now();
            }, 100);
        }
    };
    __decorate([
        kaon_1.property(),
        __metadata("design:type", Number)
    ], MiscElement.prototype, "bar", void 0);
    __decorate([
        kaon_1.property(),
        __metadata("design:type", String)
    ], MiscElement.prototype, "foo", void 0);
    __decorate([
        kaon_1.property(),
        __metadata("design:type", Number)
    ], MiscElement.prototype, "baz", void 0);
    __decorate([
        kaon_1.property(),
        __metadata("design:type", String)
    ], MiscElement.prototype, "plain", void 0);
    __decorate([
        kaon_1.property(),
        __metadata("design:type", Array)
    ], MiscElement.prototype, "list", void 0);
    MiscElement = __decorate([
        kaon_1.customElement('x-misc'),
        kaon_1.template('#x-misc'),
        __metadata("design:paramtypes", [])
    ], MiscElement);
});
