import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';

var FieldElemWrapper = function (_React$Component) {
  _inherits(FieldElemWrapper, _React$Component);

  function FieldElemWrapper() {
    _classCallCheck(this, FieldElemWrapper);

    return _possibleConstructorReturn(this, (FieldElemWrapper.__proto__ || Object.getPrototypeOf(FieldElemWrapper)).apply(this, arguments));
  }

  _createClass(FieldElemWrapper, [{
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
}(React.Component);

export default FieldElemWrapper;


FieldElemWrapper.propTypes = {
  name: PropTypes.string,
  form: PropTypes.shape({
    domFields: PropTypes.objectOf(PropTypes.bool),
    recoverClearedField: PropTypes.func,
    fieldsStore: PropTypes.shape({
      getFieldMeta: PropTypes.func,
      getField: PropTypes.func
    }),
    clearedFieldMetaCache: PropTypes.objectOf(PropTypes.shape({
      field: PropTypes.object,
      meta: PropTypes.object
    })),
    clearField: PropTypes.func
  }),
  children: PropTypes.node
};