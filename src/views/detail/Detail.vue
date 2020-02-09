<template>
  <div id="detail">
    <detail-nav-bar />
    <detail-swiper :top-images="topImages" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";

import { getDetail } from "network/detail";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: []
    };
  },
  created() {
    this.iid = this.$route.params.iid;
    getDetail(this.iid).then(res => {
      this.topImages = res.result.itemInfo.topImages;
    });
  },
  components: {
    DetailNavBar,
    DetailSwiper
  }
};
</script>

<style scoped>
</style>
