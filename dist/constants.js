"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONDITION = exports.ACTION = exports.DECORATOR = exports.COMPOSITE = exports.Category = exports.ERROR = exports.RUNNING = exports.FAILURE = exports.SUCCESS = exports.STATE = exports.VERSION = void 0;
exports.VERSION = '0.2.3';
var STATE;
(function (STATE) {
    STATE[STATE["NONE"] = 0] = "NONE";
    STATE[STATE["SUCCESS"] = 1] = "SUCCESS";
    STATE[STATE["FAILURE"] = 2] = "FAILURE";
    STATE[STATE["RUNNING"] = 3] = "RUNNING";
    STATE[STATE["ERROR"] = 4] = "ERROR";
})(STATE = exports.STATE || (exports.STATE = {}));
exports.SUCCESS = STATE.SUCCESS;
exports.FAILURE = STATE.FAILURE;
exports.RUNNING = STATE.RUNNING;
exports.ERROR = STATE.ERROR;
var Category;
(function (Category) {
    Category["COMPOSITE"] = "composite";
    Category["DECORATOR"] = "decorator";
    Category["ACTION"] = "action";
    Category["CONDITION"] = "condition";
    Category["NONE"] = "";
})(Category = exports.Category || (exports.Category = {}));
exports.COMPOSITE = Category.COMPOSITE;
exports.DECORATOR = Category.DECORATOR;
exports.ACTION = Category.ACTION;
exports.CONDITION = Category.CONDITION;
//# sourceMappingURL=constants.js.map