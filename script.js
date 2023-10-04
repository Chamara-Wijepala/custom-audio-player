import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playBtn = document.getElementById('play-btn');

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
