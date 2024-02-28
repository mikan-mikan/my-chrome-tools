// 組織外ユーザーが含まれているかどうかをチェックする
function checkExternalMark() {
  const isExternalMark = document.querySelector("._externalMark");
  const roomMainContent = document.querySelector(
    ".roomMainContent__currentSelectedRoom"
  );
  if (isExternalMark) {
    roomMainContent.style.border = "3px solid orange";
  } else {
    roomMainContent.style.border = "none";
  }
}

// ローディングアイコンの監視を開始
const loader = document.getElementById("_loader");
const loaderObserverCallback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "style") {
      const target = mutation.target;
      if (target.style.display === "none") {
        observer.disconnect(); // 監視を終了
        initializeExtension(); // 拡張機能の初期化
      }
    }
  }
};
const loaderObserverOptions = {
  attributes: true, // 属性の変更を監視
  attributeFilter: ["style"],
};
const loaderObserver = new MutationObserver(loaderObserverCallback);
loaderObserver.observe(loader, loaderObserverOptions);

const checkExtraMarkObserverCallback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" || mutation.type === "subtree") {
      checkExternalMark();
    }
  }
};

// 組織外ユーザーの監視を開始
const checkExtraMarkObserverOptions = {
  childList: true, // 直接の子要素の変更を監視
  subtree: true, // すべての子孫要素の変更も監視
  characterData: false,
};
function initializeExtension() {
  const targetNode = document.getElementById("_chatSendArea");
  if (!targetNode) {
    // console.log("監視対象の要素が見つかりません。");
    return;
  }
  const observer = new MutationObserver(checkExtraMarkObserverCallback);
  observer.observe(targetNode, checkExtraMarkObserverOptions);
  checkExternalMark();
}
