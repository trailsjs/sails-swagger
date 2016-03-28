"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = {
	test: function test(req, res) {
		var group = Group.testInstance();
		return res.status(200).jsonx([group]);
	}
};
module.exports = exports["default"];