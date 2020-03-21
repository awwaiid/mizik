<template>
  <div id="mizik">
    <div class="current-score">
      {{ score }}<span class="pts-label">pts</span>
    </div>
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
            duration="0.2"
          />
        </template>
      </div>
    </div>

    <div class="options-block" style="clear:both">
      <div class="popup game-over" v-if="!winning">
        <p>
          GAME OVER!<br />
          Your score: <b>{{ score }} pts</b><br />
          <br />
          <input
            type="text"
            v-model="playerName"
            ref="playerNameInput"
            placeholder="Your Name"
            size="8"
            maxlength="16"
            class="score-name"
          />
          <button class="save-score" @click="saveScore">Save Score</button>
        </p>
        <button class="start-over" @click="startOver">
          Start Over Without Saving
        </button>
      </div>
      <div class="popup game-start" v-if="!gameStarted">
        <p>Repeat the chain!</p>
        <p>Use the sounds to remember.</p>
        <p>Extra points when the chain doubles back!</p>
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
    </div>
  </div>
</template>

<script>
import * as Tone from "tone";

import TriggerButton from "@/components/TriggerButton.vue";
import HexButton from "@/components/HexButton.vue";

// Handy library for doing hex-grid calculations
const Honeycomb = require("honeycomb-grid");
const Grid = Honeycomb.defineGrid();
const Hex = Honeycomb.extendHex();

// Question: How does one secure a webapp-based scoring system?
// Doesn't seem like there is a way to prevent fake scores from
// being posted. We'll go with trust for now!
const Parse = require("parse");
Parse.initialize("myappID");
Parse.serverURL = "https://thelackthereof.org/parse";
const GameScore = Parse.Object.extend("GameScore");

export default {
  name: "mizik",
  data() {
    return {
      gameStarted: false,
      showAllKeys: false,
      showCounts: true,
      showHistory: false,
      playerName: undefined,
      noteHistory: [],
      layout: [
        [0, 59, 61, 63, 0],
        [52, 54, 56, 58],
        [45, 47, 49, 51, 53],
        [40, 42, 44, 46],
        [0, 37, 39, 41, 0]
      ],
      adjacent: {},
      current: [],
      currentPlaying: [],
      winning: true,
      score: 0,
      runScore: 0
    };
  },
  components: {
    TriggerButton,
    HexButton
  },
  created() {
    this.initializeGrid();
  },
  methods: {
    initializeGrid() {
      // Note: We are storing grid outside of $data on purpose
      // When it was in $data the reactive lister wrappers did weird things
      this.grid = Grid();
      this.layout.forEach((row, rowNum) => {
        row.forEach((cell, colNum) => {
          this.grid.push(Hex(colNum, rowNum));
        });
      });

      // Build adjacency list
      this.adjacent = {};
      let me = this; // WHY do I have to do this? Doesn't => take care of it?
      this.layout.forEach((row, rowNum) => {
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
      // Now that there's been an interaction, Tone can initialize the sound system
      // Technically we only need to do this once, upon the first interaction on page
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
      this.runScore = 0;
    },
    playNext(speed) {
      let note = this.currentPlaying.shift();
      if (note) {
        // I don't really like this way of triggering the right button; seems
        // like we should be able to jump right to the correct button rather than
        // looping through each time.
        this.$refs.button.forEach(button => {
          if (button.note == note) {
            button.trigger(0.2);
          }
        });
        setTimeout(() => this.playNext(speed), speed);
      }
    },
    saveScore() {
      let gameScore = new GameScore();
      gameScore.save({
        playerName: this.playerName,
        score: this.score,
        sequence: this.current,
        timestamp: Date.now()
      });
      this.startOver();
    },
    addHistory(note, count) {
      this.noteHistory.push(note);
      this.winning = this.noteHistory.every(
        (value, index) => value == this.current[index]
      );
      if (this.winning) {
        this.runScore += count;
        console.log(
          `That was worth ${count} points. Run score: ${this.runScore}`
        );
      }
      if (this.winning && this.noteHistory.length == this.current.length) {
        this.score = this.runScore;
        console.log(`New score: ${this.score}`);
        setTimeout(() => this.playSequence(), 1000);
      }
      if (!this.winning) {
        this.gameOver();
      }
    },
    gameOver() {
      // Reset the last note in case it doesn't get
      // a touch-release
      // this.$refs.playerNameInput.focus();
      this.$refs.button.forEach(button => button.unTrigger());
      this.$nextTick(() => {
        this.$refs.playerNameInput.focus();
      });
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
#mizik {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto;

  *:not(input) {
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em;
    border: 1px solid black;
    color: #2c3e50;
  }

  .game-over {
    background-color: crimson;

    .save-score,
    .score-name {
      font-size: 17px;
    }

    .start-over {
      font-size: 8px;
    }
  }
  .game-start {
    background-color: lightcyan;
  }

  .current-score {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 30px;
    .pts-label {
      font-size: 15px;
    }
  }
}
</style>
