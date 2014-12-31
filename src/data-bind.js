

/**
 * Data Binder entry point
 * @param {!Object} model any JavaScript object
 * @param {Node=} optNode document.body will be used as a default node
 * @param {string=} optScope
 * @constructor
 */
var DataBinder = function (model, optNode, optScope) {

	/**
	 *
	 * @type {!Object}
	 * @private
	 */
	this.__model = model;


	/**
	 *
	 * @type {HTMLElement}
	 * @private
	 */
	this.__node = optNode || document.body;


	if (!(this.__node instanceof HTMLElement)) {
		if (this.__node[0] instanceof HTMLElement) {
			this.__node = this.__node[0];
		} else {
			throw 'Second parameter must be a valid HTMLElement';
		}
	}


	/**
	 *
	 * @type {string}
	 * @private
	 */
	this.__scope = optScope || '';


	/**
	 *
	 * @type {Array}
	 * @private
	 */
	this.__childBinders = [];


	/**
	 *
	 * @type {string[]}
	 * @enum
	 * @private
	 * @const
	 */
	this.__INPUT_TYPES = ['INPUT', 'TEXTAREA', 'SELECT'];


	/**
	 *
	 * @enum
	 * @private
	 */
	this.__TYPES = {
		SHOW: 'show',
		HIDE: 'hide',
		REPEAT: 'repeat',
		CLICK: 'click',
		INIT: 'init'
	};


	/**
	 *
	 * @type {Window.Mustache|*}
	 * @private
	 */
	this.__templater = Mustache;


	/**
	 *
	 * @private
	 */
	this.__template = this.__node.innerHTML;


	this.__templater.parse(this.__template);

	this.__renderHTML();

	this.__bindModel();
	this.__bindView();
	this.__update();
};


/**
 *
 * @return {Object} binded model
 */
DataBinder.prototype.getModel = function () {
	return this.__model;
};


/**
 *
 * @return {Array} child binders generated
 */
DataBinder.prototype.getChildren = function () {
	return this.__childBinders;
};


/**
 *
 * @private
 */
DataBinder.prototype.__bindModel = function () {
	var self = this;

	this.__observer(function (values) {
		self.__find(self.__buildSelector(values)).each(function () {
			var value;
			var $this = $(this);

			if ($this.data(self.__buildDataKey(self.__TYPES.SHOW))) {
				self._bindShow($this);
			} else if ($this.data(self.__buildDataKey(self.__TYPES.HIDE))) {
				self._bindHide($this);
			}

			if ($this.data(self.__buildDataKey(self.__TYPES.REPEAT))) {
				self._bindRepeat($this);
			}

			if ($this.data(self.__buildDataKey())) {
				value = self.__model[self.__buildDataKey()];

				if (self.__INPUT_TYPES.indexOf(this.nodeName) !== -1) {
					$this.val(value);
				} else {
					$this.html(value);
				}
			}
		});
	});
};


/**
 *
 * @private
 */
DataBinder.prototype.__bindView = function () {
	var self = this;

	this.__find(this.__buildSelector()).each(function () {
		var $this = $(this);

		for (var index in $this.data()) {
			self['_' + index]($this);
		}
	});
};


/**
 *
 * @private
 */
DataBinder.prototype.__update = function () {
	var tmp;

	for (var index in this.__model) {
		if (this.__model.hasOwnProperty(index)) {
			tmp = this.__model[index];
			this.__model[index] = undefined;
			this.__model[index] = tmp;
		}
	}
};


/**
 *
 * @private
 */
DataBinder.prototype.__renderHTML = function () {
	this.__populateModel();
	this.__node.innerHTML = this.__templater.render(this.__template, this.__model);
};


/**
 *
 * @private
 */
DataBinder.prototype.__populateModel = function () {
	var values = this.__template.match(/\{\{(.+)\}\}/g);

	if (values && values.length > 0) {
		for (var i = values.length - 1; i >= 0; i--) {
			var key = values[i].split('{{');
			key = key[key.length - 1].split('}}')[0];

			if (!this.__model.hasOwnProperty(key)) {
				this.__model[key] = values[i];
			}
		}
	}
};


/**
 *
 * @param {Object} values
 * @return {string}
 * @private
 */
DataBinder.prototype.__buildSelector = function (values) {
	var selector = [];

	if (values) {
		for (var i = 0; i < values.length; i ++) {
			var name = values[i].name;

			selector.push(this.__buildScope(name));
			selector.push(this.__buildScope(name, this.__TYPES.SHOW));
			selector.push(this.__buildScope(name, this.__TYPES.HIDE));
			selector.push(this.__buildScope(name, this.__TYPES.REPEAT));
		}
	} else {
		for (var index in this.__model) {
			if (this.__model.hasOwnProperty(index)) {
				if (typeof this.__model[index] === 'function') {
					selector.push(this.__buildScope(index, this.__TYPES.CLICK));
					selector.push(this.__buildScope(index, this.__TYPES.INIT));
				} else {
					selector.push(this.__buildScope(index));
					selector.push(this.__buildScope(index, this.__TYPES.SHOW));
					selector.push(this.__buildScope(index, this.__TYPES.HIDE));
				}
			}
		}
	}

	return selector.join();
};


/**
 *
 * @param {string} value
 * @param {string=} optType
 * @returns {string}
 * @private
 */
DataBinder.prototype.__buildScope = function (value, optType) {
	var type = optType || '';
	var tmp = ['data', 'bind'];

	if (type) {
		tmp.push(type);
	}

	if (this.__scope) {
		tmp.push(this.__scope);
	}

	return '[' + tmp.join('-') + '="' + value + '"]';
};


/**
 *
 * @param {string=} optType
 * @returns {string}
 * @private
 */
DataBinder.prototype.__buildDataKey = function (optType) {
	var type = optType || '';
	var tmp = ['bind'];

	if (type) {
		tmp.push(type);
	}

	if (this.__scope) {
		tmp.push(this.__scope);
	}

	return this.__toCamelCase(tmp.join('-'));
};


/**
 *
 * @param {string} input
 * @returns {string}
 */
DataBinder.prototype.__toCamelCase = function (input) {
	return input.toLowerCase().replace(/-(.)/g, function(match, group) {
		return group.toUpperCase();
	});
};


/**
 *
 * @param {string} input
 * @returns {string}
 * @private
 */
DataBinder.prototype.__fromCamelCase = function (input) {
	return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};


/**
 *
 * @param selector
 * @return {Array<jQuery>}
 * @private
 */
DataBinder.prototype.__find = function (selector) {
	return $(this.__node).find(selector).andSelf();
};


/**
 *
 * @param {Function} callback
 * @private
 */
DataBinder.prototype.__observer = function (callback) {
	Object.observe(this.__model, callback);
};


/**
 *
 * @param {jQuery} $this
 * @private
 */
DataBinder.prototype._bind = function ($this) {
	var self = this;

	$this.change(function () {
		self.__model[$(this).data().bind] = $(this).val();
	});
};


/**
 *
 * @param {jQuery} $this
 * @private
 */
DataBinder.prototype._bindClick = function ($this) {
	var self = this;

	$this.click(function () {
		self.__model[$(this).data().bindClick](this);
	});
};


/**
 *
 * @param {jQuery} $this
 * @private
 */
DataBinder.prototype._bindInit = function ($this) {
	this.__model[$this.data().bindInit]($this);
};


/**
 *
 * @param {jQuery} $this
 * @private
 */
DataBinder.prototype._bindRepeat = function ($this) {
	var element, node, model, dataBinder;
	var data = this.__model[$this.data().bindRepeat];
	var parent = $($this.parents()[0]);

	if (data) {
		for (var i = 0; i < data.length; i++) {
			element = data[i];
			node = $this.clone(true);
			model = element;

			if (typeof element !== 'object') {
				model = {value: element.toString()};
				node.data('bind', 'value');
			}

			parent.append(node);
			dataBinder = new DataBinder(model, node);
			this.__childBinders.push(dataBinder);
		}

		$this.remove();
	}
};


/**
 *
 * @param {jQuery} $this
 * @private
 */
DataBinder.prototype._bindHide = function ($this) {
	var hide = Boolean(this.__model[$this.data().bindHide]);

	if (!hide) {
		$this.css('display', 'block');
	} else {
		$this.css('display', 'none');
	}
};


/**
 *
 * @param {jQuery} $this
 * @private
 */
DataBinder.prototype._bindShow = function ($this) {
	var show = Boolean(this.__model[$this.data().bindShow]);

	if (show) {
		$this.css('display', 'block');
	} else {
		$this.css('display', 'none');
	}
};
