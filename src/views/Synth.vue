<template>
  <div id="app">
    <div class="button-grid">
      <div class="button-row" v-for="row in layout" :key="row.id">
        <TriggerButton
          v-for="button in row"
          v-bind:key="button.id"
          ref="button"
          :note="button.note"
          :show-count="showCounts"
          :label="button.label"
          @clicked="addHistory"
          :class="{ 'black-key': button.color == 'black' }"
        />
      </div>
    </div>
    <div class="options-block" style="clear:both">
      <h2>Options</h2>
      <div>
        <label>
          <input type="checkbox" v-model="showAllKeys" />
          Show all keys
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" v-model="showCounts" />
          Show click counts
        </label>
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
      layout: [
        [
          { note: 70, label: "Gb", color: "black" },
          { note: 72, label: "Ab", color: "black" },
          { note: 74, label: "Bb", color: "black" },
          { note: 76, label: "C", color: "white" },
          { note: 78, label: "D", color: "white" },
          { note: 80, label: "E", color: "white" },
          { note: 82, label: "F#", color: "black" },
          { note: 84, label: "G#", color: "black" },
          { note: 86, label: "A#", color: "black" }
        ],
        [
          { note: 63, label: "Cb", color: "black" },
          { note: 65, label: "Db", color: "black" },
          { note: 67, label: "Eb", color: "black" },
          { note: 69, label: "F", color: "white" },
          { note: 71, label: "G", color: "white" },
          { note: 73, label: "A", color: "white" },
          { note: 75, label: "B", color: "white" },
          { note: 77, label: "C#", color: "black" },
          { note: 79, label: "D#", color: "black" },
          { note: 81, label: "E#", color: "black" }
        ],
        [
          { note: 58, label: "Gb", color: "black" },
          { note: 60, label: "Ab", color: "black" },
          { note: 62, label: "Bb", color: "black" },
          { note: 64, label: "C", color: "white" },
          { note: 66, label: "D", color: "white" },
          { note: 68, label: "E", color: "white" },
          { note: 70, label: "F#", color: "black" },
          { note: 72, label: "G#", color: "black" },
          { note: 74, label: "A#", color: "black" }
        ],
        [
          { note: 51, label: "Cb", color: "black" },
          { note: 53, label: "Db", color: "black" },
          { note: 55, label: "Eb", color: "black" },
          { note: 57, label: "F", color: "white" },
          { note: 59, label: "G", color: "white" },
          { note: 61, label: "A", color: "white" },
          { note: 63, label: "B", color: "white" },
          { note: 65, label: "C#", color: "black" },
          { note: 67, label: "D#", color: "black" },
          { note: 69, label: "E#", color: "black" }
        ],
        [
          { note: 46, label: "Gb", color: "black" },
          { note: 48, label: "Ab", color: "black" },
          { note: 50, label: "Bb", color: "black" },
          { note: 52, label: "C", color: "white" },
          { note: 54, label: "D", color: "white" },
          { note: 56, label: "E", color: "white" },
          { note: 58, label: "F#", color: "black" },
          { note: 60, label: "G#", color: "black" },
          { note: 62, label: "A#", color: "black" }
        ],
        [
          { note: 39, label: "Cb", color: "black" },
          { note: 41, label: "Db", color: "black" },
          { note: 43, label: "Eb", color: "black" },
          { note: 45, label: "F", color: "white" },
          { note: 47, label: "G", color: "white" },
          { note: 49, label: "A", color: "white" },
          { note: 51, label: "B", color: "white" },
          { note: 53, label: "C#", color: "black" },
          { note: 55, label: "D#", color: "black" },
          { note: 57, label: "E#", color: "black" }
        ],
        [
          { note: 34, label: "Gb", color: "black" },
          { note: 36, label: "Ab", color: "black" },
          { note: 38, label: "Bb", color: "black" },
          { note: 40, label: "C", color: "white" },
          { note: 42, label: "D", color: "white" },
          { note: 44, label: "E", color: "white" },
          { note: 46, label: "F#", color: "black" },
          { note: 48, label: "G#", color: "black" },
          { note: 50, label: "A#", color: "black" }
        ],
        [
          { note: 27, label: "Cb", color: "black" },
          { note: 29, label: "Db", color: "black" },
          { note: 31, label: "Eb", color: "black" },
          { note: 33, label: "F", color: "white" },
          { note: 35, label: "G", color: "white" },
          { note: 37, label: "A", color: "white" },
          { note: 39, label: "B", color: "white" },
          { note: 41, label: "C#", color: "black" },
          { note: 43, label: "D#", color: "black" },
          { note: 45, label: "E#", color: "black" }
        ],
        [
          { note: 22, label: "Gb", color: "black" },
          { note: 24, label: "Ab", color: "black" },
          { note: 26, label: "Bb", color: "black" },
          { note: 28, label: "C", color: "white" },
          { note: 30, label: "D", color: "white" },
          { note: 32, label: "E", color: "white" },
          { note: 34, label: "F#", color: "black" },
          { note: 36, label: "G#", color: "black" },
          { note: 38, label: "A#", color: "black" }
        ],
        [
          { note: 15, label: "Cb", color: "black" },
          { note: 17, label: "Db", color: "black" },
          { note: 19, label: "Eb", color: "black" },
          { note: 21, label: "F", color: "white" },
          { note: 23, label: "G", color: "white" },
          { note: 25, label: "A", color: "white" },
          { note: 27, label: "B", color: "white" },
          { note: 29, label: "C#", color: "black" },
          { note: 31, label: "D#", color: "black" },
          { note: 33, label: "E#", color: "black" }
        ],
        [
          { note: 10, label: "Gb", color: "black" },
          { note: 12, label: "Ab", color: "black" },
          { note: 14, label: "Bb", color: "black" },
          { note: 16, label: "C", color: "white" },
          { note: 18, label: "D", color: "white" },
          { note: 20, label: "E", color: "white" },
          { note: 22, label: "F#", color: "black" },
          { note: 24, label: "G#", color: "black" },
          { note: 26, label: "A#", color: "black" }
        ]
      ]
    };
  },
  components: {
    TriggerButton,
    HexButton
  },
  methods: {
    addHistory(note) {
      this.noteHistory.push(note);
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

  --hexagon-radius: 5vmin;

  .button-row {
    display: flex;
    justify-content: center;
    margin-top: calc(-1 * var(--hexagon-radius) / 2);
  }

  .hexagon {
    margin: 2px;
    --background-color: #ccf;
    --hexagon-radius: 5vmin;
  }

  .black-key .hexagon {
    --background-color: #88f;
  }

  .options-block {
    padding-top: 2em;
    h2 {
      margin: 0 0 0.5em 0;
    }
  }

  .history .hexagon {
    float: left;
    margin-left: 5px;
  }
}
</style>
