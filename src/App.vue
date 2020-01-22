<template>
  <div id="app">
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="70"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="72"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="74"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="76"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="78"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="80"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="82"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="84"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="86"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="63"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="65"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="67"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="69"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="71"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="73"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="75"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="77"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="79"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="81"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="58"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="60"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="62"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="64"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="66"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="68"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="70"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="72"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="74"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="51"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="53"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="55"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="57"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="59"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="61"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="63"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="65"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="67"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="69"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="46"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="48"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="50"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="52"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="54"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="56"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="58"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="60"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="62"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="39"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="41"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="43"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="45"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="47"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="49"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="51"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="53"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="55"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="57"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="34"
          keyboardKey="w"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="36"
          keyboardKey="e"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="38"
          keyboardKey="r"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="40"
          keyboardKey="t"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="42"
          keyboardKey="y"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="44"
          keyboardKey="u"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="46"
          keyboardKey="i"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="48"
          keyboardKey="o"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="50"
          keyboardKey="p"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="27"
          keyboardKey="a"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="29"
          keyboardKey="s"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="31"
          keyboardKey="d"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="33"
          keyboardKey="f"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="35"
          keyboardKey="g"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="37"
          keyboardKey="h"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="39"
          keyboardKey="j"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="41"
          keyboardKey="k"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="43"
          keyboardKey="l"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="45"
          keyboardKey=";"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="22"
          keyboardKey="z"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="24"
          keyboardKey="x"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="26"
          keyboardKey="c"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="28"
          keyboardKey="v"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="30"
          keyboardKey="b"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="32"
          keyboardKey="n"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="34"
          keyboardKey="m"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="36"
          keyboardKey=","
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="38"
          keyboardKey="."
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="15"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="17"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="19"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="21"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="23"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="25"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="27"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="29"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="31"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="33"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="10"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="12"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="14"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="16"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="18"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="20"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="22"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="24"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="26"
          :audio-context="audioContext"
          :show-count="showCounts"
          @clicked="addHistory"
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
      <div>Latency: {{ curLatency }}</div>
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
import TriggerButton from "./components/TriggerButton.vue";
import HexButton from "./components/HexButton.vue";

export default {
  name: "app",
  data() {
    return {
      audioContext: new AudioContext(),
      showAllKeys: false,
      showCounts: false,
      noteHistory: [],
      curLatency: 0
    };
  },
  components: {
    TriggerButton,
    HexButton
  },
  methods: {
    addHistory(note) {
      this.curLatency = note;
      this.$forceUpdate();
      // this.noteHistory.push(note);
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
