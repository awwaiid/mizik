<template>
  <div class="hexagon">
    <div class="hexagon-border" :style="clipPathStyle">
      <div class="hexagon-content" :style="clipPathStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HexButton",
  props: {
    orientation: { default: "row" }
  },
  computed: {
    clipPathStyle() {
      if (this.orientation == "row") {
        return {
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
        };
      } else {
        return {
          clipPath:
            "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
.hexagon {
  --hexagon-size: 3em;
  --border-color: #000;
  --border-size: 1px;
  --drop-shadow: 10px 10px 5px;

  filter: drop-shadow(var(--drop-shadow));
}

.hexagon-border {
  text-align: center;
  background-color: var(--border-color);
  width: var(--hexagon-size);
  height: var(--hexagon-size);
  line-height: var(--hexagon-size);
  position: relative;
}

.hexagon-content {
  text-align: center;
  background-color: var(--background-color, #765);
  top: var(--border-size);
  left: var(--border-size);
  width: calc(var(--hexagon-size) - var(--border-size) * 2);
  height: calc(var(--hexagon-size) - var(--border-size) * 2);
  line-height: var(--hexagon-size);
  position: absolute;
}

.drop-shadow {
  filter: drop-shadow(var(--drop-shadow));
}
</style>
