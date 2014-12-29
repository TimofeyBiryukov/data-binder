# Data-Binder
Data-Binder is a simple data binder for binding a JavaScript object (a model) to a DOM elemnts.
It is using new Object.observe method and emulates it for older browsers.

## Start

    gulp

To start developing clone a repo and do gulp.
Gulp will concat files and put them in dist folder from there you can use data-binder.js and data-binder.min.js.
Then you can visit http://localhost:8000/example/ for exampels.

## Test
Run test:

    gulp test

### TODO: descripton

# Docs
<a name="DataBinder"></a>
##class: DataBinder
**Members**

* [class: DataBinder](#DataBinder)
  * [new DataBinder(model, [optNode])](#new_DataBinder)
  * [dataBinder.getModel()](#DataBinder#getModel)
  * [dataBinder.getChildren()](#DataBinder#getChildren)

<a name="new_DataBinder"></a>
##new DataBinder(model, [optNode])
Data Binder entery point

**Params**

- model `Object` - any JavaScript object
- \[optNode\] `Node` - document.body will be used as a default node

JS:

    var PostController = function () {
        this.title = 'Title';
        this.text = 'lorem...';
        this.showFull = false;
        this.click = function () {
            this.showFull = true;
        };
    };

    var post = new PostController();
    var element = document.getElementsByClassName('post')[0];
    var db = new DataBinder(post, element);

HTML:

    <div class="post">
        <h1 data-bind="title"></h1>
        <p data-bind="text" data-bind-show="showFull"></p>
        <button data-bind-click="click">Show full</button>
    </div>

<a name="DataBinder#getModel"></a>
##dataBinder.getModel()
**Returns**: `Object` - binded model
<a name="DataBinder#getChildren"></a>
##dataBinder.getChildren()
**Returns**: `Array` - child binders generated
