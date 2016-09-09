// this is the code which will be injected into a given page...

(function () {

	var owatase = {
		state: false,
		load: function () {
			// IE 抹殺
			var userAgent = window.navigator.userAgent.toLowerCase();

			if (userAgent.indexOf('msie') != -1) {
				switcher.disabled = true;
				volume.disabled = true;
				return;
			}

			if (localStorage.state == 'false') {
				switcher.checked = false;
			} else {
				switcher.checked = true;
				this.init();
			}

			if (localStorage.volume != null) {
				volume.value = localStorage.volume;
			} else {
				volume.value = 0;
			}
		},

		init: function () {
			var self = this;
			this.context = new (window.AudioContext || window.webkitAudioContext)();
			this.gainNode = this.context.createGain();
			this.gainNode.connect(this.context.destination);
			this.gainNode.gain.value = 0.6;
			this.source = new Array(4);
			// ファイルを取得 (arraybufferとして)
			var request = new XMLHttpRequest();
			request.open('GET', 'http://www.xlot.jp/game/owatatsujin/owatase/1.wav', true);
			request.responseType = 'arraybuffer';
			request.onload = function () {
				// 読み込みが終わったら、decodeしてbufferにいれておく
				self.context.decodeAudioData(request.response, function (buf) {
					self.buffer = buf;
					self.source[0] = self.context.createBufferSource();
					self.source[0].buffer = self.buffer;
					self.source[0].connect(self.gainNode);
					self.source[0].connect(self.context.destination);
					self.source[1] = self.context.createBufferSource();
					self.source[1].buffer = self.buffer;
					self.source[1].connect(self.gainNode);
					self.source[1].connect(self.context.destination);
				});
			};
			request.send();

			// ファイルを取得 (arraybufferとして)
			var request2 = new XMLHttpRequest();
			request2.open('GET', 'http://www.xlot.jp/game/owatatsujin/owatase/2.wav', true);
			request2.responseType = 'arraybuffer';
			request2.onload = function () {
				// 読み込みが終わったら、decodeしてbufferにいれておく
				self.context.decodeAudioData(request2.response, function (buf) {
					self.buffer2 = buf;
					self.source[2] = self.context.createBufferSource();
					self.source[2].buffer = self.buffer2;
					self.source[2].connect(self.gainNode);
					self.source[2].connect(self.context.destination);
					self.source[3] = self.context.createBufferSource();
					self.source[3].buffer = self.buffer2;
					self.source[3].connect(self.gainNode);
					self.source[3].connect(self.context.destination);
				});
			};
			request2.send();

			this.state = true;
		},

		play: function (num) {
			if (this.state) {
				this.source[num].start(0);
				this.source[num] = this.context.createBufferSource();
				if (num == 0 || num == 1) {
					this.source[num].buffer = this.buffer;
				} else if (num == 2 || num == 3) {
					this.source[num].buffer = this.buffer2;
				}
				this.source[num].connect(this.gainNode);
				this.source[num].connect(this.context.destination);
			}
		},

		changeVolume: function (value) {
			if (this.context) {
				this.gainNode.gain.value = value;
				localStorage.setItem("volume", String(value));
			}
		},

		changeState: function (value) {
			if (value) {
				this.state = true;
				if (!this.context) {
					this.init();
				}
			} else {
				this.state = false;
			}
			localStorage.setItem("state", String(value));
		}
	};

	document.addEventListener('DOMContentLoaded', function () {
		owatase.load();
	}, false);

	const F_KEY = 70;
	const G_KEY = 74;
	const J_KEY = 68;
	const K_KEY = 75;

	var isAvailable = [true, true, true, true];

	document.addEventListener('keydown', keydown, false);
	document.addEventListener('keyup', keyup, false);

	function keydown(event) {
		switch (event.keyCode) {
			case F_KEY:
				if (isAvailable[0]) {
					isAvailable[0] = false;
					owatase.play(0);
					//Festival.countUp('red');
				}
				break;
			case G_KEY:
				if (isAvailable[1]) {
					isAvailable[1] = false;
					owatase.play(1);
					//Festival.countUp('red');
				}
				break;
			case J_KEY:
				if (isAvailable[2]) {
					isAvailable[2] = false;
					owatase.play(2);
					//Festival.countUp('blue');
				}
				break;
			case K_KEY:
				if (isAvailable[3]) {
					isAvailable[3] = false;
					owatase.play(3);
					//Festival.countUp('blue');
				}
				break;
		}
	}

	function keyup(event) {
		switch (event.keyCode) {
			case F_KEY:
				isAvailable[0] = true;
				break;
			case G_KEY:
				isAvailable[1] = true;
				break;
			case J_KEY:
				isAvailable[2] = true;
				break;
			case K_KEY:
				isAvailable[3] = true;
				break;
		}
	}

	owatase.changeState(true);
	owatase.changeVolume(0.6);

})();