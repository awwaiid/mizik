# sample-mob

Playing around with WebAudio and mobile interactions. I'm taking inspiration from the very fun [Teenage Engineering PO-33](https://teenage.engineering/store/po-33) and other weird things ([Wicki-Hayden Keyboard](https://en.m.wikipedia.org/wiki/Wicki-Hayden_note_layout)). I'll push demo builds to [https://awwaiid.github.io/sample-mob-web/](https://awwaiid.github.io/sample-mob-web/).

<img src="public/synth-20200119.png?raw=true" alt="Synth Screenshot" width="200px"/>
<img src="public/mizik-20200202.png?raw=true" alt="Mizik Screenshot" width="200px"/>

## Ideas

Synth
* Sample directly from mic/input on device
* Build simple sequences (step sequencer)
* Looper (maybe quantized to step-sequencer)
* Visualize and trim waveforms

Mizik
* Different levels with different layouts or rules
  * Score based on length
  * Bonus score for overlaps
  * Some way to beat levels -- complete coverage or max count
* Non-overlap mode
  * Difficulty level to control how likely overlap is
  * Tile-mode which always gets to each hex once to complete the grid
* Guitar-Hero style song replay mode
* Non-adjacent mode (but now can it still sound good?)
* Swipe mode (ideally with visualized swipe lines)
* Keep score better
  * Use localstorage for local high-score
	* Use Parse (or Firebase) for global high-score

Other
* What sort of benefit might we get from PWA?
* How can we package up to distribute in app stores?

## Resources

* [Hexagon Grid Math](https://www.redblobgames.com/grids/hexagons/)
* [Wicki-Hayden Keyboard](https://en.m.wikipedia.org/wiki/Wicki-Hayden_note_layout)
* [Creating Responsive Shapes with Clip Path](https://www.smashingmagazine.com/2015/05/creating-responsive-shapes-with-clip-path/)

## Development
```bash
# Initial setup
yarn install

# Compiles and hot-reloads for development
yarn serve

# Compiles and minifies for production
yarn build

# Lints and fixes files. Auto-triggered on commit
yarn lint

# Deploy to demo site (github pages repo, force-push)
./deploy
```

