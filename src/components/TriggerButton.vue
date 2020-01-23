<template>
  <div class="trigger-button">
    <HexButton>
      <div
        v-touch:start="onTouchStart"
        v-touch:end="onTouchEnd"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        v-touch:tap="onTouchTap"
        :class="{ active: isActive }"
      >
        <span v-if="showCount">{{ this.$data.count }}</span>
        <span v-else>{{ this.$props.note }}</span>
      </div>
    </HexButton>
  </div>
</template>

<script>
import * as Tone from "tone";
import HexButton from "./HexButton.vue";

export default {
  name: "TriggerButton",
  components: {
    HexButton
  },
  data() {
    return {
      count: 0,
      synth: undefined,
      boundKeys: false,
      isActive: false
    };
  },
  props: {
    note: String,
    keyboardKey: String,
    showCount: Boolean
  },
  mounted() {
    if (!this.boundKeys) {
      window.addEventListener("keydown", e => {
        this.onKeyDown(e);
      });
      window.addEventListener("keyup", e => {
        this.onKeyUp(e);
      });
      this.boundKeys = true;
    }
  },
  created() {
    this.synth = new Tone.Synth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toMaster();
  },
  methods: {
    noteToFreq(note) {
      return 2 ** ((note - 49) / 12) * 440;
    },
    onMouseDown() {
      console.log("mouseDown");
    },
    onMouseUp() {
      console.log("mouseUp");
    },
    onTouchTap() {
      console.log("touch tap");
    },
    onTouchStart() {
      console.log("touch start");
      this.$emit("clicked", this.note);
      this.count++;
      this.isActive = true;
      this.synth.triggerAttack(this.noteToFreq(this.$props.note));
    },
    onTouchEnd() {
      console.log("touch end!");
      this.count--;
      this.synth.triggerRelease();
      this.isActive = false;
    },
    onKeyDown(event) {
      if (this.keyboardKey && event.key == this.keyboardKey) {
        console.log("keypress!");
        this.$emit("clicked", this.note);
        this.isActive = true;
        this.synth.triggerAttack(this.noteToFreq(this.$props.note));
      }
    },
    onKeyUp(event) {
      if (this.keyboardKey && event.key == this.keyboardKey) {
        console.log("keyup!");
        this.isActive = false;
        this.synth.triggerRelease();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.active {
  background-color: #51e2ec;
}
</style>
