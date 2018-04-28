'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _betterScroll = require('better-scroll');

var _betterScroll2 = _interopRequireDefault(_betterScroll);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// ES6

var MultiSelectComponent = function (_Component) {
    _inherits(MultiSelectComponent, _Component);

    function MultiSelectComponent(props) {
        _classCallCheck(this, MultiSelectComponent);

        var _this = _possibleConstructorReturn(this, (MultiSelectComponent.__proto__ || Object.getPrototypeOf(MultiSelectComponent)).call(this, props));

        _this.state = {
            value: Object.assign([], props.value),
            datalist: []
        };
        _this.data = props.data;
        return _this;
    }

    _createClass(MultiSelectComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            // 获取 树深度
            this.cols = this.props.cols ? this.props.cols : this.getDeep(this.data);
            // format 树结果转数组
            var datalist = this.formatData(this.data);
            // 设置state 初始化scroll
            this.setState({ datalist: datalist }, function () {
                _this2.initScroll();
                document.querySelector('.MultiSelect-content').className = "MultiSelect-content MultiSelect-content-react MultiSelect-slideUp";
            });
        }
    }, {
        key: 'getDeep',
        value: function getDeep(data) {
            var deep = 0;
            function foreachArray(data) {
                var nowDeep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                if (nowDeep > deep) {
                    deep = nowDeep;
                }
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children) {
                        foreachArray(data[i].children, nowDeep + 1);
                    }
                }
            }
            foreachArray(data);
            return deep;
        }
    }, {
        key: 'formatData',
        value: function formatData(data) {
            //获取每个层级数据;
            var datalist = [];
            var value = this.state.value;
            for (var i = 0; i < this.cols; i++) {
                var list = data || [];
                var num = void 0;
                if (!value[i]) {
                    //未填写value
                    num = 0;
                    data = (data[0] || {}).children || [];
                } else {
                    for (var j = 0; j < list.length; j++) {
                        if (value[i] === list[j].value) {
                            //匹配value
                            num = j;
                            data = (data[j] || {}).children || [];
                            break;
                        }
                    }
                }
                if (num === undefined) {
                    //未匹配上value
                    num = 0;
                    data = (data[0] || {}).children || [];
                }
                datalist.push({
                    list: list,
                    num: num
                });
            }
            return datalist;
        }
    }, {
        key: 'initScroll',
        value: function initScroll() {
            var _this3 = this;

            var wraps = document.querySelectorAll('.MultiSelect-col');
            this.scroll = [];

            var _loop = function _loop(i) {
                _this3.scroll[i] = new _betterScroll2.default(wraps[i], {
                    wheel: {
                        selectedIndex: _this3.state.datalist[i].num || 0,
                        rotate: 15,
                        adjustTime: 200,
                        wheelWrapperClass: 'MultiSelect-col-content',
                        wheelItemClass: 'MultiSelect-col-item'
                    },
                    probeType: 3
                });
                _this3.scroll[i].on('scrollEnd', function () {
                    var index = _this3.scroll[i].getSelectedIndex();
                    if (index === _this3.state.datalist[i].num) {
                        //滚动后停留在原位置则不处理
                        return;
                    }
                    //更新value
                    var value = void 0;
                    if (_this3.state.datalist[i].list[index]) {
                        value = _this3.state.datalist[i].list[index].value;
                    }
                    _this3.state.value.splice(i, _this3.state.value.length - i, value);
                    //更新data
                    var newDatalist = _this3.formatData(_this3.data);
                    _this3.setState({
                        datalist: newDatalist
                    }, function () {
                        //dom更新后，刷新scroll
                        for (var j = 0; j < _this3.cols; j++) {
                            _this3.scroll[j].refresh();
                            if (j > i) {
                                //当前选择节点之后的节点归零
                                _this3.scroll[j].scrollTo(0, 0, 0);
                            }
                        }
                    });
                });
            };

            for (var i = 0; i < this.cols; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'maskClick',
        value: function maskClick(e) {
            if (e.currentTarget.className === "MultiSelect") {
                this.hide();
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            var _this4 = this;

            document.querySelector('.MultiSelect-content').className = "MultiSelect-content MultiSelect-content-react MultiSelect-slideDown";
            setTimeout(function () {
                //隐藏multi-select
                try {
                    _this4.props.onhide();
                } catch (e) {
                    console.error(e);
                }
            }, 300);
        }
    }, {
        key: 'cancel',
        value: function cancel() {
            this.hide();
        }
    }, {
        key: 'confirm',
        value: function confirm() {
            //获取value
            var value = [];
            var datalist = this.state.datalist;
            //隐藏multi-select
            this.hide();
            //更新value
            value = datalist.map(function (item, index) {
                try {
                    return item.list[item.num].value;
                } catch (e) {
                    return null;
                }
            });
            this.props.onchange(value);
        }
    }, {
        key: 'renderCol',
        value: function renderCol() {
            //列表
            var _html = [];
            var listInfo = this.state.datalist;
            for (var i = 0; i < this.cols; i++) {
                _html.push(_react2.default.createElement(
                    'div',
                    { className: 'MultiSelect-col', key: i },
                    _react2.default.createElement(
                        'div',
                        { className: 'MultiSelect-col-content' },
                        listInfo[i].list.map(function (v, k) {
                            return _react2.default.createElement(
                                'div',
                                { className: 'MultiSelect-col-item', key: k },
                                v.label
                            );
                        })
                    )
                ));
            }
            return _html;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'MultiSelect', onClick: this.maskClick.bind(this) },
                _react2.default.createElement(
                    'div',
                    { className: 'MultiSelect-content MultiSelect-content-react' },
                    _react2.default.createElement(
                        'div',
                        { className: 'MultiSelect-title' },
                        _react2.default.createElement(
                            'div',
                            { onClick: this.cancel.bind(this) },
                            '\u53D6\u6D88'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'MultiSelect-title-center' },
                            this.props.title || ''
                        ),
                        _react2.default.createElement(
                            'div',
                            { onClick: this.confirm.bind(this) },
                            '\u786E\u8BA4'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'MultiSelect-grid' },
                        _react2.default.createElement('div', { className: 'MultiSelect-col-mask' }),
                        _react2.default.createElement('div', { className: 'MultiSelect-col-border' }),
                        this.renderCol()
                    )
                )
            );
        }
    }]);

    return MultiSelectComponent;
}(_react.Component);

var MultiSelect = function (_Component2) {
    _inherits(MultiSelect, _Component2);

    function MultiSelect() {
        _classCallCheck(this, MultiSelect);

        return _possibleConstructorReturn(this, (MultiSelect.__proto__ || Object.getPrototypeOf(MultiSelect)).apply(this, arguments));
    }

    _createClass(MultiSelect, [{
        key: 'render',
        value: function render() {
            if (this.props.show) {
                return _react2.default.createElement(MultiSelectComponent, this.props);
            } else {
                return null;
            }
        }
    }]);

    return MultiSelect;
}(_react.Component);

MultiSelect.propTypes = {
    title: _propTypes2.default.string,
    value: _propTypes2.default.array,
    show: _propTypes2.default.bool,
    cols: _propTypes2.default.number,
    data: _propTypes2.default.array.isRequired,
    onchange: _propTypes2.default.func.isRequired,
    onhide: _propTypes2.default.func.isRequired
};

exports.default = MultiSelect;