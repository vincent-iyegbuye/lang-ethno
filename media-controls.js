// Progressive enhancement: native controls remain available without JavaScript.
document.querySelectorAll('#sorryRecording audio, #pepperVideo').forEach(media => {
  const isVideo = media.tagName === 'VIDEO';
  const label = isVideo ? 'Video' : 'Audio';
  const controls = document.createElement('div');
  controls.className = 'media-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', `${label} playback controls`);
  controls.innerHTML = `
    <div class="media-timeline"><span class="media-current">0:00</span><input class="media-seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="${label} position" disabled><span class="media-duration">—:—</span></div>
    <div class="media-buttons">
      <button class="media-play" type="button" aria-label="Play ${label.toLowerCase()}"><span aria-hidden="true">▶</span><span class="media-play-label">Play</span></button>
      <button class="media-rewind" type="button" aria-label="Rewind ${label.toLowerCase()} 10 seconds" title="Back 10 seconds">↶ <span>10s</span></button>
      <div class="media-volume"><button class="media-mute" type="button" aria-label="Mute ${label.toLowerCase()}" aria-pressed="false">Sound</button><input type="range" min="0" max="1" step="0.05" value="1" aria-label="${label} volume"></div>
      <select class="media-speed" aria-label="${label} playback speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select>
      ${isVideo ? '<button class="media-fullscreen" type="button" aria-label="Enter fullscreen" title="Fullscreen">⛶</button>' : ''}
    </div><p class="media-message" role="status" hidden></p>`;
  const find = selector => controls.querySelector(selector);
  const play = find('.media-play');
  const seek = find('.media-seek');
  const volume = find('.media-volume input');
  const mute = find('.media-mute');
  const message = find('.media-message');
  const formatTime = value => {
    if (!Number.isFinite(value)) return '—:—';
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  };
  function updateTime() {
    const duration = media.duration;
    const valid = Number.isFinite(duration) && duration > 0;
    seek.disabled = !valid;
    seek.max = valid ? duration : 100;
    seek.value = media.currentTime;
    seek.style.setProperty('--fill', `${valid ? media.currentTime / duration * 100 : 0}%`);
    seek.setAttribute('aria-valuetext', `${formatTime(media.currentTime)} of ${formatTime(duration)}`);
    find('.media-current').textContent = formatTime(media.currentTime);
    find('.media-duration').textContent = formatTime(duration);
  }
  function updatePlayback() {
    const playing = !media.paused && !media.ended;
    play.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${label.toLowerCase()}`);
    play.querySelector('[aria-hidden]').textContent = playing ? 'Ⅱ' : '▶';
    find('.media-play-label').textContent = playing ? 'Pause' : media.ended ? 'Replay' : 'Play';
    controls.classList.toggle('is-playing', playing);
  }
  play.addEventListener('click', async () => {
    if (!media.paused) { media.pause(); return; }
    try {
      message.hidden = true;
      await media.play();
    } catch {
      message.textContent = 'Playback could not start. Try again or open the recording directly.';
      message.hidden = false;
    }
    updatePlayback();
  });
  seek.addEventListener('input', () => { media.currentTime = Number(seek.value); updateTime(); });
  find('.media-rewind').addEventListener('click', () => { media.currentTime = Math.max(0, media.currentTime - 10); updateTime(); });
  volume.addEventListener('input', () => { media.volume = Number(volume.value); media.muted = media.volume === 0; });
  mute.addEventListener('click', () => {
    if (media.volume === 0) { media.volume = 0.5; media.muted = false; }
    else media.muted = !media.muted;
  });
  function updateVolume() {
    const silent = media.muted || media.volume === 0;
    mute.textContent = silent ? 'Muted' : 'Sound';
    mute.setAttribute('aria-label', `${silent ? 'Unmute' : 'Mute'} ${label.toLowerCase()}`);
    mute.setAttribute('aria-pressed', String(silent));
    volume.value = silent ? 0 : media.volume;
    volume.style.setProperty('--fill', `${Number(volume.value) * 100}%`);
  }
  find('.media-speed').addEventListener('change', event => { media.playbackRate = Number(event.target.value); });
  ['loadedmetadata', 'durationchange', 'timeupdate', 'ended'].forEach(event => media.addEventListener(event, updateTime));
  ['play', 'pause', 'ended'].forEach(event => media.addEventListener(event, updatePlayback));
  media.addEventListener('volumechange', updateVolume);
  media.addEventListener('ratechange', () => { find('.media-speed').value = String(media.playbackRate); });
  function showError() {
    message.textContent = 'The recording could not load. Refresh the page or open the recording directly.';
    message.hidden = false;
  }
  media.addEventListener('error', showError);
  media.querySelectorAll('source').forEach(source => source.addEventListener('error', showError));
  if (isVideo) {
    const fullscreen = find('.media-fullscreen');
    const frame = media.parentElement;
    if (!document.fullscreenEnabled || !frame.requestFullscreen) fullscreen.hidden = true;
    else {
      fullscreen.addEventListener('click', async () => {
        try { if (document.fullscreenElement === frame) await document.exitFullscreen(); else await frame.requestFullscreen(); }
        catch { message.textContent = 'Fullscreen is unavailable in this browser.'; message.hidden = false; }
      });
      document.addEventListener('fullscreenchange', () => fullscreen.setAttribute('aria-label', document.fullscreenElement === frame ? 'Exit fullscreen' : 'Enter fullscreen'));
    }
    const direct = document.createElement('a');
    direct.className = 'media-direct-link';
    direct.href = media.querySelector('source').getAttribute('src');
    direct.textContent = 'Open video directly ↗';
    controls.append(direct);
  }
  media.insertAdjacentElement('afterend', controls);
  updateTime(); updatePlayback(); updateVolume();
  media.controls = false;
  if (!isVideo) media.classList.add('audio-enhanced');
});
