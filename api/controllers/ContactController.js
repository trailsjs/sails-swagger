export default {
	test (req, res) {
        let contact = Contact.testInstance();
		return res.status(200).jsonx(contact);
	}
}
