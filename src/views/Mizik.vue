<template>
  <div id="app">
    <div class="button-grid">
      <div class="button-row" v-for="row in layout" :key="row.id">
        <template v-for="note in row">
          <TriggerButton
            v-if="note > 0"
            v-bind:key="note.id"
            ref="button"
            :note="note"
            :show-count="showCounts"
            @clicked="addHistory"
            orientation="row"
          />
        </template>
      </div>
    </div>

    <div class="options-block" style="clear:both">
      <div>Score: {{ score }}</div>
      <div class="popup game-over" v-if="!winning">
        <p>
          GAME OVER!<br />
          Your score: {{ score }}<br />
          <input
            type="text"
            v-model="playerName"
            placeholder="Your Name"
            size="8"
            maxlength="16"
          />
          <button @click="saveScore">Save Score</button>
        </p>
        <button @click="startOver">
          Start Over
        </button>
      </div>
      <div class="popup game-start" v-if="!gameStarted">
        <p>Follow the sequence!</p>
        <button @click="startOver">
          Start Game
        </button>
      </div>
      <div class="history" v-if="showHistory">
        <div v-for="note in noteHistory" v-bind:key="note.id">
          <HexButton>
            {{ note }}
          </HexButton>
        </div>
      </div>
      <LeaderBoard :leaders="leaderBoard" />
    </div>
    <div>
      Visit
      <a href="https://github.com/awwaiid/sample-mob/">GitHub Project</a> for
      more info.
    </div>
  </div>
</template>

<script>
import * as Tone from "tone";

import TriggerButton from "@/components/TriggerButton.vue";
import HexButton from "@/components/HexButton.vue";
import LeaderBoard from "@/components/LeaderBoard.vue";

const Honeycomb = require("honeycomb-grid");
const Grid = Honeycomb.defineGrid();
const Hex = Honeycomb.extendHex();

const Parse = require("parse");
Parse.initialize("myappID");
Parse.serverURL = "https://thelackthereof.org/parse";

// class GameScore extends Parse.Object {}
const GameScore = Parse.Object.extend("GameScore");
// Parse.Object.registerSubclass("GameScore", GameScore);

export default {
  name: "app",
  data() {
    return {
      gameStarted: false,
      showAllKeys: false,
      showCounts: true,
      showHistory: false,
      playerName: "anonymous",
      noteHistory: [],
      layout: [
        [0, 59, 61, 63, 0],
        [52, 54, 56, 58],
        [45, 47, 49, 51, 53],
        [40, 42, 44, 46],
        [0, 37, 39, 41, 0]
      ],
      layoutOld: [
        [52, 54, 56, 58, 60, 62],
        [45, 47, 49, 51, 53, 55, 57],
        [40, 42, 44, 46, 48, 50],
        [35, 37, 39, 41, 43]
      ],
      layoutVertical: [
        [45, 57],
        [0, 50, 62],
        [43, 55],
        [0, 48, 60],
        [41, 53],
        [0, 46, 58],
        [39, 51],
        [0, 44, 56],
        [37, 49],
        [0, 42, 54],
        [35, 47],
        [0, 40, 52],
        [33, 45]
      ],
      adjacent: {},
      //   59: [52, 54, 61],
      //   61: [59, 54, 56, 63],
      //   63: [61, 56, 58],
      //   52: [45, 47, 54, 59],
      //   54: [59, 52, 47, 49, 56, 61],
      //   56: [54, 49, 51, 58],
      //   58: [56, 51, 53, 60],
      //   60: [58, 53, 55, 62],
      //   62: [60, 55, 57],
      //   45: [40, 47, 52],
      //   47: [52, 45, 40, 42, 49, 54],
      //   49: [54, 47, 42, 44, 51, 56],
      //   51: [56, 49, 44, 46, 53, 58],
      //   53: [58, 51, 46, 48, 55, 60],
      //   55: [60, 53, 48, 50, 57],
      //   57: [62, 55, 50],
      //   40: [45, 35, 42, 47],
      //   42: [47, 40, 35, 37, 44, 49],
      //   44: [49, 42, 37, 39, 46, 51],
      //   46: [51, 44, 39, 41, 48, 53],
      //   48: [53, 46, 41, 43, 50, 55],
      //   50: [55, 48, 43],
      //   35: [40, 37, 42],
      //   37: [42, 35, 39, 44],
      //   39: [44, 37, 41, 46],
      //   41: [46, 39, 43, 48],
      //   43: [48, 41, 50]
      // },
      current: [],
      currentPlaying: [],
      winning: true,
      score: 0,
      highScore: 0,
      highScorePlayer: "unknown",
      leaderBoard: []
      // grid: Grid()
    };
  },
  components: {
    TriggerButton,
    HexButton,
    LeaderBoard
  },
  created() {
    this.initializeGrid();
    this.loadHighScores();
  },
  methods: {
    initializeGrid() {
      this.grid = Grid();
      this.layout.forEach((row, rowNum) => {
        row.forEach((cell, colNum) => {
          this.grid.push(Hex(colNum, rowNum));
        });
      });
      this.adjacent = {};
      let me = this; // WHY do I have to do this? Doesn't => take care of it?
      this.layout.forEach((row, rowNum) => {
        console.log({ row, rowNum });
        row.forEach((cell, colNum) => {
          if (cell > 0) {
            let allNeighbors = me.grid.neighborsOf(Hex(colNum, rowNum));
            let definedNeighbors = allNeighbors.filter(v => v);
            let neighborNotes = definedNeighbors.map(
              loc => me.layout[loc.y][loc.x]
            );
            let filledNotes = neighborNotes.filter(note => note > 0);
            me.adjacent[cell] = me.adjacent[cell] || [];
            me.adjacent[cell].push(...filledNotes);
          }
        });
      });
    },
    async startOver() {
      await Tone.start();
      this.current = [];
      this.score = 0;
      this.$refs.button.forEach(button => button.reset());
      this.gameStarted = true;
      this.playSequence();
    },
    playSequence() {
      this.noteHistory = [];
      this.winning = true;
      this.addNote();
      this.currentPlaying = this.current.slice();
      this.playNext(200);
    },
    playNext(speed) {
      let note = this.currentPlaying.shift();
      if (note) {
        this.$refs.button.forEach(button => {
          if (button.note == note) {
            button.trigger(0.2);
          }
        });
        setTimeout(() => this.playNext(speed), speed);
      }
    },
    getGlobalHighScore() {},
    gameOver() {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        // TODO: save highScore to server
      }
    },
    async loadHighScores() {
      const query = new Parse.Query(GameScore);
      query.descending("score");
      query.limit(10);
      const results = await query.find();
      console.log({ results });
      this.highScore = results[0].get("score");
      this.highScorePlayer = results[0].get("playerName");
      this.leaderBoard = results.map(r => ({
        playerName: r.get("playerName"),
        score: r.get("score")
      }));
    },
    saveScore() {
      let gameScore = new GameScore();
      gameScore
        .save({
          playerName: this.playerName,
          score: this.score
        })
        .then(() => this.loadHighScores());
      this.startOver();
    },
    addHistory(note) {
      this.noteHistory.push(note);
      this.winning = this.noteHistory.every(
        (value, index) => value == this.current[index]
      );
      if (this.winning && this.noteHistory.length == this.current.length) {
        this.score = this.noteHistory.length;
        setTimeout(() => this.playSequence(), 1000);
      }
      if (!this.winning) {
        // Reset the last note in case it doesn't get
        // a touch-release
        this.$refs.button.forEach(button => button.unTrigger());
        this.gameOver();
      }
    },
    randomEntry(items) {
      return items[Math.floor(Math.random() * items.length)];
    },
    addNote() {
      let last =
        this.current[this.current.length - 1] ||
        this.randomEntry(Object.keys(this.adjacent));
      let next = this.randomEntry(this.adjacent[last]);
      this.current.push(next);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;

  * {
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  --hexagon-radius: 10vmin;

  .button-row {
    display: flex;
    justify-content: center;
    margin-top: calc(-1 * var(--hexagon-radius) / 2);
  }

  .hexagon {
    margin: 1vmin;
    --background-color: #ccf;
    --hexagon-radius: 10vmin;
  }

  .options-block {
    padding-top: 2em;
    h2 {
      margin: 0 0 0.5em 0;
    }
  }

  .history .hexagon {
    float: left;
    margin: 5px;
    --background-color: #cfc;
    --hexagon-radius: 3vmin;
  }

  .popup {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 25vmin;
    height: 25vmin;
    padding: 1em;
    border: 1px solid black;
  }

  .game-over {
    background-color: crimson;
  }
  .game-start {
    background-color: lightcyan;
  }
}
</style>
