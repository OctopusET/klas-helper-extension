if (typeof browser === "undefined") {
  var browser = chrome;
}
function main() {
  var document_observer = new MutationObserver(function (mutations) {
    // 기본 css가 important가 되기 때문에, 모든 css파일이 로드가 된 후에 추가합니다.
    // 기본적으로 추가되는 head의 child가 27개이므로 전부다 로드가 되면 해당 css를 주입합니다.
    if (document.head.childElementCount > 26) {
      //  다크모드 css 삽입
      const style = document.createElement("link");
      style.href = browser.runtime.getURL("dark.css");
      style.type = "text/css";
      style.rel = "stylesheet";
      document.querySelector("head").append(style);
      document_observer.disconnect();
    }
  });

  document_observer.observe(document, {
    childList: true,
    characterData: true,
    subtree:true
  });
}

// 크롬 sync 스토리지 이용해 체크 여부 확인
try {
  browser.storage.sync.get(null, function(items) {
    // chrome namespace not supported
    if (items.useDark === undefined) {
      browser.storage.sync.set({"useDark": "OFF"});
    }
    else if (items.useDark === "ON") {
      main();
    }
  });
} catch (e) {
  ;
}
