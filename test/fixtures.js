
var templates = {
	'dataBind':
		'<div data-bind="foo"></div>' +
		'<div data-bind="num"></div>' +
		'<div data-bind-init="init"></div>' +
		'<div data-bind-click="click">Click</div>' +
		'<div data-bind-show="show" style="display: none; width: 1px; height: 1px;">This should be visible</div>' +
		'<div data-bind-hide="hide">This should be hidden</div>',
	'bindInput':
		'<input type="text" data-bind="foo"/>' +
		'<input type="submit" data-bind-click="click"/>'
};

var fixtures = '';

for (var index in templates) {
	if (templates.hasOwnProperty(index)) {
		fixtures += '<div class="' + index + '">' + templates[index] + '</div>';
	}
}

//console.log(fixtures);

setFixtures(fixtures);
