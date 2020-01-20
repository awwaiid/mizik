<template>
  <div class="hexagon hexagon2">
    <div class="hexagon-in1">
      <div class="hexagon-in2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HexButton"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hexagon {
  overflow: hidden;
  visibility: hidden;
  -webkit-transform: rotate(120deg);
  -moz-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  -o-transform: rotate(120deg);
  transform: rotate(120deg);
  cursor: pointer;
}

.hexagon-in1 {
  overflow: hidden;
  width: 100%;
  height: 100%;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
}

.hexagon-in2 {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-color: #ccc;
  visibility: visible;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
}
</style>
