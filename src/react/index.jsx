import React, { Component } from 'react';
import BScroll from 'better-scroll';
import PropTypes from 'prop-types'; // ES6

class MultiSelectComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value: Object.assign([],props.value),
            datalist: []
        }
        this.data = props.data;
    }

    componentDidMount() {
        // 获取 树深度
        this.cols = this.props.cols ? this.props.cols : this.getDeep(this.data);
        // format 树结果转数组
        let datalist = this.formatData(this.data);
        // 设置state 初始化scroll
        this.setState({ datalist },()=>{
            this.initScroll();
            document.querySelector('.MultiSelect-content').className = "MultiSelect-content MultiSelect-slideUp";
        });
    }

    getDeep(data) {
        let deep = 0;
        function foreachArray(data, nowDeep = 1) {
            if (nowDeep > deep) {
                deep = nowDeep;
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].children) {
                    foreachArray(data[i].children, nowDeep + 1);
                }
            }
        }
        foreachArray(data);
        return deep;
    }

    formatData(data) {
        //获取每个层级数据;
        let datalist = [];
        let value = this.state.value;
        for (let i = 0; i < this.cols; i++) {
            let list = data || [];
            let num;
            if (!value[i]) { //未填写value
                num = 0;
                data = (data[0] || {}).children || [];
            } else {
                for (let j = 0; j < list.length; j++) {
                    if (value[i] === list[j].value) { //匹配value
                        num = j;
                        data = (data[j] || {}).children || [];
                        break;
                    }
                }
            }
            if (num === undefined) {//未匹配上value
                num = 0;
                data = (data[0] || {}).children || [];
            }
            datalist.push({
                list,
                num
            })
        }
        return datalist;
    }

    initScroll() {
        let wraps = document.querySelectorAll('.MultiSelect-col');
        this.scroll = [];
        for (let i = 0; i < this.cols; i++) {
            this.scroll[i] = new BScroll(wraps[i], {
                wheel: {
                    selectedIndex: this.state.datalist[i].num || 0,
                    rotate: 15, 
                    adjustTime: 200, 
                    wheelWrapperClass: 'MultiSelect-col-content',
                    wheelItemClass: 'MultiSelect-col-item'
                },
                probeType: 3
            });
            this.scroll[i].on('scrollEnd', () => {
                let index = this.scroll[i].getSelectedIndex();
                if (index === this.state.datalist[i].num) { //滚动后停留在原位置则不处理
                    return;
                }
                //更新value
                let value;
                if(this.state.datalist[i].list[index]){
                    value = this.state.datalist[i].list[index].value;
                }
                this.state.value.splice(i, this.state.value.length - i, value);
                //更新data
                let newDatalist = this.formatData(this.data);
                this.setState({
                    datalist: newDatalist
                }, () => {
                    //dom更新后，刷新scroll
                    for (let j = 0; j < this.cols; j++) {
                        this.scroll[j].refresh();
                        if (j > i) {
                            //当前选择节点之后的节点归零
                            this.scroll[j].scrollTo(0, 0, 0);
                        }
                    }
                });
            });
        }
    }

    maskClick(e){
        if(e.currentTarget.className==="MultiSelect"){
            this.hide();
        }
    }

    hide(){
        document.querySelector('.MultiSelect-content').className = "MultiSelect-content MultiSelect-slideDown";
        setTimeout(()=>{
            //隐藏multi-select
            try{
                this.props.onhide();
            }catch(e){
                console.error(e);
            }
        },300);
    }

    cancel() {
        this.hide();
    }

    confirm(){
        //获取value
        let value = [];
        let datalist = this.state.datalist;
        //隐藏multi-select
        this.hide();
        //更新value
        value = datalist.map((item,index)=>{
            try{
                return item.list[item.num].value;
            }catch(e){
                return null;
            }
        })
        this.props.onchange(value);
    }

    renderCol(){
        //列表
        let _html = [];
        let listInfo = this.state.datalist;
        for(let i=0;i<this.cols;i++){
            _html.push(
                <div className="MultiSelect-col" key={i}>
                    <div className="MultiSelect-col-content">
                        {
                            listInfo[i].list.map((v,k)=>{
                                return <div className="MultiSelect-col-item" key={k}>{v.label}</div>
                            })
                        }
                    </div>
                </div>
            );
        }
        return _html;
    }

    render(){
        return (
            <div className="MultiSelect" onClick={this.maskClick.bind(this)} >
                <div className="MultiSelect-content">
                    <div className="MultiSelect-title">
                        <div onClick={this.cancel.bind(this)}>取消</div>
                        <div className="MultiSelect-title-center">{this.props.title||''}</div>
                        <div onClick={this.confirm.bind(this)}>确认</div>
                    </div>
                    <div className="MultiSelect-grid">
                        <div className="MultiSelect-col-mask"></div>
                        <div className="MultiSelect-col-border"></div>
                        { this.renderCol() }
                    </div>
                </div>
            </div>
        )
    }
}

class MultiSelect extends Component{
    render(){
        if(this.props.show){
            return <MultiSelectComponent {...this.props} />
        }else{
            return null;
        }
    }
}

MultiSelect.propTypes = {
    title: PropTypes.string,
    value: PropTypes.array,
    show: PropTypes.bool,
    cols: PropTypes.number,
    data: PropTypes.array.isRequired,
    onchange: PropTypes.func.isRequired,
    onhide: PropTypes.func.isRequired
}

export default MultiSelect;