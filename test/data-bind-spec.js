

describe('initial Data Binding', function () {
	var node = $('.dataBind');
	var model = {};

	model.foo = 'bar';
	model.num = 0;
	model.initCalled = 0;
	model.init = function () {
		this.initCalled += 1;
	};
	model.clickCalled = 0;
	model.click = function () {
		this.clickCalled += 1;
	};

	model.show = true;
	model.hide = true;

	new DataBinder(model, node);

	it('for string', function () {
		expect(node.find('[data-bind="foo"]').html()).toBe(model.foo);
	});

	it('for number', function () {
		expect(+node.find('[data-bind="num"]').html()).toBe(model.num);
	});

	it('calling init', function () {
		expect(model.initCalled).toBe(1);
	});

	it('calling click', function () {
		node.find('[data-bind-click="click"]').trigger('click');

		expect(model.clickCalled).toBe(1);
	});

	it('display bind show', function () {
		//expect(node.find('[data-bind-show="show"]')).toBeVisible(); // TODO: debug

		expect(node.find('[data-bind-show="show"]').css('display')).not.toBe('none');
	});

	it('bind hide', function () {
		//expect(node.find('[data-bind-hide="hide"]')).toBeHidden(); // TODO: debug

		expect(node.find('[data-bind-hide="hide"]').css('display')).toBe('none');
	});
});
