<template>
  <div class="trigger-button">
    <div class="hexagon hexagon2">
      <div class="hexagon-in1">
        <div
          class="hexagon-in2"
          v-touch:start="onTouchStart"
          v-touch:end="onTouchEnd"
          @mousedown="onMouseDown"
          @mouseup="onMouseUp"
          @keypress="onKeyPress"
          v-touch:tap="onTouchTap"
        >
          <span v-if="showCount">{{ this.$data.count }}</span>
          <span v-else>{{ this.$props.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TriggerButton",
  data() {
    return {
      count: 0,
      osc: undefined
    };
  },
  props: {
    note: String,
    audioContext: AudioContext,
    showCount: Boolean
  },
  // data() {
  //   return {
  //     audioContext: new AudioContext()
  //   };
  // },
  // created() {
  // },
  methods: {
    noteToFreq(note) {
      return 2 ** ((note - 49) / 12) * 440;
    },
    beepity(vol, freq) {
      // console.log({ vol, freq, duration });
      let a = this.$props.audioContext;
      // console.log({ currentTime: a.currentTime });
      let v = a.createOscillator();
      this.osc = v;
      let u = a.createGain();
      v.connect(u);
      v.frequency.value = freq;
      v.type = "square";
      u.connect(a.destination);
      u.gain.value = vol * 0.01;
      v.start(a.currentTime);
      // v.stop(a.currentTime + duration * 0.001);
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
      this.$data.count++;
      this.beepity(80, this.noteToFreq(this.$props.note));
    },
    onTouchEnd() {
      console.log("touch end!");
      this.$data.count--;
      this.osc.stop(this.audioContext.currentTime);
    },
    onKeyPress(event) {
      if (event.charCode - 40 == this.note) {
        this.beepity(80, this.noteToFreq(this.$props.note));
        this.osc.stop(this.audioContext.currentTime + 1);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hexagon {
  overflow: hidden;
  visibility: hidden;
  -webkit-transform: rotate(120deg);
  -moz-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  -o-transform: rotate(120deg);
  transform: rotate(120deg);
  cursor: pointer;
}

.hexagon-in1 {
  overflow: hidden;
  width: 100%;
  height: 100%;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
}

.hexagon-in2 {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  /* background-image: url(http://placekitten.com/240/240); */
  visibility: visible;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
}
</style>
