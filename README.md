# multiSelect
级联选择框，e.g. 省市区选择

## 安装

```
yarn add cl-multi-select
```
或

```
npm i cl-multi-select --save
```

## React组件

React组件有默认导出，所以组件名字任意，以下代码作为示例

```
// 导入
import MultiSelect from 'cl-multi-select';
//导入所有样式
import 'cl-multi-select/lib/css/index.css';

// 使用 
<MultiSelect 
    value={this.state.value} 
    title={"城市选择"} 
    data={this.cityData} 
    show={this.state.show} 
    onchange={(value)=>{this.setState({value})}} 
    onhide={()=>{this.setState({show:false})}} 
/>

```

## Vue组件

```
// 导入
import MultiSelect from 'cl-multi-select/lib/vue/index.vue';
//导入所有样式
import 'cl-multi-select/lib/css/index.css';

//注册组件
Vue.component(MultiSelect.name, MultiSelect);

//使用
<cl-multi-select ref="clSelect" title="城市选择" :value="[]" :cols="3" :data="data" v-on:confirm="confrim" v-on:cancel="cancel" />
this.$refs.clSelect.show();
this.$refs.clSelect.hide();
```

## 属性说明


属性 | 值 | 说明
---|---|---
title | 可选；字符串；| 标题
value | 可选；数组；| 值, 格式是[value1, value2, value3], 对应数据源的相应级层value
cols | 可选；数字；| 列数，已知的情况下，必填
data | 必填；数组；| 数据源Array<{value, label, children: Array}>
show | 可选；布尔值；| 级联选择组件是否显示（仅为react组件属性）
onchange | 必填；函数；| 选中后的回调，返回value（仅为react组件属性）
onhide | 必填；函数；| 取消后的回调，需要在回调中关闭组件显示（仅为react组件属性）
