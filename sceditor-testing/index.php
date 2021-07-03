
<?php

$environments = ['dev', 'stage', 'production'];
$env = $environments[2];


$random_version = rand(10000000, 99999999);
$base_url = 'http://localhost/sandbox/twitter/SCEditor/';
$assets_url = $base_url . ($env == 'production' ? 'minified/' : 'development/');
$backend_url = $base_url . 'backend/ajax.php';
$js_file_extension = $env == 'production' ? '.min.js' : '.js';
$css_file_extension = $env == 'production' ? '.min.css' : '.css';
$style_url = $assets_url . 'themes/default' . $css_file_extension . '?v=' . $random_version;
?>



<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

	<title>SCEditor Demo</title>

	<link rel="stylesheet" href="<?php echo $style_url; ?>" id="theme-style" />
	<script src="<?php echo $assets_url; ?>sceditor<?php echo $js_file_extension; ?>?v=<?php echo $random_version; ?>"></script>
	<script src="<?php echo $assets_url; ?>icons/monocons.js?v=<?php echo $random_version; ?>"></script>
	<script src="<?php echo $assets_url; ?>formats/bbcode.js?v=<?php echo $random_version; ?>"></script>

	<style>
	html {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 13px;
	}
	form div {
		padding: .5em;
	}
	code:before {
		position: absolute;
		content: 'Code:';
		top: -1.35em;
		left: 0;
	}
	code {
		margin-top: 1.5em;
		position: relative;
		background: #eee;
		border: 1px solid #aaa;
		white-space: pre;
		padding: .25em;
		min-height: 1.25em;
	}
	code:before, code {
		display: block;
		text-align: left;
	}
	.twitter_icon {
		width: 10px;
		height: 10px;
		background-color: #000;
	}
	.sceditor-button-twitter div { 
		background: url('<?php echo $base_url; ?>icons/twitter.png'); 
		background-repeat: no-repeat;
		background-size: 16px 16px;
	}
	</style>
</head>
<body>
<form action="" method="post">
	<div>
		<textarea id="example" style="height:300px;width:600px;"></textarea>
	</div>
</form>
<script>
const style_url = <?php echo "'".$style_url."'"; ?>;

let tweetIdentifier = 0;
const urls = ['https://twitter.com/saraacodes/status/1410693634991738887', 'https://twitter.com/Forbes/status/1411080260305760260', 'https://twitter.com/Google/status/1164236418622926849'];

function init() {
	createTwitterButton();
	createEditor();
}

function createTwitterButton() {
	sceditor.command.set('twitter', {
		exec: function() {
			const self = this;
			const xmlString = '<div class="sceditor-dropdown sceditor-insertlink" style="top: 5px; left: 6px; margin-top: 26px;"><div><div><label for="link">Twitter URL: </label><input type="text" id="link" dir="ltr" placeholder="https://"></div><div><input type="button" class="button" value="Lisää"></div></div></div>';
			const node = createElementFromHTML(xmlString);
			document.querySelector(".sceditor-toolbar").appendChild(node);
			document.querySelector('input[value=Lisää]').addEventListener('click', function(e){
				e.preventDefault();
				const url = document.querySelector('input[id=link]').value;
				//const url = urls[tweetIdentifier++];
				if(validateTwitterURL(url)) {
					document.querySelector('.sceditor-dropdown').remove();
					const twitterShareTweetLink = url;
					const tweetRegex = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})/
					const id = twitterShareTweetLink.match(tweetRegex)[3];
					let container = createElementFromHTML('<div class="tweet" id="' + id + '"></div>');
					document.querySelector('body').appendChild(container)
					let tweet = document.querySelector('.tweet');
					self.expandToContent();
					twttr.events.bind('rendered', function (event) {
						self.getBody().firstChild.appendChild(tweet);
						//*
						if(self.getBody().querySelector('.tweet').classList) {
							self.getBody().querySelector('.tweet').classList.remove('tweet');
						}
						//*/
					});
					twttr.widgets.createTweet(id, tweet, {
						conversation: 'all', // or all
						cards: 'visible', // or visible 
						linkColor: '#cc0000', // default is blue
						theme: 'light' // or dark
					});
				}
			});
		}
	});
	
	function createElementFromHTML(htmlString) {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();
		
		// Change this to div.childNodes to support multiple top-level nodes
		return div.firstChild; 
	}

	function validateTwitterURL(str) {
		const pattern = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/i;
		return !!pattern.test(str);
	}
}

function createEditor() {
	let textarea = document.getElementById('example');

	sceditor.create(textarea, {
		format: 'bbcode',
		toolbar: 'youtube,twitter',
		style: style_url,
	});
}

window.onload = init;

</script>

<p>SCEditor is licensed under the <a href="http://www.opensource.org/licenses/mit-license.php">MIT</a></p>

<script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

</body>
</html>
