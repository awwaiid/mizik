<template>
  <div id="app">
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="70"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="72"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="74"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="76"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="78"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="80"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="82"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="84"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="86"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="63"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="65"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="67"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="69"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="71"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="73"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="75"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="77"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="79"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="81"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="58"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="60"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="62"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="64"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="66"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="68"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="70"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="72"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="74"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="51"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="53"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="55"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="57"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="59"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="61"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="63"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="65"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="67"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="69"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="46"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="48"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="50"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="52"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="54"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="56"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="58"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="60"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="62"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="39"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="41"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="43"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="45"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="47"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="49"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="51"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="53"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="55"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="57"
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
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="36"
          keyboardKey="e"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="38"
          keyboardKey="r"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="40"
          keyboardKey="t"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="42"
          keyboardKey="y"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="44"
          keyboardKey="u"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="46"
          keyboardKey="i"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="48"
          keyboardKey="o"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="50"
          keyboardKey="p"
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
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="29"
          keyboardKey="s"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="31"
          keyboardKey="d"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="33"
          keyboardKey="f"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="35"
          keyboardKey="g"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="37"
          keyboardKey="h"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="39"
          keyboardKey="j"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="41"
          keyboardKey="k"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="43"
          keyboardKey="l"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="45"
          keyboardKey=";"
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
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="24"
          keyboardKey="x"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="26"
          keyboardKey="c"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="28"
          keyboardKey="v"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="30"
          keyboardKey="b"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="32"
          keyboardKey="n"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="34"
          keyboardKey="m"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="36"
          keyboardKey=","
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="38"
          keyboardKey="."
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="even-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="15"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="17"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="19"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="21"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="23"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="25"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="27"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="29"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="31"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="33"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>
    </div>
    <div class="odd-row">
      <div class="black-keys" v-show="showAllKeys">
        <TriggerButton
          note="10"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="12"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="14"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="white-keys">
        <TriggerButton
          note="16"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="18"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="20"
          :show-count="showCounts"
          @clicked="addHistory"
        />
      </div>

      <div class="black-keys">
        <TriggerButton
          note="22"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="24"
          :show-count="showCounts"
          @clicked="addHistory"
        />
        <TriggerButton
          note="26"
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
      noteHistory: []
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
