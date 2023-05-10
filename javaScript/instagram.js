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
    convertIdToUsername(tempResponApi);
    responseAPI = await getInfo(getByUsername, userInfo)
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
        <img src="${proxyHeroku}${res.response.body.data.user.profile_pic_url_hd}" class="img-fluid" alt="profile-picture" crossorigin="anonymous" style="width: 150px; height:150px;" id="main-img">
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
  headerPost.textContent = `Post From @${res.response.body.data.user.username}`;
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
      bodyPost.setAttribute('style', 'max-width: 90vw; outline: none; border: none;');

      bodyPost.innerHTML = `<div class="row g-0 mx-2 my-2">
    <div class="col-md-4">
      <img src="${proxyHeroku}${listPost[i].node.thumbnail_resources[4].src}"class="img-fluid" alt="post-images" crossorigin="anonymous">
    </div>
    <div class="col-md-8">
      <div class="card-body text-white" id="card-body">
        <h5 class="card-title" id="caption${i}">${listPost[i].node.accessibility_caption}</h5>
        <span class="text-muted">${listPost[i].node.__typename}</span>
        <p class="card-text" id="node-text${i}"></p>
        <p class="card-text d-flex justify-content-end"><button class="btn btn-light" id="details-${i}">Details</button></p>
      </div>
    </div>
  </div>`;
      containerResult.insertBefore(bodyPost, footerResult);
      let caption = document.getElementById(`caption${i}`);
      caption.textContent == 'null' ? caption.textContent = '' : caption.textContent = listPost[i].node.accessibility_caption;
      listPost[i].node.edge_media_to_caption.edges.length == 0 ? document.getElementById(`node-text${i}`).textContent = '' : document.getElementById(`node-text${i}`).textContent = listPost[i].node.edge_media_to_caption.edges[0].node.text;
      if (listPost[i].node.__typename == 'GraphSidecar') {
        childPostList(listPost[i].node.edge_sidecar_to_children);
      }
    }


  }
}

function childPostList(res) {
  let modalBodyChildPost = document.createElement('div');
  modalBodyChildPost.setAttribute('class', 'modal');
  modalBodyChildPost.classList.add('fade');
  modalBodyChildPost.classList.add('zoom');
  modalBodyChildPost.setAttribute('id', 'childPost');
  modalBodyChildPost.setAttribute('tabindex', '-1');
  modalBodyChildPost.setAttribute('aria-labelledby', 'childPostLabel');
  modalBodyChildPost.setAttribute('aria-hidden', 'true');
  modalBodyChildPost.innerHTML = `<div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" style="padding: 0px;">
<div id="carouselExampleControlsNoTouching" class="carousel slide" data-bs-touch="false">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="${proxyHeroku}${res.edges[0].node.display_url}" class="d-block w-100" alt="sidecar-0" crossorigin="anonymous">
      </div>
      <div class="carousel-item">
      <img src="${proxyHeroku}${res.edges[1].node.display_url}" class="d-block w-100" alt="sidecar-1"crossorigin="anonymous">
      </div>
    </div>
  </div>
  <div id="btn-control">
  <button class="carousel-control-prev bg-dark rounded-end button-control" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev" style="height: 50px; width: 35px; margin-top: 225px;" id="prev">
    <span class="carousel-control-prev-icon" style="text-shadow: 2px 2px 2px black;" id="icon-prev"></span>
  </button>
  <button class="carousel-control-next bg-dark rounded-start button-control" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next" style="height: 50px; width: 35px; margin-top: 225px;" id="next">
    <span class="carousel-control-next-icon" id="icon-next"></span>
  </button>
  </div>
</div>
      </div>
    </div>`;
  containerResult.insertBefore(modalBodyChildPost, footerResult);
  let buttonDetails = document.getElementById('details-1');
  buttonDetails.setAttribute('data-bs-target', '#childPost');
  buttonDetails.setAttribute('data-bs-toggle', 'modal');
}
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
  if (event.target.id == 'modalProfile') {
    document.body.classList.remove('all-blur');
  }
}
// function test() {
//   let cards = document.createElement('div');
//   cards.setAttribute('class', 'card');
//   cards.setAttribute('id', 'card-img');
//   cards.setAttribute('style', 'width: 18rem;');
//   cards.innerHTML = `<img src="../asset/favicon.ico" class="card-img-top" alt="..." crossorigin="anonymous" id="main-img">
//   <div class="card-body">
//     <h5 class="card-title">Card title</h5>
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//     <a href="#" class="btn btn-primary" id="details">Details</a>
//   </div>
// </div>`;
//   containerResult.insertBefore(cards, footerResult);
//   let imgSrc = document.getElementById('main-img').getAttribute('src');
//   console.log(imgSrc);
//   childPostList(imgSrc);
// }
// test();
function errorHandle() {
  let errorMessage = document.createElement('div');
  errorMessage.setAttribute('id', 'error-message');
  errorMessage.innerHTML = `<h3 class="text-danger text-center">404</h3><section class="d-flex justify-content-center"><span style="text-align: justify;" class="mx-5">Oops! Page not found. You are looking for something that doesn't actually exist. Please, check your connection and Username or userID then try again.</span></section>`;
  containerResult.insertBefore(errorMessage, footerResult);
}

let btnRadioClose = document.getElementById('btn-radio-close');
btnRadioClose.addEventListener('click', () => {
  if (document.getElementById('input-username').checked == true) {
    document.getElementById('btn-checked').textContent = 'Username';
    document.getElementById('keyword').setAttribute('placeholder', 'ex: 0xwildcard');
  } else {
    document.getElementById('btn-checked').textContent = 'User ID';
    document.getElementById('keyword').setAttribute('placeholder', 'ex: 7430039768');
  }
})

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
