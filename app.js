const $ = id => document.getElementById(id);
const els = {
  hours:$('hours'), minutes:$('minutes'), seconds:$('seconds'),
  state:$('stateText'), dot:$('stateDot'), chip:$('targetChip'),
  end:$('endTimeLabel'), progress:$('progressBar'), progressLabel:$('progressLabel'),
  card:document.querySelector('.timer-card'), setup:$('setupPanel'),
  active:$('activeControls'), done:$('donePanel'), toast:$('toast')
};
let targetDate=null, startDate=null, interval=null, paused=false, remainingAtPause=0, soundOn=false, audioCtx=null;
const pad=n=>String(n).padStart(2,'0');
function showToast(message){els.toast.textContent=message;els.toast.classList.add('show');setTimeout(()=>els.toast.classList.remove('show'),2200)}
function setDigit(el,value){if(el.textContent!==value){el.textContent=value;el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick')}}
function formatTime(date){return date.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}
function start(){
  const value=$('targetTime').value;if(!value){showToast('Please choose a target time first.');return}
  const [h,m]=value.split(':').map(Number), now=new Date();
  targetDate=new Date(now);targetDate.setHours(h,m,0,0);if(targetDate<=now)targetDate.setDate(targetDate.getDate()+1);
  startDate=new Date(now);paused=false;remainingAtPause=0;
  $('pauseBtn').innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg> Pause';
  els.setup.classList.add('hidden');els.done.classList.add('hidden');els.active.classList.remove('hidden');
  els.card.classList.add('running');els.state.textContent='COUNTDOWN IN PROGRESS';els.chip.textContent='TARGET · '+formatTime(targetDate);
  els.end.textContent=formatTime(targetDate);els.progressLabel.textContent='Time remaining';
  document.body.classList.remove('fullscreen-mode');render();clearInterval(interval);interval=setInterval(render,250);
}
function render(){
  if(!targetDate)return;
  const diff=Math.max(0,targetDate-Date.now()), total=Math.ceil(diff/1000);
  setDigit(els.hours,pad(Math.floor(total/3600)));
  setDigit(els.minutes,pad(Math.floor(total%3600/60)));
  setDigit(els.seconds,pad(total%60));
  const duration=targetDate-startDate, elapsed=Date.now()-startDate;
  els.progress.style.width=Math.min(100,Math.max(0,elapsed/duration*100))+'%';
  if(diff<=0)finish();
}
function finish(){
  clearInterval(interval);interval=null;targetDate=null;
  els.state.textContent='COUNTDOWN COMPLETE';els.dot.style.background='#5fe0b0';
  els.progress.style.width='100%';els.progressLabel.textContent='You reached your target';
  els.active.classList.add('hidden');els.done.classList.remove('hidden');
  if(soundOn)playChime();document.title="Time's up · SRB Countdown";
  if('vibrate' in navigator)navigator.vibrate([180,80,180,80,350]);
}
function resetView(){
  clearInterval(interval);interval=null;targetDate=null;paused=false;
  els.setup.classList.remove('hidden');els.active.classList.add('hidden');els.done.classList.add('hidden');
  els.card.classList.remove('running');els.state.textContent='READY WHEN YOU ARE';
  els.chip.textContent='NO TARGET SET';els.end.textContent='—';els.progress.style.width='0%';els.progressLabel.textContent='Waiting to begin';
  setDigit(els.hours,'00');setDigit(els.minutes,'00');setDigit(els.seconds,'00');
  document.title='SRB Countdown';document.body.classList.remove('fullscreen-mode');
}
function togglePause(){
  if(!targetDate)return;
  if(!paused){remainingAtPause=targetDate-Date.now();clearInterval(interval);interval=null;paused=true;$('pauseBtn').innerHTML='<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z"/></svg> Resume';els.state.textContent='COUNTDOWN PAUSED';els.progressLabel.textContent='Paused';}
  else{targetDate=new Date(Date.now()+remainingAtPause);startDate=new Date(Date.now()-(Date.now()-(targetDate-remainingAtPause)));paused=false;$('pauseBtn').innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg> Pause';els.state.textContent='COUNTDOWN IN PROGRESS';els.progressLabel.textContent='Time remaining';interval=setInterval(render,250);render();}
}
async function fullscreen(){
  try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();document.body.classList.add('fullscreen-mode')}else{await document.exitFullscreen();document.body.classList.remove('fullscreen-mode')}}catch(e){showToast('Fullscreen is not available in this browser.')}
}
document.addEventListener('fullscreenchange',()=>document.body.classList.toggle('fullscreen-mode',!!document.fullscreenElement));
function playChime(){
  try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();[0,0.22,0.44].forEach((delay,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=[660,830,990][i];g.gain.setValueAtTime(.0001,audioCtx.currentTime+delay);g.gain.exponentialRampToValueAtTime(.18,audioCtx.currentTime+delay+.03);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+delay+.45);o.connect(g);g.connect(audioCtx.destination);o.start(audioCtx.currentTime+delay);o.stop(audioCtx.currentTime+delay+.48)})}catch(e){}
}
$('startBtn').addEventListener('click',start);$('changeBtn').addEventListener('click',resetView);$('pauseBtn').addEventListener('click',togglePause);$('fullBtn').addEventListener('click',fullscreen);$('againBtn').addEventListener('click',resetView);
$('soundBtn').addEventListener('click',()=>{soundOn=!soundOn;$('soundBtn').style.color=soundOn?'#75e0cb':'#aeb9d7';showToast(soundOn?'Finish sound enabled':'Finish sound muted')});
if('serviceWorker' in navigator && location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
