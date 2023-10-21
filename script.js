// Presentational logic of the audio player

import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const audioPlayer = document.querySelector('.audio-player');
const playBtn = document.getElementById('play-btn');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const audio = document.querySelector('audio');
const toggleVolumeSliderBtn = document.getElementById(
	'toggle-volume-slider-btn'
);

let state = 'play';

const playAnimation = lottieWeb.loadAnimation({
	container: playBtn,
	path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
	renderer: 'svg',
	loop: false,
	autoplay: false,
	name: 'play animation',
});
const muteAnimation = lottieWeb.loadAnimation({
	container: toggleVolumeSliderBtn,
	path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/no-sound/no-sound.json',
	renderer: 'svg',
	loop: false,
	autoplay: false,
	name: 'mute animation',
});

// change to play icon since the icon animation starts as a pause icon
playAnimation.goToAndStop(14, true);

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
const duration = document.getElementById('duration');
const currentTime = document.getElementById('current-time');
const output = document.getElementById('volume-output');

let raf = null;

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

const whilePlaying = () => {
	seekSlider.value = Math.floor(audio.currentTime);
	currentTime.textContent = calculateTime(seekSlider.value);
	audioPlayer.style.setProperty(
		'--seek-before-width',
		`${(seekSlider.value / seekSlider.max) * 100}%`
	);
	raf = requestAnimationFrame(whilePlaying);
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

playBtn.addEventListener('click', () => {
	if (state === 'play') {
		audio.play();
		playAnimation.playSegments([14, 27], true);
		requestAnimationFrame(whilePlaying);
		state = 'pause';
		playBtn.removeAttribute('aria-label');
		playBtn.setAttribute('aria-label', 'pause button');
	} else {
		audio.pause();
		playAnimation.playSegments([0, 14], true);
		cancelAnimationFrame(raf);
		state = 'play';
		playBtn.removeAttribute('aria-label');
		playBtn.setAttribute('aria-label', 'play button');
	}
});

toggleVolumeSliderBtn.addEventListener('click', () => {
	volumeSliderContainer.classList.toggle('active');
});

audio.addEventListener('progress', displayBufferedAmount);

seekSlider.addEventListener('input', () => {
	currentTime.textContent = calculateTime(seekSlider.value);
	if (!audio.paused) {
		cancelAnimationFrame(raf);
	}
});
// Allow user to seek to a specific part of the audio
seekSlider.addEventListener('change', () => {
	audio.currentTime = seekSlider.value;
	if (!audio.paused) {
		requestAnimationFrame(whilePlaying);
	}
});
volumeSlider.addEventListener('input', (e) => {
	const value = e.target.value;

	output.textContent = value;
	audio.volume = value / 100;

	if (value === '0') {
		muteAnimation.playSegments([0, 14], true);
	} else {
		muteAnimation.goToAndStop(0);
	}
});
