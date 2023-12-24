'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FieldElemWrapper = function (_React$Component) {
  (0, _inherits3['default'])(FieldElemWrapper, _React$Component);

  function FieldElemWrapper() {
    (0, _classCallCheck3['default'])(this, FieldElemWrapper);
    return (0, _possibleConstructorReturn3['default'])(this, (FieldElemWrapper.__proto__ || Object.getPrototypeOf(FieldElemWrapper)).apply(this, arguments));
  }

  (0, _createClass3['default'])(FieldElemWrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          name = _props.name,
          form = _props.form;

      form.domFields[name] = true;
      form.recoverClearedField(name);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _props2 = this.props,
          name = _props2.name,
          form = _props2.form;

      var fieldMeta = form.fieldsStore.getFieldMeta(name);
      if (!fieldMeta.preserve) {
        // after destroy, delete data
        form.clearedFieldMetaCache[name] = {
          field: form.fieldsStore.getField(name),
          meta: fieldMeta
        };
        form.clearField(name);
      }
      delete form.domFields[name];
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return FieldElemWrapper;
}(_react2['default'].Component);

exports['default'] = FieldElemWrapper;


FieldElemWrapper.propTypes = {
  name: _propTypes2['default'].string,
  form: _propTypes2['default'].shape({
    domFields: _propTypes2['default'].objectOf(_propTypes2['default'].bool),
    recoverClearedField: _propTypes2['default'].func,
    fieldsStore: _propTypes2['default'].shape({
      getFieldMeta: _propTypes2['default'].func,
      getField: _propTypes2['default'].func
    }),
    clearedFieldMetaCache: _propTypes2['default'].objectOf(_propTypes2['default'].shape({
      field: _propTypes2['default'].object,
      meta: _propTypes2['default'].object
    })),
    clearField: _propTypes2['default'].func
  }),
  children: _propTypes2['default'].node
};
module.exports = exports['default'];