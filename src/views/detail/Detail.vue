<template>
  <div id="detail">
    <detail-nav-bar ref="navbar" class="detail-nav" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
<!--    <tosat :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {itemListenerMixin, backTopMixin} from "common/mixin";
  import {debounce} from "common/utils";

  import {mapActions} from 'vuex'
  // import Tosat from "components/common/tosat/Tosat"


  import {
    getDetail,
    Goods,
    Shop,
    GoodsParam,
    getRecommend
  } from "network/detail";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Tosat,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: "",
        // show: false
      };
    },
    created() {
      this.iid = this.$route.params.iid;
      getDetail(this.iid).then(res => {
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages;
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        this.shop = new Shop(data.shopInfo);
        this.detailInfo = data.detailInfo;
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      });
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list;
      });
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(
          this.$refs.params.$el.offsetTop - this.$refs.navbar.$el.offsetHeight
        );
        this.themeTopYs.push(
          this.$refs.comment.$el.offsetTop - this.$refs.navbar.$el.offsetHeight
        );
        this.themeTopYs.push(
          this.$refs.recommend.$el.offsetTop - this.$refs.navbar.$el.offsetHeight
        );
        this.themeTopYs.push(Number.MAX_VALUE);
        // console.log(this.themeTopYs);
      });
    },
    mounted() {
    },
    destroyed() {
      this.$bus.$off("itemImageLoad", this.itemImgListener);
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh();
        // this.refresh();
        this.getThemeTopY();
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
      },
      contentScroll(position) {
        const positionY = -position.y;
        let length = this.themeTopYs.length;
        for (let i = 0; i < length - 1; i++) {
          if (
            this.currentIndex !== i &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]
          ) {
            this.currentIndex = i;
            this.$refs.navbar.currentIndex = this.currentIndex;
          }
          // if (
          //   this.currentIndex !== i &&
          //   ((i < length - 1 &&
          //     positionY >= this.themeTopYs[i] &&
          //     positionY <= this.themeTopYs[i + 1]) ||
          //     (i === length - 1 && positionY > this.themeTopYs[i]))
          // ) {
          //   this.currentIndex = i;
          //   // console.log(this.currentIndex);
          //   this.$refs.navbar.currentIndex = this.currentIndex;
          // }
        }
        this.listenShowBackTop(position);
      },
      addToCart() {
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // this.$store.commit("addCart", product);
        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ""
          // }, 1500)
          this.$toast.show(res,1500)
        })

        // this.$store.dispatch("addCart", product).then(res =>{
        //   console.log(res);
        // })
      }
    }
  };
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 102px);
  }
</style>
