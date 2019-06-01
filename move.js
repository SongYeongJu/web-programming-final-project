var name;

var gameOver;

var me;

var y=280;
var chW=50;
var chH=50;

var obss=[];
var obsX=[];

var jumpBound=150;
var GroundBound;
var ground=280;

var speed=20;
var state=0;

var jumpStart=false;
var jumpTop=false;

var score=0;
var sTxt;
var times=100;

function jump(){
	if(!gameOver&& jumpStart && !jumpTop){ // cur up
		y-=speed;
		if (y<=jumpBound) jumpTop=true;
	}
	else if(!gameOver&& jumpStart && jumpTop) { // cur down
		y+=speed;
		if (y>=ground) {jumpStart=false; jumpTop=false;}
	}
	me.style.top=y+"px"; 
	if(jumpStart) setTimeout(jump, times);
}
function move_obs(){
		obsX[0] -= speed * 2;
		if(obsX[0] <= -chW) {
			obsX[0] = GroundBound;
			var ran=Math.floor(Math.random() * 10) % 2;
			console.log("random "+ ran);
			obss[0].src="src/obs"+ran+".png";	
		}
		obss[0].style.left= obsX[0] + "px";
}
function check(){
	if(150<=obsX[0] && obsX[0]<=200) {
		if(y>=250) {
			gameOver=true;
			return true;
		}
		return false;
	}
	else 
		return false;
}
function load_rank(){
		window.location.href="rank.html?name="+name+"&score="+score;
}
function move(){
	if(!jumpStart){
		state=(state+1)%2;
		me.src="src/trax"+state+".png";
	}
	move_obs();		
	
	if(check()) {
		document.getElementById('gameover').style.visibility="visible";
		setTimeout(load_rank, 5000);
		return;
	}
	score++;
	sTxt.innerHTML="score : "+score;
	setTimeout(move, times);
}

function load(){
	name = location.href.substr(location.href.lastIndexOf('=') + 1);
	console.log('name : ' + name);


	score=0;
	y=280;	

	jumpStart=false;
	jumpTop=false;

	gameOver=false;
	me=document.getElementById('me');
	me.style.top=y+"px"; 

	sTxt=document.getElementById('score');

	GroundBound=window.innerWidth*0.8;
	console.log("ground bound : "+ GroundBound);

	obss[0]=document.getElementById('obs1');
	obsX[0]=GroundBound;

	setTimeout(move, times);
};
window.onkeydown = function(e) {
	console.log("keyboard input: "+ e.keyCode);


	switch(e.keyCode) {
		case 32:
			if(!jumpStart) {
				jumpStart=true;
				jump();
			}
			break;
	}
}
