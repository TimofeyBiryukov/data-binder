

describe('Using scope', function () {
    var node = $('.scope');

    var db0 = new DataBinder({
        foo: 'BAR_scope'
    }, node, 'scope');

    var db1 = new DataBinder({
        foo: 'BAR_node'
    }, node);

    it('two scopes set', function () {
        var tScope = node.find('[data-bind-scope="foo"]').html();
        var nScope = node.find('[data-bind="foo"]').html();

        expect(tScope).toBe(db0.getModel().foo);
        expect(nScope).toBe(db1.getModel().foo);
    });

    it('scope input change', function () {
        expect(node.find('input[data-bind-scope="foo"]').val()).toBe(db0.getModel().foo);
        expect(node.find('input[data-bind="foo"]').val()).toBe(db1.getModel().foo);
    });

    it('scope element cahnge', function () {
        node.find('input[data-bind-scope="foo"]').val('new_BAR_scope').trigger('change');
        node.find('input[data-bind="foo"]').val('new_BAR_node').trigger('change');

        console.log(node.find('input[data-bind-scope="foo"]').val());
        console.log(node.find('input[data-bind="foo"]').val());
        console.log(db0.getModel().foo);
        console.log(db1.getModel().foo);

        expect(db0.getModel().foo).toBe('new_BAR_scope');
        expect(db1.getModel().foo).toBe('new_BAR_node');
    });
});
