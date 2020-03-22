function Search($scope, $http, SpeechService, $rootScope, Focus) {
	var searchYouTube = function (query) {
		return $http({
			url: 'https://www.googleapis.com/youtube/v3/search',
			method: 'GET',
			params: {
				'maxResults': '25',
				'part': 'snippet',
				'order': 'relevance',
				'q': query,
				'type': 'video',
				'videoEmbeddable': 'true',
				'videoSyndicated': 'any',
                //Sharing this key in the hopes that it wont be abused 
				'key': config.youtube.key
			}
		});
	}
	var pauseVideo = function() {
		var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
		iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
	}
	var playVideo = function() {
		var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
		iframe.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
	}
	var stopVideo = function() {
		var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
		iframe.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
	}
	$scope.previousVideo = "XHDRfSjo58A";
	$scope.currentVideo = "XHDRfSjo58A";
	var rewindVideo = function() {
		var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
		iframe.postMessage('{"event":"command","func":"' + 'seekTo' + '","args":[0, true]}', '*');
	}
	$scope.previousVideo = "XHDRfSjo58A";
	$scope.currentVideo = "XHDRfSjo58A";
    //Search for a video
	SpeechService.addCommand('video_search', function (query) {
		$scope.previousVideo = $scope.currentVideo;
		searchYouTube(query).then(function (results) {
            //Set cc_load_policy=1 to force captions
            var randomNumber = Math.floor(Math.random() * 26);
			$scope.video = 'https://www.youtube.com/embed/' + results.data.items[randomNumber].id.videoId + '?autoplay=1&controls=0&iv_load_policy=3&enablejsapi=1&showinfo=0&rel=0';
			console.log($scope.currentVideo);
			Focus.change("video");
		});
	});
	SpeechService.addCommand('video_rewind', function () {
		Focus.change("video");
		rewindVideo();
		console.log("Rewinded");
	});
    //Play video
	SpeechService.addCommand('video_play', function () {
		Focus.change("video");
		playVideo();
	});
    //Pause video
	SpeechService.addCommand('video_pause', function () {
		Focus.change("video");
		pauseVideo();
		console.log($scope.previousVideo);
	});
    //Stop video
	SpeechService.addCommand('video_stop', function () {
		Focus.change("default");
		stopVideo();
	});
	    //replay video
	SpeechService.addCommand('replay_video', function () {
            		stopVideo();
		//Set cc_load_policy=1 to force captions
			$scope.video = 'https://www.youtube.com/embed/' + $scope.currentVideo + '?autoplay=1&controls=0&iv_load_policy=3&enablejsapi=1&showinfo=0&rel=0';
			console.log($scope.previousVideo);
			playVideo();
			Focus.change("video");
	});
		// play previous video
	SpeechService.addCommand('previous_video', function () {
            //Set cc_load_policy=1 to force captions
// 			var randomNumber = Math.floor(Math.random() * 26);
			$scope.video = 'https://www.youtube.com/embed/' + $scope.previousVideo + '?autoplay=1&controls=0&iv_load_policy=3&enablejsapi=1&showinfo=0&rel=0';
			$scope.playback = $scope.previousVideo;
			$scope.previousVideo = $scope.currentVideo;
			$scope.currentVideo = $scope.playback;
			Focus.change("video");
	});
	$rootScope.$on('focus', function (targetScope, newFocus, oldFocus) {
		if(oldFocus == "video" && newFocus != "video"){
			stopVideo();
		}
	})

}

angular.module('SmartMirror')
    .controller('Search', Search);