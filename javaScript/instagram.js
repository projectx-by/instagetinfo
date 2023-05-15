let inputForm, searchButton, radioButtonDiv, footerResult, containerResult;
inputForm = document.getElementById('keyword');
searchButton = document.getElementById('searchBtn');
footerResult = document.getElementById('footer-result');
containerResult = document.getElementById('container-result');
radioButtonDiv = document.getElementById('btn-radio');

let getByUsername = 'https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info';
let getByID = 'https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info_by_id';
let proxyHeroku = 'https://cors-anywhere.herokuapp.com/';


inputForm.addEventListener('input', (e) => {
  if (document.getElementById('input-username').checked == true) {
    return userInfo.body = `{"username":"${e.target.value}"}`;
  } else {
    return userInfo.body = `{"id":"${e.target.value}"}`;
  }
})
inputForm.addEventListener('keypress', (target) => {
  if (target.key === 'Enter') {
    searchButton.click();
  }
})
searchButton.addEventListener('click', () => {
  executed();
})
inputForm.addEventListener('focusin', () => {
  searchButton.classList.remove('bg-secondary')
  searchButton.classList.add('bg-light');
  radioButtonDiv.classList.add('bg-secondary');
})
inputForm.addEventListener('focusout', () => {
  searchButton.classList.add('bg-secondary');
  searchButton.classList.remove('bg-light');
  radioButtonDiv.classList.remove('bg-secondary');
})

let btnRadioClose = document.getElementById('btn-radio-close');
btnRadioClose.addEventListener('click', () => {
  if (document.getElementById('input-username').checked == true) {
    document.getElementById('btn-checked').textContent = 'Username';
    inputForm.setAttribute('placeholder', 'ex: 0xwildcard');
    inputForm.setAttribute('type', 'text');
    inputForm.value = '';
  } else {
    document.getElementById('btn-checked').textContent = 'User ID';
    inputForm.setAttribute('placeholder', 'ex: 7430039768');
    inputForm.setAttribute('type', 'number');
    inputForm.value = '';
  }
})

async function executed() {
  if (containerResult.hasChildNodes()) {
    containerResult.innerHTML = '';
    footerResult = document.createElement('div');
    footerResult.setAttribute('id', 'footer-result');
    containerResult.appendChild(footerResult);
  }
  loadingEffect();
  let responseAPI;
  if (document.getElementById('input-username').checked == true) {
    responseAPI = await getInfo(getByUsername, userInfo)
  } else {
    let tempResponApi = await getInfo(getByID, userInfo);
    try {
      convertIdToUsername(tempResponApi);
      responseAPI = await getInfo(getByUsername, userInfo)
    } catch {
      document.getElementById('loader').remove();
      errorHandle()
    };
  }
  console.log(responseAPI);
  setTimeout(function () {
    document.getElementById('loader').remove();
    if (responseAPI.status == 'timeout' || responseAPI.status == 'error' || responseAPI.response.status_code == 404) {
      errorHandle();
    } else {
      profile(responseAPI);
      userPost(responseAPI);
    }
  }, 5000);
}
function convertIdToUsername(res) {
  return userInfo.body = `{"username":"${res.response.body.user.username}"}`;
}
function profile(res) {
  let profileDiv = document.createElement('div');
  profileDiv.setAttribute('class', 'ca rd')
  profileDiv.classList.add('mb-3');
  profileDiv.classList.add('mx-3');
  profileDiv.setAttribute('style', 'max-width: 500px; outline:none; border:none; background-color: #000;');
  profileDiv.setAttribute('id', 'profileDiv');
  profileDiv.innerHTML = `<div class="row g-0">
    <div class="col-md-4">
      <div class="rounded-circle border border-dark" style="overflow: hidden; width: max-content;">
        <img src="${res.response.body.data.user.profile_pic_url_hd}" class="img-fluid" alt="profile-picture" crossorigin="anonymous" style="width: 150px; height:150px;cursor:pointer;" id="main-img">
      </div>
    </div>
    <div class="col-md-8">
      <div class="card-body" id="card-body">
        <h5 class="card-title" id="full-name">${res.response.body.data.user.full_name}</h5>
        <span class="card-title text-muted">is_private : ${res.response.body.data.user.is_private}</span>
        <div class="username-uid d-flex justify-content-start">
          <p class="text-muted" id="username">@${res.response.body.data.user.username}</p>
          <p class="text-muted ms-3" id="uid">UID: ${res.response.body.data.user.id}</p>
        </div>
        <div class="follow-following d-flex justify-content-start">
          <p><span id="following">${res.response.body.data.user.edge_follow.count} </span><span class="text-muted">Following</span></p>
          <p><span id="followed-by" class="ms-3">${res.response.body.data.user.edge_followed_by.count} </span><span class="text-muted"s>Followers</span></p>
        </div>
        <p class="card-text" id="biography">${res.response.body.data.user.biography}</p>
      </div>
    </div>
  </div>
</div>`;
  containerResult.insertBefore(profileDiv, footerResult);
  if (res.response.body.data.user.bio_links.length != 0) {
    for (i = 0; i < res.response.body.data.user.bio_links.length; i++) {
      let pbioLinks = document.createElement('p');
      pbioLinks.setAttribute('class', 'card-text');
      pbioLinks.innerHTML = `<a href="${res.response.body.data.user.bio_links[0].url}" class="text-white">${res.response.body.data.user.bio_links[0].url}</a>`;
      let pbiography = document.getElementById('biography');
      document.getElementById('card-body').insertBefore(pbioLinks, pbiography);
    }
  }
  let getImgSrc = document.getElementById('main-img').getAttribute('src');
  modalProfile(getImgSrc);
}

function userPost(res) {
  let headerPost = document.createElement('h5');
  headerPost.setAttribute('class', 'text-white');
  headerPost.setAttribute('class', 'ms-3');
  headerPost.setAttribute('id', 'header-post');
  headerPost.innerHTML = `<span>Latest Post From @<a href="https://www.instagram.com/${res.response.body.data.user.username}/" class="text-white">${res.response.body.data.user.username}</a></span>`;
  containerResult.insertBefore(headerPost, footerResult);
  let listPost = res.response.body.data.user.edge_owner_to_timeline_media.edges;
  if (listPost.length == 0 || res.response.body.data.user.is_private == true) {
    let bodyPost = document.createElement('div');
    bodyPost.setAttribute('class', 'card');
    bodyPost.classList.add('mx-3');
    bodyPost.classList.add('bg-dark');
    bodyPost.classList.add('rounded');
    bodyPost.setAttribute('id', 'body-post');
    bodyPost.setAttribute('style', 'max-width: 90vw; outline: none; border: none;');
    bodyPost.innerHTML = `<div class="row g-0 mx-2 my-2">
    <div class="col-md-4">
    </div>
    <div class="col-md-8">
      <div class="card-body text-white" id="card-body">
        <p class="card-text text-center">No Post Here</p>
      </div>
    </div>
  </div>`
    containerResult.insertBefore(bodyPost, footerResult);
  } else {
    for (i = 0; i < listPost.length; i++) {
      let bodyPost = document.createElement('div');
      bodyPost.setAttribute('class', 'card');
      bodyPost.classList.add('mx-3');
      bodyPost.classList.add('bg-dark');
      bodyPost.classList.add('rounded');
      bodyPost.setAttribute('id', 'body-post');
      bodyPost.setAttribute('style', 'max-width: 90vw; outline: none; border: none; position: relative;');

      bodyPost.innerHTML = `<div class="row g-0 mx-2 my-2">
    <div class="col-md-4">
      <img src="${listPost[i].node.thumbnail_resources[4].src}"class="img-fluid" alt="post-images" crossorigin="anonymous">
    </div>
    <div class="col-md-8">
      <div class="card-body text-white" id="card-body-${i}">
        <h5 class="card-title" id="caption${i}">${listPost[i].node.accessibility_caption}</h5>
        <span class="text-muted">${listPost[i].node.__typename}</span>
        <p class="card-text" id="node-text${i}"></p>
      </div>
    </div>
  </div>`;
      containerResult.insertBefore(bodyPost, footerResult);
      let caption = document.getElementById(`caption${i}`);
      caption.textContent == 'null' ? caption.textContent = '' : caption.textContent = listPost[i].node.accessibility_caption;
      listPost[i].node.edge_media_to_caption.edges.length == 0 ? document.getElementById(`node-text${i}`).textContent = '' : document.getElementById(`node-text${i}`).textContent = listPost[i].node.edge_media_to_caption.edges[0].node.text;

      if (listPost[i].node.__typename == 'GraphSidecar') {
        // childPostList(listPost[i].node.edge_sidecar_to_children);
        let childList = listPost[i].node.edge_sidecar_to_children.edges;
        let pBtnDetails = document.createElement('p');
        pBtnDetails.setAttribute('class', 'd-flex');
        pBtnDetails.setAttribute('id', `details-${i}`);
        pBtnDetails.setAttribute('data-bs-target', `#posts${i}`)
        pBtnDetails.setAttribute('data-bs-toggle', 'modal');
        pBtnDetails.setAttribute('onclick', `showSlides(1,${i})`);
        pBtnDetails.setAttribute('style', `position:absolute;bottom:0;right:5px;z-index:100;cursor:pointer;`);
        pBtnDetails.classList.add('justify-content-end');
        pBtnDetails.classList.add('blink_icon');
        pBtnDetails.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
</svg>`;
        document.getElementById(`card-body-${i}`).appendChild(pBtnDetails);
        childPostList(childList, i);
      }

      if (listPost[i].node.__typename == 'GraphVideo') {
        let pBtnDetails = document.createElement('p');
        pBtnDetails.innerHTML = `<div class="flex justify-content-end blink_icon" style="position: absolute;bottom:2px;right:5px;z-index:100;cursor:pointer;" data-bs-target="#posts${i}" data-bs-toggle="modal"><!--<a href="${listPost[i].node.video_url}" class="text-decoration-none text-white" target="_blank">--><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg></a></div>`;
        document.getElementById(`card-body-${i}`).appendChild(pBtnDetails);
        modalVideo(listPost[i].node, i);

      }
    }
  }
}
function childPostList(resPostOrder, modalId) {
  let divModal = document.createElement('div');
  divModal.innerHTML = `<div class="modal fade zoom" id="posts${modalId}" tabindex="-1" aria-labelledby="posts${modalId}Label" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" style="position:relative;">
        <div class="container-slide" id="container-slide${modalId}">
        </div>
        <a class="prev-button text-decoration-none bg-dark rounded-end text-white" onclick="plusSlides(-1,${modalId})"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z" />
        </svg></a>
        <a class="next-button text-decoration-none bg-dark rounded-start text-white" onclick="plusSlides(1,${modalId})"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z" />
        </svg></a>
      </div>
    </div>
  </div>
</div>`;
  containerResult.insertBefore(divModal, footerResult);
  for (indexChild = 0; indexChild < resPostOrder.length; indexChild++) {
    // console.log(resPostOrder[indexChild].node.display_url);
    let slideContent = document.createElement('div');
    if (resPostOrder[indexChild].node.__typename == 'GraphImage') {
      slideContent.innerHTML = `<div class="mySlides my-fade my${modalId} text-center"><div class="text-dark fs-5">${indexChild + 1} / ${resPostOrder.length}</div><img src="${resPostOrder[indexChild].node.display_url}" style="width:85%;" alt="post-child-img" crossorigin="anonymous"></div>`;
    }
    if (resPostOrder[indexChild].node.__typename == 'GraphVideo') {
      slideContent.innerHTML = `<div class="mySlides my-fade my${modalId} text-center" style="position:relative;"><div class="text-dark fs-5">${indexChild + 1} / ${resPostOrder.length}</div><img src="${resPostOrder[indexChild].node.display_url}" style="width:85%;" alt="post-child-img" crossorigin="anonymous"><a href="${resPostOrder[indexChild].node.video_url}" target="_blank" class="text-decoration-none text-white" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                   <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                   <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                 </svg></a></div>`;
    }
    document.getElementById(`container-slide${modalId}`).appendChild(slideContent);
  }
}
function modalVideo(postOrder, modalId) {
  let divModal = document.createElement('div');
  divModal.innerHTML = `<div class="modal fade zoom" id="posts${modalId}" tabindex="-1" aria-labelledby="posts${modalId}Label" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-body text-center" style="position:relative;">
                <img src="${postOrder.display_url}" style="width:85%;" alt="post-child-img" crossorigin="anonymous"><a href="${postOrder.video_url}" target="_blank" class="text-decoration-none text-white" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                   <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                   <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                 </svg></a>
              </div>
            </div>
          </div>
        </div>
     </div>`;
  containerResult.insertBefore(divModal, footerResult);
}
let slideIndex = 1;
function plusSlides(n, slideOfPost) {
  showSlides(slideIndex += n, slideOfPost);
}

function currentSlide(n, slideOfPost) {
  showSlides(slideIndex = n, slideOfPost);
}
function showSlides(n, slideOfPost) {
  let slides = document.getElementsByClassName(`my${slideOfPost} `);
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";

}

// function testModal(){
//   let divModal = document.createElement('div');
//   divModal.innerHTML = `< !--Modal -->
// <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
//         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div class="modal-body">
//         <h1>The video autoplay attribute</h1>
// <video width="320" height="240" controls autoplay>
//   <source src="https://scontent-iev1-1.cdninstagram.com/v/t50.2886-16/346899966_807346107014998_5613202220653110911_n.mp4?_nc_ht=scontent-iev1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=tHBeckh-nyoAX9X7Wj0&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfC-qpIPJq-ZKnOeaFHHg8DEGRBGTMJJcwWDkGjSKksyAA&oe=646284BF&_nc_sid=8fd12b" type="video/mp4" crossorigin="anonymous">
//   <source src="https://scontent-iev1-1.cdninstagram.com/v/t50.2886-16/346899966_807346107014998_5613202220653110911_n.mp4?_nc_ht=scontent-iev1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=tHBeckh-nyoAX9X7Wj0&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfC-qpIPJq-ZKnOeaFHHg8DEGRBGTMJJcwWDkGjSKksyAA&oe=646284BF&_nc_sid=8fd12b" type="video/ogg" crossorigin="anonymous">
//   <source src="https://scontent-iev1-1.cdninstagram.com/v/t50.2886-16/346899966_807346107014998_5613202220653110911_n.mp4?_nc_ht=scontent-iev1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=tHBeckh-nyoAX9X7Wj0&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfC-qpIPJq-ZKnOeaFHHg8DEGRBGTMJJcwWDkGjSKksyAA&oe=646284BF&_nc_sid=8fd12b" type="video/webm" crossorigin="anonymous">
//   Your browser does not support the video tag.
// </video>
// <img src="" crossorigin="anonymous"/>
// <img src="https://instagram.fiev22-2.fna.fbcdn.net/v/t51.2885-15/328440938_737202151313044_1722498512902579125_n.webp?stp=dst-jpg_e35&_nc_ht=instagram.fiev22-2.fna.fbcdn.net&_nc_cat=104&_nc_ohc=aK9RoFHydx0AX9XdVPI&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfBjy4tA3yljV4wFhCJMiRYfC_7qvkMWExv-IoHXTPfBYQ&oe=64607C1E&_nc_sid=8fd12b" class="card-img-top" alt="..." crossorigin="anonymous" id="main-img">
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Save changes</button>
//       </div>
//     </div>
//   </div>
// </div>`;
// containerResult.insertBefore(divModal,footerResult);
// }


// function test() {
//   let cards = document.createElement('div');
//   cards.setAttribute('class', 'card');
//   cards.setAttribute('id', 'card-img');
//   cards.setAttribute('style', 'width: 18rem;');
//   cards.innerHTML = `<div class="card-body">
//     <h5 class="card-title">Card title</h5>
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//     <a href="#" class="btn btn-primary" id="details" data-bs-toggle="modal" data-bs-target="#exampleModal">open First Modal</a>
//   </div>
// </div>`;
//   containerResult.insertBefore(cards, footerResult);
//   testModal();
//   //childPostList();
// }
// test();

function modalProfile(res) {
  let popupModal = document.createElement('div');
  popupModal.setAttribute('class', 'modal');
  popupModal.classList.add('fade');
  popupModal.classList.add('zoom');
  popupModal.setAttribute('id', 'modalProfile');
  popupModal.setAttribute('tabindex', '-1');
  popupModal.setAttribute('aria-labelledby', 'modalProfileLabel');
  popupModal.innerHTML = `<div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body" style="padding: 0px;">
  <div id="carouselExampleControlsNoTouching" class="carousel slide" data-bs-touch="false">
    <div class="carousel-inner"> 
      <div class="carousel-item active rounded-circle border border-dark" style="overflow:hidden; opacity: 1;" id="img-popup">
        <img class="d-block w-100" alt="profile-picture" crossorigin="anonymous" id="img-popup" src="${res}">
        </div>
      </div>
    </div>
  </div>
        </div>
      </div>
    </div>
  </div>`;
  containerResult.insertBefore(popupModal, footerResult);
  let setButtonPopup = document.getElementById('main-img');
  setButtonPopup.setAttribute('data-bs-target', '#modalProfile');
  setButtonPopup.setAttribute('data-bs-toggle', 'modal');
  setButtonPopup.addEventListener('click', () => {
    document.body.classList.add('all-blur');
  })
}
function bodyClick(event) {
  if (event.target.id == 'modalProfile' || event.target.classList.contains('child-post') || event.target.classList.contains('zoom')) {
    document.body.classList.remove('all-blur');
    slideIndex = 1;
  }
}
function keyCode(event) {
  if (event.keyCode == 27) document.body.classList.remove('all-blur');
}

function errorHandle() {
  let errorMessage = document.createElement('div');
  errorMessage.setAttribute('id', 'error-message');
  errorMessage.innerHTML = `<h3 class="text-danger text-center">404</h3><section class="d-flex justify-content-center"><span style="text-align: justify;" class="mx-5">Oops! Page not found. You are looking for something that doesn't actually exist. Please, check your connection and Username or userID then try again.</span></section>`;
  containerResult.insertBefore(errorMessage, footerResult);
}

function loadingEffect() {
  let loadingEvent = document.createElement("div");
  loadingEvent.setAttribute('id', 'loader');
  loadingEvent.setAttribute('style', 'width:100%; height:100%; position:fixed; z-index:100;');
  loadingEvent.innerHTML = `<div class="loader">
  <div class="inner one"></div>
  <div class="inner two"></div>
  <div class="inner three"></div>
</div>`;
  containerResult.insertBefore(loadingEvent, footerResult);
}

let userInfo = {
  method: 'POST',
  mode: 'cors',
  referrerPolicy: 'no-referrer-when-downgrade',
  credentials: 'same-origin',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'rocketapi-for-instagram.p.rapidapi.com'
  }
};

function getInfo(url, user) {
  return fetch(url, user)
    .then(response => response.json())
    .then(response => response);
}
