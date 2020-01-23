<template>
  <div id="app">
    <div class="odd-row">
      <div class="white-keys">
        <TriggerButton
          note="52"
          ref="button52"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="54"
          ref="button54"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="56"
          ref="button56"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="58"
          ref="button58"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="60"
          ref="button60"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="62"
          ref="button62"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="white-keys">
        <TriggerButton
          note="45"
          ref="button45"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="47"
          ref="button47"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="49"
          ref="button49"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="51"
          ref="button51"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="53"
          ref="button53"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="55"
          ref="button55"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="57"
          ref="button57"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="white-keys">
        <TriggerButton
          note="40"
          ref="button40"
          keyboardKey="t"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="42"
          ref="button42"
          keyboardKey="y"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="44"
          ref="button44"
          keyboardKey="u"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="46"
          ref="button46"
          keyboardKey="i"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="48"
          ref="button48"
          keyboardKey="o"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="50"
          ref="button50"
          keyboardKey="p"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="white-keys">
        <TriggerButton
          note="33"
          ref="button33"
          keyboardKey="f"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="35"
          ref="button35"
          keyboardKey="g"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="37"
          ref="button37"
          keyboardKey="h"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="39"
          ref="button39"
          keyboardKey="j"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="41"
          ref="button41"
          keyboardKey="k"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="43"
          ref="button43"
          keyboardKey="l"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>

    <div class="options-block" style="clear:both">
      <h2>Options</h2>
      <div @click="startOver">
        Start Over
      </div>
      <div @click="playSequence">
        Keep Going
      </div>
      <div v-if="winning">
        Winning....
      </div>
      <div v-else>
        BONG!
      </div>
      <div>
        Visit
        <a href="https://github.com/awwaiid/sample-mob/">GitHub Project</a> for
        more info.
      </div>
      <div class="history">
        <div v-for="note in noteHistory" v-bind:key="note.id">
          <HexButton>
            <div class="hmm">{{ note }}</div>
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
      showCounts: false,
      noteHistory: [],
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
        40: [45, 33, 35, 42, 47],
        42: [47, 40, 35, 37, 44, 49],
        44: [49, 42, 37, 39, 46, 51],
        46: [51, 44, 39, 41, 48, 53],
        48: [53, 46, 41, 43, 50, 55],
        50: [55, 48, 43],
        33: [35, 40],
        35: [40, 33, 37, 42],
        37: [42, 35, 39, 44],
        39: [44, 37, 41, 46],
        41: [46, 39, 43, 48],
        43: [48, 41, 50]
      },
      current: [],
      currentPlaying: [],
      winning: true
    };
  },
  components: {
    TriggerButton,
    HexButton
  },
  methods: {
    startOver() {
      this.current = [];
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
        this.$refs["button" + note].trigger(0.2);
        setTimeout(() => this.playNext(speed), speed);
      }
    },
    addHistory(note) {
      this.noteHistory.push(note);
      this.winning = this.noteHistory.every(
        (value, index) => value == this.current[index]
      );
      if (this.winning && this.noteHistory.length == this.current.length) {
        setTimeout(() => this.playSequence(), 1000);
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

  * {
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .odd-row,
  .even-row {
    clear: both;

    .trigger-button {
      float: left;
      margin-top: -14px;
      margin-bottom: -14px;
      margin-left: 0px;
    }
  }

  .odd-row {
    margin-left: 26px;
  }

  .hexagon2 {
    width: 48px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    margin: -5px 0 0 5px;
  }
  .black-keys .hexagon-in2 {
    background-color: #88f;
  }
  .white-keys .hexagon-in2 {
    background-color: #ccf;
  }
  /* .hexagon-in2:hover { */
  /*   background-color: green; */
  /* } */

  .options-block {
    padding-top: 2em;
    h2 {
      margin: 0 0 0.5em 0;
    }
  }

  .hmm {
    background-color: #cfc;
  }
  .history .hexagon {
    float: left;
    margin-top: -14px;
    margin-bottom: -14px;
    margin-left: 5px;
  }
}
</style>
