<template>
  <div>
    <h2>Leader Board</h2>
    <div class="leader-board">
      <div class="entry" v-for="(record, index) in leaders" :key="record.id">
        <div class="rank">{{ index + 1 }}.</div>
        <div class="playerName">{{ record.playerName }}</div>
        <div class="score">({{ record.score }} pts)</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeaderBoard",
  props: {
    // A sorted list of leaders
    leaders: Array
  }
};
</script>

<style scoped lang="scss">
.leader-board {
  display: grid;
  grid-template-columns: 1fr 1fr;

  .entry {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border: 1px solid #ccc;
  }
}
</style>
