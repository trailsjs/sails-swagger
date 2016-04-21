"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = {
	test: function test(req, res) {
		var contact = Contact.testInstance();
		return res.status(200).jsonx(contact);
	}
};
module.exports = exports["default"];