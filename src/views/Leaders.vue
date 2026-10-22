<template>
  <div class="leaderBoard">
    <h2>30-Day Leader Board</h2>
    <LeaderBoard :leaders="leaderBoard" />
    <hr />
    <h2>Full Leader Board</h2>
    <LeaderBoard :leaders="leaderBoardMax" />
  </div>
</template>

<script>
import LeaderBoard from "@/components/LeaderBoard.vue";

import { loadLeaders } from "@/scores";

export default {
  components: {
    LeaderBoard
  },
  data() {
    return {
      leaderBoard: [],
      leaderBoardMax: []
    };
  },
  created() {
    this.loadHighScores();
    this.loadHighScoresMax();
  },
  methods: {
    async loadHighScores() {
      this.leaderBoard = await loadLeaders(30);
    },
    async loadHighScoresMax() {
      this.leaderBoardMax = await loadLeaders();
    }
  }
};
</script>
