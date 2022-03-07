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
      let cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      const query = new Parse.Query(GameScore);
      query.select("playerName", "score");
      query.exists("playerName");
      query.exists("score");
      query.greaterThan("createdAt", cutoffDate);
      query.descending("score");
      query.limit(2000);
      const results = await query.find();
      this.leaderBoard = results.map(r => ({
        playerName:
          r.get("playerName") == "" ? "anonymous" : r.get("playerName"),
        score: r.get("score") || 0,
        gameCount: results.filter(
          a =>
            a.get("playerName")?.toUpperCase() ==
            r.get("playerName")?.toUpperCase()
        ).length,
        createdAt: r.createdAt.toLocaleDateString()
      }));
      this.leaderBoard = this.leaderBoard.filter(
        (a, b) =>
          this.leaderBoard.findIndex(
            e => e.playerName.toUpperCase() == a.playerName.toUpperCase()
          ) == b
      );
    },
    async loadHighScoresMax() {
      const query = new Parse.Query(GameScore);
      query.select("playerName", "score");
      query.exists("playerName");
      query.exists("score");
      query.descending("score");
      query.limit(20000);
      const results = await query.find();
      this.leaderBoardMax = results.map(r => ({
        playerName:
          r.get("playerName") == "" ? "anonymous" : r.get("playerName"),
        score: r.get("score") || 0,
        gameCount: results.filter(
          a =>
            a.get("playerName")?.toUpperCase() ==
            r.get("playerName")?.toUpperCase()
        ).length,
        createdAt: r.createdAt.toLocaleDateString() // .slice(0, 10)
      }));
      this.leaderBoardMax = this.leaderBoardMax.filter(
        (a, b) =>
          this.leaderBoardMax.findIndex(
            e => e.playerName.toUpperCase() == a.playerName.toUpperCase()
          ) == b
      );
    }
  }
};
</script>
