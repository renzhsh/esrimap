<template>
  <div>
    <div class="img"></div>
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: String
  }
};
</script>

<style scoped lang="less">
.img {
  height: 150px;
  background: url("../System/images/no_data.png") center center no-repeat;
  background-size: contain;
}
p {
  margin-top: 10px;
  text-align: center;
  color: #afafaf;
  font-size: 12px;
}
</style>
