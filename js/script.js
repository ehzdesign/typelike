Parse.initialize("OOkVRnLWzUslbx9quaP8rFGeWPWJwVJnUZoFwKHN", "Dykvp5y6VY7oYWRy36T6Irz0bwrkyhwOcHbNdq1q");

var usernameField = document.getElementsByName('usernameField');
var passwordField = document.getElementsByName('passwordField');
var loginButton = document.getElementById('loginButton');
var signupButton = document.getElementById('signupButton');
var loginForm = document.getElementById('loginForm');
var welcomeCircle = document.getElementById('welcomeCircle');
var welcomeUserInitial = document.getElementById('welcomeUserInitial');
var welcomeMessage = document.getElementById('welcomeMessage');
// var mainContent = document.getElementById('mainContent');
var siteWrapper = document.getElementById('siteWrapper');



var bgColors = ['#CFF09E','#79BD9A', '#3B8686', '#C44D58', '#73626E', '#B38184', '#33dfaa', '#F5D76E'];

loginButton.addEventListener('click', loginHandler);
signupButton.addEventListener('click', signupHandler);

var user = new Parse.User();

//new user signup function
function signupHandler(){
	user.set("username", usernameField[0].value);
	user.set("password", passwordField[0].value);
	
	user.signUp(null, {
		success:function(user){
			console.log("worked");
			hideLogin();
			displayUserInitial();
			displayWelcomeMessage();
		},
		error: function (user, error){
			console.log('error '+ error.code);
		}
	});
};

//returning user login function
function loginHandler(){
	user.set('username', usernameField[0].value);
	user.set('password', passwordField[0].value);
	
	user.logIn({
		success:function(user){
			console.log('login worked');
			hideLogin();
			displayUserInitial();
			displayWelcomeMessage();
		},
		error:function(user, error){
			console.log('error '+ error.code);
		}
	})
};



function hideLogin(){
	// hide the login form inputs
	$('.loginForm').fadeOut('slow');
}

function displayUserInitial(){
	// display random bg color for welcomeCircle
	$('.welcomeCircle').css('background-color', bgColors[Math.floor(Math.random() * bgColors.length)]);
	// display username initial in welcomeCircle
	welcomeUserInitial.textContent = ((user.get('username')).charAt(0));
	// display welcomeCirlce
	$('.welcomeCircle').fadeIn('slow');
}

function displayWelcomeMessage(){
	// display username in userSidebar
	welcomeMessage.textContent = user.get('username');
}





var Post = function (data){
	// create elements for post with post data
	var thisPost = this;
	thisPost.name = data.get('name');
	thisPost.image = data.get('image');
	thisPost.category = data.get('category');
	thisPost.data = data;


	thisPost.numberOfLikesRelation = this.data.relation('likes');
	
	thisPost.imageHTML = document.createElement('IMG');
	thisPost.container = document.createElement('DIV');
	thisPost.postTextContent = document.createElement('DIV');
	thisPost.postName = document.createElement('P');
	thisPost.commentAndLikeContainer = document.createElement('DIV');
	thisPost.commentButton = document.createElement('I');
	thisPost.amountOfCommentsText = document.createElement('P');
	thisPost.likeButton = document.createElement('I');
	thisPost.amountOfLikesText = document.createElement('P');

	this.makePostHTML = function(){
		
		thisPost.container.appendChild(thisPost.imageHTML);
		thisPost.imageHTML.src = thisPost.image;
		thisPost.imageHTML.className = "postImage";
		thisPost.postTextContent.appendChild(thisPost.postName);
		thisPost.postName.textContent = thisPost.name;
		thisPost.postName.className = 'postName';
		thisPost.commentAndLikeContainer.appendChild(thisPost.commentButton);
		thisPost.commentAndLikeContainer.appendChild(thisPost.amountOfCommentsText);
		thisPost.commentAndLikeContainer.appendChild(thisPost.likeButton);
		thisPost.commentAndLikeContainer.appendChild(thisPost.amountOfLikesText);
		thisPost.commentButton.className = 'fa fa-comment-o';
		thisPost.likeButton.className = 'fa fa-heart-o';
		thisPost.likeButton.addEventListener('click', thisPost.postLiked.bind(thisPost));
		
		//display on screen amount of likes this Post has
		thisPost.numberOfLikesRelation.query().find({
					success:function(listOfLikes){
						thisPost.amountOfLikesText.textContent = listOfLikes.length;
					}
				});

		thisPost.amountOfCommentsText.textContent = '244';
		thisPost.postTextContent.appendChild(thisPost.commentAndLikeContainer);
		thisPost.commentAndLikeContainer.className = 'commentAndLikeContainer';
		thisPost.container.appendChild(thisPost.postTextContent);
		thisPost.postTextContent.className = "postTextContent";
		siteWrapper.appendChild(thisPost.container);
		thisPost.container.className = ('postContainer');

}

	//keep track of the amount of likes the post receives from users
	thisPost.postLiked = function(){
		thisPost.numberOfLikesRelation.add(user);
	
		thisPost.data.save(null,{
			success:function (result){
				thisPost.numberOfLikesRelation.query().find({
					success:function(listOfLikes){
						//display on screen amount of likes this Post has
						thisPost.amountOfLikesText.textContent = listOfLikes.length;
					}
				});
			}
		});

	//keep track of posts the user likes
		bikesThisUserLikes = user.relation('likes');
		bikesThisUserLikes.add(this.data);
		user.save();
		bikesThisUserLikes.query().find({
			success:function(listOfLikes){
				console.log(listOfLikes.length);
			}
		});

	}







	





	thisPost.makePostHTML();

	
	//change comments icon and like icon on hover
	$('.fa-comment-o').hover(function() {
		$(this).removeClass('fa-comment-o');
		$(this).addClass('fa-comment');
	}, function() {
		$(this).removeClass('fa-comment');
		$(this).addClass('fa-comment-o');

	});

	$('.fa-heart-o').hover(function() {
		$(this).removeClass('fa-heart-o');
		$(this).addClass('fa-heart');
	}, function() {
		$(this).removeClass('fa-heart');
		$(this).addClass('fa-heart-o');

	});


}

















var PostData = Parse.Object.extend("Posts");
var query = new Parse.Query (PostData);
query.find({
	success: function(results){
		for (var i=0; i<results.length; i++){
			var postData = results[i];
			var post = new Post (postData);
		}
		

	},
	error: function(error){
		alert("something went wrong: error is " + error.message);
	}
});


