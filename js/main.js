const repoOwner = 'public-cdn';
const repoName = 'f';
const supportedImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
const ignoreNames = ["CNAME", "README.md", "index.html", "404.html", "blank_popup_bg.png", "blank_popup_ico.png"];
const ignoreDirs = [".github", "code", "css", "js", "td"];

function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.bottom >= 0 &&
		rect.right >= 0 &&
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.left <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

function loadImagesInView() {

	const images = document.querySelectorAll('.images img[lazy="true"]');
	images.forEach(image => {
		if (isInViewport(image)) {
			image.src = image.dataset.src;
			image.removeAttribute('lazy');
		}
	});
}
// Load images when scrolling
document.addEventListener('scroll', loadImagesInView);
// Also check when the page is resized
window.addEventListener('resize', loadImagesInView);

// 启动加载图片
document.addEventListener('DOMContentLoaded', function () {
	
	const imagesContainer = document.querySelector('.images');

	function fetchFiles(path = '') {
		fetch(`https://gh-api.960517.xyz/repos/${repoOwner}/${repoName}/contents/${path}`, {
			headers: {
				'Content-Type': 'application/json',
				'x-token': 'public-cdn',
			}
		})
			.then(response => response.json())
			.then(files => {
				files.forEach(file => {
					if (file.type === 'file') {
						if (!ignoreNames.includes(file.name.toLowerCase()) 
							&& supportedImageFormats.some(format => file.name.toLowerCase().endsWith(format))) {
							const img = document.createElement('img');
							img.src = "https://f.960517.xyz/" + file.path;
							img.alt = file.name;
							img.loading = 'lazy';
							imagesContainer.appendChild(img);
						}
					} else if (file.type === 'dir') {
						if (!ignoreDirs.includes(file.path)){
							fetchFiles(file.path);
						}
					}
				});
			})
			.catch(error => console.error('Error fetching files from GitHub:', error));
	}

	fetchFiles();
	
	loadImagesInView();
});
