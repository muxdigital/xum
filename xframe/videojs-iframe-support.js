var retryTimeout = 30;
var player;
var isOffline = false; // always first expect stream to be online, then fall back to image
var hasStarted = false;
var waitingTimer;
var tickCounterTimeout;

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function resetCounter(){
    clearTimeout(tickCounterTimeout);
    document.getElementById("restart-counter").innerHTML = pad(retryTimeout,2);
}
function retryPlayback(){
    console.log("retry playback");
    player.src("");
    player.play();
    player.src(document.getElementsByTagName('source')[0]);
    player.play();
}
function tickCounter(){
    var current = parseInt(document.getElementById("restart-counter").innerHTML);
    if ( current <= 0 ){
        resetCounter();
        retryPlayback();
        return;
    }
    document.getElementById("restart-counter").innerHTML = pad(current - 1,2);
    clearTimeout(tickCounterTimeout);
    tickCounterTimeout = setTimeout(tickCounter, 1000);
}
function triggerOffline(){
    console.log("Broadcast is Offline");
    document.getElementsByClassName("OfflineImage")[0].style.display = 'flex';
    player.pause();
    isOffline = true;
    tickCounterTimeout = setTimeout(tickCounter, 1000);
}
function triggerOnline(){
    console.log("Broadcast is Online");
    document.getElementsByClassName("OfflineImage")[0].style.display = 'none';
    isOffline = false;
    hasStarted = true;
    clearTimeout(waitingTimer);
    resetCounter();
}
document.getElementById("restart-counter").innerHTML = pad(retryTimeout,2);

player.on('error', (event) => {
    console.log(event);
    triggerOffline()
}); // hasStopped
player.on('playing', (event) => {
    console.log(event);
    triggerOnline();
}); // triggers hasStarted ?
/*
player.on('waiting', (event) => {
    console.log(hasStarted);
    if (!hasStarted) return; // If the broadcast has never started, we'll ignore the first waiting call
    waitingTimer = setTimeout(triggerOffline, 10000);
});*/

player.on('useractive', (event) => {
    document.querySelector('.custom-volume-button').style.display = 'none';
});
player.on('userinactive', (event) => {
    document.querySelector('.custom-volume-button').style.display = this.player.volume() == 0 || document.querySelector('video').getAttribute('muted') === 'muted' ? 'block' : 'none';
});
player.on('volumechange', (event) => {
    document.querySelector('.custom-volume-button').style.display = this.player.volume() == 0 || document.querySelector('video').getAttribute('muted') === 'muted' ? 'block' : 'none';
});