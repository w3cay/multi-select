<template>
  <transition name="MultiSelect-fade">
		<div v-show="state===1" class="MultiSelect" @touchmove.prevent @click="cancel">
			<transition name="MultiSelect-slideIn">
				<div v-show="state===1" class="MultiSelect-content" @click.stop>
					<div class="MultiSelect-title">
						<div @click="cancel">取消</div>
						<div class="MultiSelect-title-center">{{title}}</div>
						<div @click="confirm">确认</div>
					</div>
					<div class="MultiSelect-grid">
						<div class="MultiSelect-col-mask"></div>
						<div class="MultiSelect-col-border"></div>
						<div class="MultiSelect-col" v-for="(array,index) in datalist" :key="index">
							<div class="MultiSelect-col-content">
								<div class="MultiSelect-col-item" v-for="(item,num) in array.list" :key="num">{{item.label}}</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
    </div>
  </transition>
</template>
<script>
import BScroll from "better-scroll";
const EVENT_CANCEL = "cancel";
const EVENT_CONFIRM = "confirm";
export default {
  name: "cl-multi-select",
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Array
    },
    cols: {
      type: Number
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      realValue: Object.assign([], this.value),
      selectValue: Object.assign([], this.value),
      state: 0 // 0是隐藏，1是显示
    };
  },
  computed: {
    deep() {
      if (this.cols) {
        return this.cols;
      } else {
        return this.getDeep(this.data);
      }
    },
    datalist() {
      return this.formatData(this.data);
    }
  },
  methods: {
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
    },
    formatData(data) {
      //获取每个层级数据;
      let datalist = [];
      let value = this.selectValue;
      for (let i = 0; i < this.deep; i++) {
        let list = data || [];
        let num;
        if (!value[i]) {
          //未填写value
          num = 0;
          data = (data[0] || {}).children || [];
        } else {
          for (let j = 0; j < list.length; j++) {
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
          list,
          num
        });
      }
      return datalist;
    },
    initScroll() {
      let wraps = document.querySelectorAll(".MultiSelect-col");
      this.scroll = [];
      for (let i = 0; i < this.deep; i++) {
        this.scroll[i] = new BScroll(wraps[i], {
          wheel: {
            selectedIndex: this.datalist[i].num || 0,
            rotate: 15,
            adjustTime: 200,
            wheelWrapperClass: "MultiSelect-col-content",
            wheelItemClass: "MultiSelect-col-item"
          },
          probeType: 3
        });
        this.scroll[i].on("scrollEnd", () => {
          let index = this.scroll[i].getSelectedIndex();
          if (index === this.datalist[i].num) {
            //滚动后停留在原位置则不处理
            return;
          }
          //更新value
          let value;
          if (this.datalist[i].list[index]) {
            value = this.datalist[i].list[index].value;
          }
          this.selectValue.splice(i, this.selectValue.length - i, value);
          this.$nextTick(() => {
            //dom更新后，刷新scroll
            for (let j = 0; j < this.deep; j++) {
              this.scroll[j].refresh();
              if (j > i) {
                //当前选择节点之后的节点归零
                this.scroll[j].scrollTo(0, 0, 0);
              }
            }
          });
        });
      }
    },
    updateScroll() {
      for (let i = 0; i < this.deep; i++) {
        this.scroll[i].enable();
        this.scroll[i].wheelTo(this.datalist[i].num || 0);
      }
    },
    show() {
      if (this.state === 1) {
        return;
      }
      this.selectValue = Object.assign([], this.realValue);
      this.state = 1; // 显示组件
      if (this.scroll && this.scroll.length > 0) {
        this.$nextTick(() => {
          this.updateScroll();
        });
      } else {
        this.$nextTick(() => {
          this.initScroll();
        });
      }
    },
    hide() {
      this.state = 0;
      for (let i = 0; i < this.deep; i++) {
        this.scroll[i].disable();
      }
    },
    canConfirm() {
      return this.scroll.every(scroll => {
        return !scroll.isInTransition;
      });
    },
    confirm() {
      if (!this.canConfirm()) {
        //检查是否修改选择;
        return;
      }
      //获取value
      let value = [];
      let datalist = this.datalist;
      //更新value
      value = datalist.map((item, index) => {
        try {
          return item.list[item.num].value;
        } catch (e) {
          return null;
        }
      });
      this.realValue = value;
      this.hide();
      this.$emit(EVENT_CONFIRM, value);
    },
    cancel() {
      this.hide();
      this.$emit(EVENT_CANCEL);
    }
  }
};
</script>