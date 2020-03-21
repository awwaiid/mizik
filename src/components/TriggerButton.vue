<template>
  <div class="trigger-button">
    <HexButton :orientation="orientation">
      <div
        v-touch:start="onTouchStart"
        v-touch:end="onTouchEnd"
        v-touch="onTouch"
        :style="{ backgroundColor: countColor }"
        :class="{ active: isActive }"
      >
        <span v-if="showCount">{{
          this.$data.count > 0 ? this.$data.count : "\xa0"
        }}</span>
        <span v-else-if="label">{{ this.$props.label }}</span>
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
  computed: {
    countColor() {
      return [
        "#51e2ec",
        "#31c2cc",
        "#11a2ac",
        "#01828c",
        "#01a26c",
        "#01a24C",
        "#01c24c",
        "#01e24c",
        "#01e26c",
        "#01e28c",
        "#01e2ac",
        "#01e2cc",
        "#21e2cc",
        "#41e2cc"
      ][this.count - 1];
    }
  },
  props: {
    note: Number,
    keyboardKey: String,
    showCount: Boolean,
    backgroundColor: String,
    label: String,
    orientation: String,
    duration: String
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
    let limiter = new Tone.Limiter(-2);
    this.synth = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).chain(limiter, Tone.Master);
    this.synth.volume.value = -15;
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
      console.log("touch start", this.note);
      this.$emit("clicked", this.note, this.count);
      this.isActive = true;
      this.count--;
      if (this.count <= 0) {
        this.count = 0;
        this.isActive = false;
      }
      // this.count++;
      this.trigger(this.duration, false);
      // this.synth.triggerAttack(this.noteToFreq(this.$props.note));
      return true;
    },
    onTouchEnd() {
      console.log("touch end!", this.note);
      // if (this.count <= 0) {
      //   this.count = 0;
      //   this.isActive = false;
      // }
      if (!(this.duration > 0)) {
        console.log("onTouchEnd synth release");
        this.synth.triggerRelease();
      }
    },
    onTouch() {
      console.log("generic touch");
    },
    onKeyDown(event) {
      if (this.keyboardKey && event.key == this.keyboardKey) {
        console.log("keypress!");
        this.$emit("clicked", this.note);
        this.isActive = true;
        this.trigger(this.duration);
      }
    },
    onKeyUp(event) {
      if (this.keyboardKey && event.key == this.keyboardKey) {
        console.log("keyup!");
        this.isActive = false;
        this.synth.triggerRelease();
      }
    },
    trigger(duration, incrementCount = true) {
      // this.isActive = true;
      if (incrementCount) {
        this.count++;
      }
      if (this.duration > 0) {
        console.log("Trigger with release, duration:", duration);
        this.synth.triggerRelease();
        this.synth.triggerAttackRelease(
          this.noteToFreq(this.$props.note),
          duration
        );
      } else {
        console.log("Trigger, NO release");
        this.synth.triggerAttack(this.noteToFreq(this.$props.note));
      }
    },
    unTrigger() {
      console.log("force clear");
      this.isActive = false;
      setTimeout(() => this.synth.triggerRelease());
    },
    reset() {
      this.isActive = false;
      this.count = 0;
    }
  }
};
</script>

<style scoped lang="scss">
.active {
  background-color: #51e2ec;
}
</style>
