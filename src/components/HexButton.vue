<template>
  <div class="hexagon">
    <div class="hexagon-border" :class="clipPathClass">
      <div class="hexagon-content" :class="clipPathClass">
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
    clipPathClass() {
      return {
        "hexagon-clip-row": this.orientation == "row",
        "hexagon-clip-col": this.orientation == "col"
      };
    }
  }
};
</script>

<style scoped lang="scss">
.hexagon {
  --hexagon-radius: 3em;
  --border-color: #000;
  --border-size: 1px;
  --drop-shadow: 10px 10px 5px #00000069;

  --hexagon-height: calc(2 * var(--hexagon-radius));
  --hexagon-width: calc(1.73205 * var(--hexagon-radius)); /* sqrt(3) */

  filter: drop-shadow(var(--drop-shadow));

  color: #2c3e50;
}

.hexagon-clip-row {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.hexagon-clip-col {
  clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
}

.hexagon-border {
  text-align: center;
  background-color: var(--border-color);
  width: var(--hexagon-width);
  height: var(--hexagon-height);
  position: relative;
}

.hexagon-content {
  text-align: center;
  background-color: var(--background-color, #765);
  top: var(--border-size);
  left: var(--border-size);
  width: calc(var(--hexagon-width) - var(--border-size) * 2);
  height: calc(var(--hexagon-height) - var(--border-size) * 2);
  line-height: var(--hexagon-height);
  position: absolute;
}

.drop-shadow {
  filter: drop-shadow(var(--drop-shadow));
}
</style>
