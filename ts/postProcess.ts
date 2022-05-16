// 카테고리 선택 함수
function subCategoryOpen(data: string) {
  document
    .querySelectorAll<HTMLElement>("#blog-category li a[cat-data]")
    .forEach((elem) => {
      if (elem.getAttribute("cat-data") != data) {
        elem.classList.add("disable");
      } else {
        elem.classList.remove("disable");
      }
    });
  document
    .querySelectorAll<HTMLElement>("#blog-category-sub li[cat-data]")
    .forEach((elem) => {
      if (elem.getAttribute("cat-data") != data) {
        elem.classList.remove("active");
      } else {
        elem.classList.add("active");
      }
    });
}

// 카테고리 초기화 함수
function categoryListSetup(container: HTMLElement) {
  let subContainer = document.getElementById("blog-category-sub");
  let linkElement = container.querySelector<HTMLElement>("a.link_item");
  let mainTitle = linkElement.innerText;
  let cnt = linkElement.querySelector<HTMLElement>(".c_cnt").innerText;
  let href = document.createElement("a");
  let subsetListItem = document.createElement("li");
  href.innerHTML = mainTitle + " " + cnt;
  href.setAttribute("href", linkElement.getAttribute("href"));
  linkElement.removeAttribute("href");
  linkElement.setAttribute("onClick", `subCategoryOpen('${mainTitle}')`);
  linkElement.setAttribute("cat-data", mainTitle);
  subsetListItem.appendChild(href);
  subContainer.appendChild(subsetListItem);
  subsetListItem.setAttribute("cat-data", mainTitle);
  container
    .querySelectorAll<HTMLElement>(".sub_category_list > li")
    .forEach((elem) => {
      elem.setAttribute("cat-data", mainTitle);
      subContainer.appendChild(elem);
    });
}

document
  .querySelectorAll<HTMLElement>(".category_list > li")
  .forEach((elem) => {
    categoryListSetup(elem);
  });

// 댓글 본문 자동 높이조절
function resize(obj) {
  obj.style.height = "1px";
  obj.style.height = 12 + obj.scrollHeight + "px";
}
// 단락 공백 제거 클래스 삭제
let conteiner = document.querySelector(".tt_article_useless_p_margin");
if (conteiner) conteiner.classList.remove("tt_article_useless_p_margin");

// 인덱스 페이지 정렬
function MasonryLayout(listContainerQuery: string, listItemQuery: string) {
  const elemContainer = document.querySelector<HTMLElement>(listContainerQuery);
  const elemFirstItem = elemContainer.querySelector<HTMLElement>(listItemQuery);
  const getArrayMinIndex = (arr: any[]) =>
    arr.reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);
  const getArrayMaxIndex = (arr: any[]) =>
    arr.reduce((r, v, i, a) => (v <= a[r] ? r : i), -1);
  const waitImageLoad = async (elem: HTMLElement) => {
    for (const img of elem.querySelectorAll<HTMLImageElement>("img"))
      await img.decode();
  };
  const LayoutSetup = async () => {
    const widthWrapper = elemContainer.offsetWidth;
    const widthItem = elemFirstItem.offsetWidth;
    let layoutTopArr = new Array(parseInt(`${widthWrapper / widthItem}`));
    layoutTopArr.fill(0);
    for (const elem of elemContainer.querySelectorAll<HTMLElement>(listItemQuery)) {
      // 이미지 로딩 대기
      await waitImageLoad(elem);
      let topMinIndex = getArrayMinIndex(layoutTopArr);
      elem.style.left = topMinIndex * widthItem + "px";
      elem.style.top = layoutTopArr[topMinIndex] + "px";
      elem.classList.add("show");
      layoutTopArr[topMinIndex] += elem.offsetHeight;
      elemContainer.style.height =
        layoutTopArr[getArrayMaxIndex(layoutTopArr)] + "px";
    }
  };
  LayoutSetup();
  window.addEventListener("resize", LayoutSetup);
}

MasonryLayout(".article-list", ".article-list-item");
