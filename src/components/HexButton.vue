<template>
  <div class="hexagon">
    <div class="hexagon-border">
      <div class="hexagon-content">
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
  /* clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); */
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
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
  /* clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); */
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.drop-shadow {
  filter: drop-shadow(var(--drop-shadow));
}
</style>
