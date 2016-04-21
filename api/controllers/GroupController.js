export default {
	test (req, res) {
        let group = Group.testInstance();
		return res.status(200).jsonx([group]);
	}
}
