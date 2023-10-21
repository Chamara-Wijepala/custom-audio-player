// Presentational logic of the audio player

import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const audioPlayer = document.querySelector('.audio-player');
const playBtn = document.getElementById('play-btn');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const audio = document.querySelector('audio');

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
		audio.play();
		animation.playSegments([14, 27], true);
		state = 'pause';
		playBtn.removeAttribute('aria-label');
		playBtn.setAttribute('aria-label', 'pause button');
	} else {
		audio.pause();
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
const duration = document.getElementById('duration');
const currentTime = document.getElementById('current-time');

const calculateTime = (secs) => {
	const minutes = Math.floor(secs / 60);
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
	duration.textContent = calculateTime(audio.duration);
};

// Set the max value of the slider to the duration of the song so that the range
// reaches the end when the song finishes
const setSliderMax = () => {
	seekSlider.max = Math.floor(audio.duration);
};

const displayBufferedAmount = () => {
	const bufferedAmount = Math.floor(
		audio.buffered.end(audio.buffered.length - 1)
	);
	audioPlayer.style.setProperty(
		'--buffered-width',
		`${(bufferedAmount / seekSlider.max) * 100}%`
	);
};

/*
The audio element inherits the HTMLMediaElement interface which provides the
readyState property.
A readyState value of 1 indicates that the metadata is available.
*/
if (audio.readyState > 0) {
	displayDuration();
	setSliderMax();
	displayBufferedAmount();
} else {
	audio.addEventListener('loadedmetadata', () => {
		displayDuration();
		setSliderMax();
		displayBufferedAmount();
	});
}

toggleVolumeSliderBtn.addEventListener('click', () => {
	volumeSliderContainer.classList.toggle('active');
});

audio.addEventListener('progress', displayBufferedAmount);

seekSlider.addEventListener('input', () => {
	currentTime.textContent = calculateTime(seekSlider.value);
});
// Allow user to seek to a specific part of the audio
seekSlider.addEventListener('change', () => {
	audio.currentTime = seekSlider.value;
});
