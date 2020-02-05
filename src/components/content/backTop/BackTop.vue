<template>
  <div class="backtop">
    <img src="~assets/img/common/top.png" />
  </div>
</template>

<script>
export default {
  name: "BackTop",
  components: {},
  
};
</script>

<style scoped>
.backtop {
  position: fixed;
  right: 10px;
  bottom: 50px;
}
.backtop img {
  width: 45px;
  height: 45px;
}
</style>
