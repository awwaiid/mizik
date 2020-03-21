<template>
  <div class="leaderBoard">
    <h2>30-Day Leader Board</h2>
    <LeaderBoard :leaders="leaderBoard" />
  </div>
</template>

<script>
import LeaderBoard from "@/components/LeaderBoard.vue";

// High scroes stored on thelackthereof's Parse server
const Parse = require("parse");
Parse.initialize("myappID");
Parse.serverURL = "https://thelackthereof.org/parse";
const GameScore = Parse.Object.extend("GameScore");

export default {
  components: {
    LeaderBoard
  },
  data() {
    return {
      leaderBoard: []
    };
  },
  created() {
    this.loadHighScores();
  },
  methods: {
    async loadHighScores() {
      let cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      const query = new Parse.Query(GameScore);
      query.greaterThan("createdAt", cutoffDate);
      query.descending("score");
      query.limit(200);
      const results = await query.find();
      this.leaderBoard = results.map(r => ({
        playerName: r.get("playerName") || "",
        score: r.get("score") || 0
      }));
      this.leaderBoard = this.leaderBoard.filter(
        (a, b) =>
          this.leaderBoard.findIndex(
            e => e.playerName.toUpperCase() == a.playerName.toUpperCase()
          ) == b
      );
    }
  }
};
</script>
