var db;

var name;
var score;

var rankers=[];

var count=0;

var firebaseConfig = {
    apiKey: "AIzaSyDTD5uE7DHKKwT6uUIuKK2wVO-AKXYUciY",
    authDomain: "webprogrammingfinalproject.firebaseapp.com",
    databaseURL: "https://webprogrammingfinalproject.firebaseio.com",
    projectId: "webprogrammingfinalproject",
    storageBucket: "webprogrammingfinalproject.appspot.com",
    messagingSenderId: "322782650178",
    appId: "1:322782650178:web:beb3f350102effcc"
  };

function parsing(){
	var returnValue;
	var url = location.href;	
	var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');	

	name = parameters[0].split('=')[0];
	returnValue = parameters[0].split('=')[1];
	name = decodeURIComponent(returnValue);
	console.log('name2 :'+  name);
	
	
	score = parameters[1].split('=')[0];		
	returnValue = parameters[1].split('=')[1];
	score = parseInt(decodeURIComponent(returnValue));
	console.log('score2 :'+  score);
                
        	
}

function record(){

	firebase.initializeApp(firebaseConfig);

	// 구글 인증 기능 추가
	var provider = new firebase.auth.GoogleAuthProvider();

	// 인증하기
	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
	
		console.log(user)		// 인증 후 어떤 데이터를 받아오는지 확인해보기 위함.
	// ...
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});

	
	var d = new Date();
	db=firebase.database();
	db.ref('ranking/'+d.getTime()+name).set({'name':name,'score':score});	
}
function set_ranker(){
	if(count<11){
		setTimeout(set_ranker, 100);
		return;
	}
	for(var i=0;i<11;i++)
		console.log("rankers:"+rankers[i].score);
	rankers.sort(function(a,b){ return a.score < b.score? -1 : a.score>b.score ? 1 : 0; });

	for(var i=10;i>=1;i--){
		if(rankers[i].name==name && rankers[i].score==score) {
			var ment=document.getElementById('cment');
			ment.style.visibility="visible";
			var g=(11-i);
			if(g==1) ment.innerHTML="Congratulations!! You are in " + g + "st!!";
			else if(g==2) ment.innerHTML="Congratulations!! You are in " + g + "nd!!";
			else if(g==3) ment.innerHTML="Congratulations!! You are in " + g + "rd!!";
			else ment.innerHTML="Congratulations!! You are in " + g + "th!!";
		}
		var txt=document.getElementById('no'+(10-i+1));
		txt.innerHTML=(10-i+1)+"  "+rankers[i].name+"-------------- score:"+rankers[i].score;
	}

}
function load_ranker(){
	var ranking = db.ref('ranking/');
	
	ranking.on('value', function(snapshot) {
	  console.log("value:"+snapshot.val());
	});

	ranking.orderByChild("score").limitToLast(11).on("child_added",function(score) {
		if(count<11){
			rankers[count]={'name':score.val().name,'score':score.val().score};
			console.log(count + " ranker id: "+ score.key +"/"+score.val().score);
			console.log("/"+score.val().name);
			count++;
		}
	});

	set_ranker();
//	while(count<11);

}
function load() {
	parsing();
	record();
	load_ranker();
}
