(function() {


  function AudioVisualizer(audioContainer, canvas, btn) {

    this.ctx = document.querySelector(canvas).getContext('2d');
    this.btn = document.querySelector(btn);
    this.audioCtx = new AudioContext();
    this.audio = document.querySelector(audioContainer);
    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
    this.analyser = this.audioCtx.createAnalyser();
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.audioCtx.destination);
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.btn.addEventListener('click', function(e) {

      this.audioCtx.resume().then(() => {
        this.play(e);
      });
      
    }.bind(this), false);

  }

  AudioVisualizer.prototype.render = function() {

    window.requestAnimationFrame(this.render.bind(this));
    this.analyser.getByteFrequencyData(this.frequencyData);
    var bars = 256;
    this.ctx.clearRect(0, 0, 400, 400);
    this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
    var angle = 2 * Math.PI / bars;
    this.ctx.save();
    this.ctx.translate(200, 200);

    for(var i = 0; i < bars; i++) {
      this.ctx.rotate(angle);
      var val = this.frequencyData[i] / 256 * 100;
      this.ctx.fillRect(-1, 100, 1, val);
    }

    this.ctx.restore();
  }

  AudioVisualizer.prototype.play = function(e) {

    if(this.audio.paused) {
        this.audio.play();
        this.render();
        e.target.classList.remove('play');
        e.target.classList.add('pause');
    } else {
        this.audio.pause();
        this.render();
        e.target.classList.remove('pause');
        e.target.classList.add('play');
    }

  }

  var visualizer = new AudioVisualizer('#player', '#canvas', '.btn');

})();