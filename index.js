var Dispatcher = require('flux').Dispatcher;
var EventEmitter = require('events').EventEmitter;
var clone = require('clone');

var CHANGE_EVENT = 'change';
var VIEW_ACTION = 'VIEW_ACTION.';
var SERVER_ACTION = 'SERVER_ACTION.';

var Actions = function Actions(dispatcher, isServerAction) {
  var actionSource = isServerAction ? SERVER_ACTION : VIEW_ACTION;
  var propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
  var _this = this; // to make the code below clearer

  propertyNames.forEach(function (name) {
    if (typeof _this[name] === 'function' && name !== 'constructor') {
      _this[name] = _this[name].bind({
        _actionType: actionSource + name, // save for later dispatch below
        dispatch: function dispatch() {
          dispatcher.dispatch({
            type: this._actionType, // use the _actionType saved above
            args: arguments
          });
        }
      });
    }
  });
};

var Store = function (dispatcher, options) {
  this._actionHandlers = {};
  this._dispatcher = dispatcher,
  this.eventEmitter = new EventEmitter(),

  // Bind store to the callback, and register the callback with the dispatcher
  this.dispatchToken = dispatcher.register(function (action) {
    if (action.type in this._actionHandlers) {
      var defaultAction = action.type.replace(/\..*/, '.*'); // e.g. VIEW_ACTION.*
      if (defaultAction in this._actionHandlers) {
        this._actionHandlers[defaultAction].call(this);
      }
      var retval = this._actionHandlers[action.type].apply(this, action.args);
      if (retval !== false) { // no change event if handler returns false
        this.eventEmitter.emit(CHANGE_EVENT);
      }
    }
  }.bind(this));

  // Assign action handlers
  var assignHandlers = function (actionSource, handlers) {
    for (var actionType in handlers) {
      this._actionHandlers[actionSource + actionType] = handlers[actionType];
    }
  }.bind(this);
  assignHandlers(VIEW_ACTION, options.viewActionHandlers || {});
  assignHandlers(SERVER_ACTION, options.serverActionHandlers || {});
};

Store.prototype.waitFor = function (stores) {
  var tokens = stores.map(function (store) {
    return store.dispatchToken;
  });
  this._dispatcher.waitFor(tokens);
};

function connectToStores(React, Component, stores, onChangeName) {
  return React.createClass({
    componentDidMount: function () {
      this._isMounted = true;
      stores.forEach(function (store) {
        return store.eventEmitter.on(CHANGE_EVENT, this._onChange);
      }.bind(this));
    },

    componentWillUnmount: function () {
      this._isMounted = false;
      stores.forEach(function (store) {
        return store.eventEmitter.removeListener(CHANGE_EVENT, this._onChange);
      }.bind(this));
    },

    _onChange: function () {
      if (this._isMounted) {
        if (onChangeName) {
          // Call the onChange event handler
          this.refs.wrapped[onChangeName].apply(this.refs.wrapped);
        } else {
          this.forceUpdate();
        }
      }
    },

    render: function () {
      var props = this.props;
      if (onChangeName) {
        // Reference to the wrapped element for _onChange handler
				props = clone(props);
        props.ref = 'wrapped';
      }
      return React.createElement(Component, props);
    }
  });
}

module.exports = {
  Dispatcher: Dispatcher,
  Actions: Actions,
  Store: Store,
  connectToStores: connectToStores
};

