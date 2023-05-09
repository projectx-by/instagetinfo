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
  profileDiv.setAttribute('class', 'card')
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
        <p class="card-text d-flex justify-content-end"><button class="btn btn-light">Details</button></p>
      </div>
    </div>
  </div>`;
      containerResult.insertBefore(bodyPost, footerResult);
      let caption = document.getElementById(`caption${i}`);
      caption.textContent == 'null' ? caption.textContent = '' : caption.textContent = listPost[i].node.accessibility_caption;
      listPost[i].node.edge_media_to_caption.edges.length == 0 ? document.getElementById(`node-text${i}`).textContent = '' : document.getElementById(`node-text${i}`).textContent = listPost[i].node.edge_media_to_caption.edges[0].node.text;
    }


  }
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
function test() {
  let cards = document.createElement('div');
  cards.setAttribute('class', 'card');
  cards.setAttribute('id', 'card-img');
  cards.setAttribute('style', 'width: 18rem;');
  cards.innerHTML = `<img src="../asset/favicon.ico" class="card-img-top" alt="..." crossorigin="anonymous" id="main-img">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>`;
  containerResult.insertBefore(cards, footerResult);
  let imgSrc = document.getElementById('main-img').getAttribute('src');
  console.log(imgSrc);
  modalProfile(imgSrc)
}
test();
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

























// let inputForm, searchBtn, userInfo, radioBtn, radioBtnClose;
// inputForm = document.getElementById('keyword');
// searchBtn = document.getElementById('searchBtn');
// radioBtn = document.getElementById('btn-radio');
// radioBtnClose = document.getElementById('btn-radio-close');
// let getByUsername = 'https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info';
// let getByID = 'https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info_by_id';
// let elementFooter = document.getElementById('footer');
// let elementContainer = document.getElementById('container');
// let elementResult = `<div class="card mx-5 bg-dark" style="max-width: 90vw;margin-top: 15vw;border:none;">
//   <div class="row g-0">
//     <div class="col-md-4 rounded-circle" style="width:150px;height:150px;overflow:hidden;">
//       <a target="_blank" id="link-profile">
//       <img class="img-fluid rounded-start" alt="profile-picture" title="profile-picture" width="150px" height="150px" id="profile-pict" crossorigin="anonymous">
//       </a>
//     </div>
//     <div class="col-md-8">
//       <div class="card-body text-white" id="card-body">
//         <h5 class="card-title" id="full-name" title="full-name"></h5>
//         <span class="card-title text-muted" id="username"title="username">0xwildcard</span>
//         <span class="card-title text-muted" id="uid" title="UID">1001928977</span><br>
//         <span class="text-white" id="follower-count">700</span>
//         <span class="text-muted">follower</span>
//         <span class="text-white">•</span><span class="text-white" id="following-count">1000</span>
//         <span class="text-muted">following</span>
//         <p class="card-text" id="parent-biolinks">
//         </p>
//         <p class="card-text mt-3" id="bio"></p>
//     </div>
//   </div>
// </div>
// </div>
// <div class="latest-post mb-5" id="latest-post">
// </div>`;
// let divResult = document.createElement('div');
// divResult.setAttribute('class', 'd-none');
// divResult.setAttribute('id', 'result');
// divResult.setAttribute('style', 'font-size: 2vw;');
// divResult.innerHTML = elementResult;
// let loadingEvent = document.createElement("div");
// loadingEvent.setAttribute('style', 'width:100%; height:100%; position:fixed; z-index:100;');
// loadingEvent.innerHTML = `<div class="loader">
//   <div class="inner one"></div>
//   <div class="inner two"></div>
//   <div class="inner three"></div>
// </div>`;
// let profilePicture, fullName, userName, userID, biography, biographyLinks, followerCount, followingCount, parentBioLinks, linkProfile, printElementResult;
// inputForm.addEventListener('input', (e) => {
//   if (document.getElementById('input-username').checked == true) {
//     return userInfo.body = `{"username": "${e.target.value}" }`;
//   } else {
//     return userInfo.body = `{"id": ${e.target.value} }`;
//   }
// })
// inputForm.addEventListener('keypress', (e) => {
//   if (e.key === 'Enter') {
//     e.preventDefault();
//     searchBtn.click();
//   }
// })

// function search() {
//   execute();
// }
// searchBtn.addEventListener('click', () => {
//   execute();
// })
// async function execute() {
//   if (elementContainer.querySelector('#result') != null) {
//     elementContainer.querySelector('#result').remove();
//   }
//   if (elementContainer.querySelector('#error') != null) {
//     elementContainer.querySelector('#error').remove();
//   }
//   elementContainer.childNodes[0].after(loadingEvent);
//   let result;
//   if (document.getElementById('input-username').checked == true) {
//     result = await getInfo(getByUsername, userInfo);
//   } else {
//     result = await getInfo(getByID, userInfo);
//     if (result.status == 'timeout' || result.status == 'error' || result.status_code == 404) {
//       printResult(result);
//     } else {
//       userInfo.body = `{"username": "${result.response.body.user.username}" }`;
//       result = await getInfo(getByUsername, userInfo);
//     }
//   }
//   console.log(result);
//   printResult(result);
//   setTimeout(function () {
//     elementContainer.childNodes[1].remove();
//     printElementResult.classList.remove("d-none");
//   }, 5000);
// }

// inputForm.addEventListener("focusin", () => {
//   searchBtn.classList.remove("bg-secondary");
//   radioBtn.classList.add("bg-secondary");
// })
// inputForm.addEventListener("focusout", () => {
//   searchBtn.classList.add("bg-secondary");
//   radioBtn.classList.remove("bg-secondary");
// })
// radioBtnClose.addEventListener('click', () => {
//   inputForm.value = '';
//   userInfo.body = '';
//   let username = document.getElementById('input-username');
//   let userID = document.getElementById('input-userID');
//   let btnChecked = document.getElementById('btn-checked');
//   if (username.checked == true) {
//     btnChecked.textContent = 'Username';
//     inputForm.setAttribute('placeholder', 'ex: 0xwildcard');
//   } else {
//     btnChecked.textContent = 'User ID'
//     inputForm.setAttribute('placeholder', 'ex: 7430039768');
//   }
// })
// function printResult(arg) {
//   if (arg.status == 'error' || arg.status == 'timeout' || arg.response.status_code == 404) {
//     let errorMessage = `<p>
//     <span class="text-danger">Oops! </span><span class="">This is awkward... You are looking for something that doesn't actually exist.</span><br>
//     <span>Please, check your connection and Username or userID then try again.</span>
//     </p>
//     <h4>404 NOT FOUND</h4>`;
//     let divError = document.createElement("div");
//     divError.setAttribute('class', 'text-center');
//     addClass(divError, ['my-5', 'd-none']);
//     divError.setAttribute('style', 'font-size: 2vw;');
//     divError.setAttribute('id', 'error');
//     divError.innerHTML = errorMessage;
//     if (document.querySelector('#error') == null) {
//       elementContainer.insertBefore(divError, elementFooter);
//     }
//     printElementResult = document.getElementById('error');
//   } else {
//     if (container.querySelector('#error') != null) {
//       container.querySelector('#error').remove();
//     }
//     container.insertBefore(divResult, elementFooter);
//     printElementResult = document.getElementById('result');
//     profilePicture = document.getElementById('profile-pict').setAttribute('src', `${proxyHeroku}${arg.response.body.data.user.profile_pic_url_hd}`);
//     linkProfile = document.getElementById('link-profile').setAttribute('href', arg.response.body.data.user.profile_pic_url_hd);
//     fullName = document.getElementById('full-name').textContent = arg.response.body.data.user.full_name;
//     userName = document.getElementById('username').textContent = `Username: ${arg.response.body.data.user.username}`;
//     // response.body.user.username by ID
//     userID = document.getElementById('uid').textContent = `UID: ${arg.response.body.data.user.id}`;
//     biography = document.getElementById('bio').textContent = arg.response.body.data.user.biography;
//     followerCount = document.getElementById('follower-count');
//     counterAnimation(arg, 'edge_followed_by', followerCount);
//     followingCount = document.getElementById('following-count');
//     counterAnimation(arg, 'edge_follow', followingCount);
//     parentBioLinks = document.getElementById('parent-biolinks');
//     printBioLinks(arg);
//     latestPost(arg);
//   }
// }
// function latestPost(post) {
//   let latest = post.response.body.data.user.edge_owner_to_timeline_media.edges;
//   let postMany = post.response.body.data.user.edge_owner_to_timeline_media.count;
//   let postCounter;
//   if (postMany > 3) {
//     postCounter = 3;
//   } else {
//     postCounter = postMany;
//   }
//   let postdivElements = document.getElementById('latest-post');
//   if (latest.length == 0) {
//     if (postdivElements.hasChildNodes) {
//       postdivElements.textContent = '';
//     }
//     let noPost = document.createElement('div');
//     noPost.setAttribute('style', 'margin-left: 45vw;');
//     noPost.textContent = 'No Post Here';
//     postdivElements.appendChild(noPost);
//   } else {
//     if (postdivElements.hasChildNodes) {
//       postdivElements.textContent = '';
//     }
//     let titleLatestPost = document.createElement('h5');
//     titleLatestPost.setAttribute('class', 'my-5');
//     addClass(titleLatestPost, 'mx-5');
//     titleLatestPost.textContent = 'Latest Post';
//     postdivElements.appendChild(titleLatestPost);
//     for (i = 0; i < postCounter; i++) {
//       let card = `<div class="card mb-3 ms-5 bg-dark" id="latest-post-0" style="max-width: 85vw;border:none;">
//   <div class="row g-0">
//     <div class="g-0">
//       <img class="img-fluid rounded-start" alt="..." style="width: 150px;height:150px;" id="img-0" crossorigin="anonymous" src="${proxyHeroku + latest[i].node.thumbnail_resources[4].src}">
//     </div>
//     <div class="g-0">
//       <div class="card-body" id="card-body-${i}">
//         <p id="links-post-${i}">
//           <button type="button" class="btn btn-light" data-bs-target="#exampleModal" data-bs-toggle="modal" id="btn-detail-${i}">
//             Details
//             </button>
//         </p>
//       </div>
//     </div>
//   </div>
// </div>`;
//       let cardBody = document.createElement("div");
//       cardBody.innerHTML = card;
//       postdivElements.appendChild(cardBody);
//       let cardCap = document.getElementById(`card-body-${i}`);
//       let btnPostDetail = document.getElementById(`btn-detail-${i}`);
//       if (latest[i].node.accessibility_caption != null) {
//         let h4 = document.createElement("h4");
//         h4.textContent = latest[i].node.accessibility_caption;
//         cardCap.insertBefore(h4, cardCap.children[0]);
//       }
//       if (latest[i].node.edge_media_to_caption.edges.length != 0) {
//         let p = document.createElement("p");
//         p.setAttribute("class", "card-text");
//         p.textContent = latest[i].node.edge_media_to_caption.edges[0].node.text;
//         cardCap.insertBefore(p, btnPostDetail);
//       }
//       // let aLinks = document.getElementById(`link-${i}`);
//       if (latest[i].node.__typename == "GraphImage") {
//         aLinks.setAttribute("href", latest[i].node.display_url);
//       }else if(latest[i].node.__typename == "GraphSidecar"){
//         getChildPost(latest[i].node);
//       }else {
//         aLinks.setAttribute("href", latest[i].node.video_url);
//       }
//     }
//   }
// }
// function getChildPost(arg){
//   let divModal = document.createElement('div');
//   divModal.setAttribute('id','divModal');
//   let childPostBody = `<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//   <div class="modal-dialog modal-dialog-centered">
//     <div class="modal-content">
//       <div class="modal-body" style="padding: 0px;">
// <div id="carouselExampleControlsNoTouching" class="carousel slide" data-bs-touch="false">
//   <div class="carousel-inner" id="div-list-items">
//   <!-- DIV IMAGE CONTENT -->
//     <div class="carousel-item active">
//       <!-- TAG IMAGE HERE FIRST-->
//       <img src="${proxyHeroku+arg.edge_sidecar_to_children.edges[0].node.display_url}" class="d-block w-100" alt="images-0" crossorigin="anonymous">
//     </div>
//   </div>
//   <button class="carousel-control-prev bg-dark rounded-end button-control" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="prev" style="height: 50px; width: 35px; margin-top: 150px;" id="prev">
//     <span class="carousel-control-prev-icon" style="text-shadow: 2px 2px 2px black;"></span>
//   </button>
//   <button class="carousel-control-next bg-dark rounded-start button-control" type="button" data-bs-target="#carouselExampleControlsNoTouching" data-bs-slide="next" style="height: 50px; width: 35px; margin-top: 150px;">
//     <span class="carousel-control-next-icon"></span>
//   </button>
// </div>
//       </div>
//     </div>
//   </div>
// </div>`;
// let divListItems = document.getElementById('div-list-items');
// for(i = 1; i < arg.edge_sidecar_to_children.edges.length; i++){
// let childPostContentDivImages = document.createElement('div');
// childPostContentDivImages.setAttribute('class','carousel-item');
//   let childPostContentImages = `<img src="${proxyHeroku+arg.edge_sidecar_to_children.edges[i].node.display_url}" class="d-block w-100" alt="images-${i}" crossorigin="anonymous">`;
//   childPostContentDivImages.innerHTML = childPostContentImages;
//   divListItems.appendChild(childPostContentDivImages);
// }
// divModal.innerHTML = childPostBody;
// elementContainer.insertBefore(divModal,elementFooter);
// }

// function addClass(element, value) {
//   for (content of value) {
//     element.classList.add(content);
//   }
// }
// let ahref = document.createElement("a");
// ahref.setAttribute("class", "text-white");
// let newLine = document.createElement("br");
// function printBioLinks(links) {
//   let bio = links.response.body.data.user.bio_links;
//   if (bio.length == 0) {
//     ahref.textContent = " ";
//   } else {
//     for (i = 0; i < bio.length; i++) {
//       ahref.setAttribute("href", bio[i].url);
//       ahref.textContent = bio[i].url;
//       parentBioLinks.appendChild(ahref);
//       parentBioLinks.appendChild(newLine);
//     }
//   }
// }
// function counterAnimation(resAPI, strObject, elements) {
//   let i, ms, counter;
//   i = 1;
//   if (strObject == "edge_followed_by") {
//     counter = resAPI.response.body.data.user.edge_followed_by.count;
//   } else {
//     counter = resAPI.response.body.data.user.edge_follow.count;
//   }
//   if (counter > 10000) {
//     ms = counter * 2 / 500;
//   } else {
//     ms = counter * 0.2 / 500;
//   }
//   let interID = setInterval(() => {
//     i++;
//     elements.textContent = i;
//     if (i == counter) { clearInterval(interID); };
//   }, ms);
// }
