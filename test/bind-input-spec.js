

describe('data binding for inputs', function () {
	var node = $('.bindInput');
	var model = {};

	model.foo = 'bar';
	model.clickCount = 0;
	model.click = function () {
		this.clickCount += 1;
	};

	new DataBinder(model, node);

	it('text', function () {
		expect(node.find('[data-bind="foo"]').val()).toBe(model.foo);
	});

	it('view value getting changed', function () {
		node.find('[data-bind="foo"]').val('biz');
		node.find('[data-bind="foo"]').trigger('change');

		expect(model.foo).toBe('biz');
	});

	it('click submit', function () {
		node.find('[data-bind-click="click"]').trigger('click');

		expect(model.clickCount).toBe(1);
	});
});
