<template>
  <div class="leader-board">
    <div class="leader-board-grid">
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
  color: #000;
}

.leader-board-grid {
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows:
    1fr 1fr 1fr 1fr 1fr
    1fr 1fr 1fr 1fr 1fr
    1fr 1fr 1fr 1fr 1fr
    1fr 1fr 1fr 1fr 1fr
    1fr 1fr 1fr 1fr 1fr;
  grid-auto-flow: column;
  width: 90%;

  .entry {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    font-size: 10px;
    /* border: 1px solid #ccc; */

    .rank {
      text-align: right;
      margin-right: 0.5em;
    }
  }
}
</style>
