<template>
  <div id="app">
    <div class="button-grid">
      <div class="button-row" v-for="row in layout" :key="row.id">
        <TriggerButton
          v-for="note in row"
          v-bind:key="note.id"
          ref="button"
          :note="note"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>

    <div class="options-block" style="clear:both">
      <button @click="startOver">
        Start Over
      </button>
      <div>High Score: {{ highScore }}</div>
      <div class="game-over" v-if="!winning">
        GAME OVER!<br />
        Final score: {{ score }}
      </div>
      <div>
        Visit
        <a href="https://github.com/awwaiid/sample-mob/">GitHub Project</a> for
        more info.
      </div>
      <div class="history">
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
import TriggerButton from "@/components/TriggerButton.vue";
import HexButton from "@/components/HexButton.vue";

export default {
  name: "app",
  data() {
    return {
      showAllKeys: false,
      showCounts: true,
      noteHistory: [],
      layout: [
        [52, 54, 56, 58, 60, 62],
        [45, 47, 49, 51, 53, 55, 57],
        [40, 42, 44, 46, 48, 50],
        [35, 37, 39, 41, 43]
      ],
      adjacent: {
        52: [45, 47, 54],
        54: [52, 47, 49, 56],
        56: [54, 49, 51, 58],
        58: [56, 51, 53, 60],
        60: [58, 53, 55, 62],
        62: [60, 55, 57],
        45: [40, 47, 52],
        47: [52, 45, 40, 42, 49, 54],
        49: [54, 47, 42, 44, 51, 56],
        51: [56, 49, 44, 46, 53, 58],
        53: [58, 51, 46, 48, 55, 60],
        55: [60, 53, 48, 50, 57],
        57: [62, 55, 50],
        40: [45, 35, 42, 47],
        42: [47, 40, 35, 37, 44, 49],
        44: [49, 42, 37, 39, 46, 51],
        46: [51, 44, 39, 41, 48, 53],
        48: [53, 46, 41, 43, 50, 55],
        50: [55, 48, 43],
        35: [40, 37, 42],
        37: [42, 35, 39, 44],
        39: [44, 37, 41, 46],
        41: [46, 39, 43, 48],
        43: [48, 41, 50]
      },
      current: [],
      currentPlaying: [],
      winning: true,
      score: 0,
      highScore: 0
    };
  },
  components: {
    TriggerButton,
    HexButton
  },
  methods: {
    startOver() {
      this.current = [];
      this.score = 0;
      this.$refs.button.forEach(button => button.reset());
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
    addHistory(note) {
      this.noteHistory.push(note);
      this.winning = this.noteHistory.every(
        (value, index) => value == this.current[index]
      );
      if (this.winning && this.noteHistory.length == this.current.length) {
        this.score = this.noteHistory.length;
        if (this.score > this.highScore) {
          this.highScore = this.score;
        }
        setTimeout(() => this.playSequence(), 1000);
      }
      if (!this.winning) {
        // Reset the last note in case it doesn't get
        // a touch-release
        this.$refs.button.forEach(button => button.unTrigger());
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

  --hexagon-size: 13vw;

  .hexagon {
    margin: 2px;
    --background-color: #ccf;
    --hexagon-size: 13vw;
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
  }
  .game-over {
    position: absolute;
    top: 150px;
    left: 120px;
    padding: 20px;
    background-color: crimson;
  }

  .button-row {
    display: flex;
    justify-content: center;
    margin-top: calc(-1 * var(--hexagon-size) / 3.6);
    border: 1px dashed green;
  }
}
</style>
