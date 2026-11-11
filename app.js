const question = document.querySelector('#questions h2');
const choices = document.querySelector('#choices');
const letter = document.querySelector('#letter');
const audio = document.querySelector('audio');
const toggle = document.querySelector('#toggle');
const player = document.querySelector('#player');

function ask(title, options) {
  question.textContent = title;
  choices.replaceChildren(...options.map(([action, label]) => {
    const button = document.createElement('button');
    button.dataset.action = action;
    button.textContent = label;
    return button;
  }));
  question.focus();
}

function updatePlayer() {
  if (audio.ended) {
    player.hidden = true;
    return;
  }
  toggle.textContent = audio.paused ? '▷ Включить «Улыбку»' : 'Ⅱ Пауза';
}
async function playSong() {
  try {
    await audio.play();
    player.querySelector('small').textContent = '';
  } catch {
    player.querySelector('small').textContent = 'Нажми ещё раз, чтобы включить песню.';
  }
  updatePlayer();
}
audio.loop = false;
audio.autoplay = false;
audio.addEventListener('ended', updatePlayer);
window.addEventListener('pagehide', () => audio.pause());
audio.addEventListener('play', updatePlayer);
audio.addEventListener('pause', updatePlayer);
toggle.addEventListener('click', () => audio.paused ? playSong() : audio.pause());

choices.addEventListener('click', event => {
  const action = event.target.closest('button')?.dataset.action;
  if (!action) return;
  if (action === 'start') {
    ask('Какой свет зажжём?', [['warm', 'Тёплый, как от лампы'], ['moon', 'Мягкий лунный']]);
  } else if (action === 'moon' || action === 'warm') {
    document.body.classList.toggle('moon', action === 'moon');
    ask('Включим нашу «Улыбку»?', [['music', 'Включить нашу песню'], ['quiet', 'Почитать в тишине']]);
  } else {
    if (action === 'music') playSong();
    updatePlayer();
    player.hidden = false;
    ask('Теперь нажми на конверт', []);
    const lift = document.querySelector('#lift');
    lift.hidden = false;
    lift.focus({preventScroll:true});
  }
});

document.querySelector('#lift').addEventListener('click', async () => {
    const envelope = document.querySelector('#envelope');
    document.querySelector('#lift').hidden = true;
    document.querySelector('#questions').hidden = true;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    envelope.classList.add('in-flight');
    if (!reduceMotion) await Promise.all(envelope.getAnimations({subtree:true}).map(animation => animation.finished.catch(() => {})));
    document.body.classList.add('opened');
    letter.hidden = false;
    letter.querySelector('h2').focus({preventScroll:true});
    letter.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});

});


