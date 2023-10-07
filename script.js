// Presentational logic of the audio player

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

// Functional logic of the audio player

const volumeSliderContainer = document.querySelector(
	'.volume-slider-container'
);
const toggleVolumeSliderBtn = document.getElementById(
	'toggle-volume-slider-btn'
);
const audio = document.querySelector('audio');
const duration = document.getElementById('duration');

const calculateTime = (secs) => {
	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
	duration.textContent = calculateTime(audio.duration);
};

/*
The audio element inherits the HTMLMediaElement interface which provides the
readyState property.
A readyState value of 1 indicates that the metadata is available.
*/
if (audio.readyState > 0) {
	displayDuration();
} else {
	audio.addEventListener('loadedmetadata', () => {
		displayDuration();
	});
}

toggleVolumeSliderBtn.addEventListener('click', () => {
	volumeSliderContainer.classList.toggle('active');
});
