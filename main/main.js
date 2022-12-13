let API = "http://localhost:8001/twitter";

//? Переменные для поста
let tweetTxT = document.querySelector("#text_tweet");
let tweetImg = document.querySelector("#img_tweet");
let tweetBtn = document.querySelector("#tweetBtn");
let post = document.querySelector("#post_create");
//? ===================================================== ?//
//? Переменные для инпутов, редактирование
let modalTxT = document.querySelector("#text_tweet_modal");
let modalImg = document.querySelector("#img_tweet_modal");
let mSaveBtn = document.querySelector("#modal-save");
let modal = document.querySelector("#myModal");
// ?=========================================?//
//? search
let search = document.querySelector("#search");
let searchVoid = "";
//?============================================================?//
//? Pagination
let currentPage = 1;
let pageTotalCount = 1;
let paginationlist = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

//! Добавление нового поста
tweetBtn.addEventListener("click", async function () {
  let obj = {
    tweetTxT: tweetTxT.value,
    tweetImg: tweetImg.value,
  };
  console.log(obj);

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  render();

  tweetTxT.value = "";
  tweetImg.value = "";
});
render();

async function render() {
  let twitter = await fetch(
    `${API}?q=${searchVoid}&_page=${currentPage}$-limit=3`
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));

  post.innerHTML = "";

  twitter.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML += `
    <div class="post">
        <div class="post__avatar">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx3GtL4PHNDnv2E8zv2j6mZkn2G2BdipRm-w&usqp=CAU"
            alt=""
          />
        </div>

        <div class="post__body">
          <div class="post__header">
            <div class="post__headerText">
              <h3>
                Eryn Clayton
                <span class="post__headerSpecial"
                  ><span class="material-icons post__badge"> verified </span
                  >@eclayton</span
                >
              </h3>
            </div>
            <div class="post__headerDescription">
              <p>${element.tweetTxT}</p>
            </div>
          </div>
          <img
            src="${element.tweetImg}"
            alt=""
          />
          <div class="post__footer">
            <span class="material-icons"> repeat </span>
            <span class="material-icons"> favorite_border </span>
            <span class="material-icons"> publish </span>
            <button class="material-symbols-outlined EDIT" id=${element.id}>more_vert</button>
            <button class="material-symbols-outlined DELETE" id=${element.id}>delete</button>
            </span>
          </div>
        </div>
      </div>
    `;

    post.append(newElem);
  });
}

//!=========================================================================!//

//!Редактирование продукта
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("EDIT")) {
    let id = e.target.id;

    modal.style.display = "block";

    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        tweetTxT.value = data.tweetTxT;
        tweetImg.value = data.tweetImg;
        mSaveBtn.setAttribute("id", data.id);
      });
  }
});

mSaveBtn.addEventListener("click", function () {
  let id = this.id;
  let tweetTxT = modalTxT.value;
  let tweetImg = modalImg.value;

  if (!tweetTxT || !tweetImg) {
    return;
  }

  let modalTweet = {
    tweetTxT: tweetTxT,
    tweetImg: tweetImg,
  };
  saveEdit(modalTweet, id);
});

async function saveEdit(modalTweet, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(modalTweet),
  });
  render();
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  mSaveBtn.onclick = function () {
    modal.style.display = "none";
  };
}
//! DELETE
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("DELETE")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
  }
});

//! SEARCH
search.addEventListener("input", () => {
  searchVoid = search.value;
  render();
});

//! PAGINATION
function drawPaginationButtons() {
  fetch(`${API}?q=${searchVoid}`)
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 3);
      paginationList.innerHTML = "";

      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li ><a  href='#'>${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li><a  href='#'>${i}</a></li>`;
          paginationList.append(page1);
        }
      }

      //? красим кнопки pre / next в серый
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }

  currentPage--;
  render();
});

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }

  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page-number")) {
    currentPage = e.target.innerText;
    render();
  }
});
