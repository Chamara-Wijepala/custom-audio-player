import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const audioPlayer = document.querySelector('.audio-player');
const playBtn = document.getElementById('play-btn');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');

let state = 'play';

const animation = lottieWeb.loadAnimation({
	container: playBtn,
	path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
	renderer: 'svg',
	loop: false,
	autoplay: false,
	name: 'play animation',
});

// change to play icon since the icon animation starts as a pause icon
animation.goToAndStop(14, true);

playBtn.addEventListener('click', () => {
	if (state === 'play') {
		animation.playSegments([14, 27], true);
		state = 'pause';
		playBtn.removeAttribute('aria-label');
		playBtn.setAttribute('aria-label', 'pause button');
	} else {
		animation.playSegments([0, 14], true);
		state = 'play';
		playBtn.removeAttribute('aria-label');
		playBtn.setAttribute('aria-label', 'play button');
	}
});

const showRangeProgress = (rangeInput) => {
	if (rangeInput === seekSlider) {
		audioPlayer.style.setProperty(
			'--seek-before-width',
			(rangeInput.value / rangeInput.max) * 100 + '%'
		);
	} else {
		audioPlayer.style.setProperty(
			'--volume-before-width',
			(rangeInput.value / rangeInput.max) * 100 + '%'
		);
	}
};

seekSlider.addEventListener('input', (e) => {
	showRangeProgress(e.target);
});
volumeSlider.addEventListener('input', (e) => {
	showRangeProgress(e.target);
});
