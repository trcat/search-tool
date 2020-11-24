$(function () {
  const $domainInput = $("input#domain");
  const $domainBtn = $("button#domainBtn");
  const $domainPage = $("input#page");
  const $domainView = $(".left tbody");
  const $portInput = $("input#port");
  const $portBtn = $("button#portBtn");
  const $portView = $(".right tbody");
  const $loading = $(".loading");
  const $copyBtn = $(".copy-btn button");
  const $copySuccessIcon = $(".copy-success");
  const $copyFailIcon = $(".copy-fail");
  let domainUrlCache = [];
  let domainTitleCache = [];
  let domainValue = "";
  let portUrlCache = [];
  let clipboard = null;

  function getData(url, params, $view, type) {
    $loading.show();
    $view.empty();
    $.post(
      url,
      params,
      (res, status) => {
        $loading.hide();
        if (type === "domain") {
          domainUrlCache = res.url;
          domainTitleCache = res.title;
        } else {
          portUrlCache = res.url;
        }
        if (res.url instanceof Array && res.title instanceof Array) {
          const length =
            res.url.length > res.title.length
              ? res.url.length
              : res.title.length;
          for (let i = 0; i < length; i++) {
            const $tr = $("<tr></tr>");
            $tr
              .append($(`<td class="url">${res.url[i]}</td>`))
              .append($(`<td class="title">${res.title[i]}</td>`));
            if (type === "port") {
              $tr.append(
                res.title[i] === domainTitleCache[i]
                  ? '<td class="result"><svg t="1605941708618" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2831" width="200" height="200"><path d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m0 945.230769C271.753846 945.230769 78.769231 752.246154 78.769231 512S271.753846 78.769231 512 78.769231s433.230769 192.984615 433.230769 433.230769-192.984615 433.230769-433.230769 433.230769z" p-id="2832" fill="#1afa29"></path><path d="M716.8 330.830769l-208.738462 248.123077c-15.753846 15.753846-43.323077 19.692308-59.076923 7.876923L299.323077 472.615385c-15.753846-11.815385-43.323077-7.876923-55.138462 7.876923-11.815385 15.753846-7.876923 43.323077 7.876923 55.138461l149.661539 114.215385c19.692308 15.753846 47.261538 23.630769 74.830769 23.630769 35.446154 0 70.892308-15.753846 94.523077-43.323077l208.738462-248.123077c15.753846-15.753846 11.815385-43.323077-3.938462-55.138461-19.692308-15.753846-43.323077-15.753846-59.076923 3.938461z" p-id="2833" fill="#1afa29"></path></svg></td>'
                  : '<td class="result"><svg t="1605941828084" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3676" width="200" height="200"><path d="M514.5 989.6c-64.5 0-127.1-12.6-186.1-37.6-56.9-24.1-108-58.5-151.9-102.4-43.9-43.9-78.3-95-102.4-151.9-24.9-58.9-37.6-121.5-37.6-186.1s12.6-127.1 37.6-186.1c24.1-56.9 58.5-108 102.4-151.9s95-78.3 151.9-102.4c59-24.9 121.6-37.6 186.1-37.6s127.1 12.6 186.1 37.6c56.9 24.1 108 58.5 151.9 102.4 43.9 43.9 78.3 95 102.4 151.9 24.9 58.9 37.6 121.5 37.6 186.1s-12.6 127.1-37.6 186.1c-24.1 56.9-58.5 108-102.4 151.9-43.9 43.9-95 78.3-151.9 102.4-59 24.9-121.6 37.6-186.1 37.6z m0-896c-230.5 0-418 187.5-418 418s187.5 418 418 418 418-187.5 418-418c-0.1-230.5-187.6-418-418-418z" p-id="3677" fill="#d81e06"></path><path d="M329.7 726.1c-7.7 0-15.4-2.9-21.3-8.8-11.7-11.7-11.6-30.7 0.1-42.4L659 326.2c11.7-11.7 30.7-11.6 42.4 0.1s11.6 30.7-0.1 42.4L350.9 717.3c-5.9 5.9-13.5 8.8-21.2 8.8z" p-id="3678" fill="#d81e06"></path><path d="M688.3 725.4c-7.7 0-15.4-2.9-21.3-8.8L318.3 366c-11.7-11.7-11.6-30.7 0.1-42.4s30.7-11.6 42.4 0.1l348.7 350.5c11.7 11.7 11.6 30.7-0.1 42.4-5.8 5.9-13.4 8.8-21.1 8.8z" p-id="3679" fill="#d81e06"></path></svg></td>'
              );
            }
            $view.append($tr);
          }
        }
      },
      "json"
    );
  }
  function checkDomain(domain) {
    if (domain) {
      const regex = new RegExp(/^[A-Za-z0-9\.]+$/);
      return regex.test(domain);
    } else {
      return false;
    }
  }
  $domainBtn.on("click", function (e) {
    const _domainValue = $domainInput.val();
    if (!_domainValue) {
      alert("域名不能为空");
    } else if (!checkDomain(_domainValue)) {
      alert("域名只能包含英文字符、数字和小数点");
    } else if (!$domainPage.val()) {
      alert("页码只能是数字");
    } else if (Number($domainPage.val()) < 1 || Number($domainPage.val()) > 20) {
      alert("页码不能低于1也不能高于20")
    } else {
      domainValue = _domainValue;
      getData(
        "index.php?action=getBaidu",
        $(".left form").serialize(),
        $domainView,
        "domain"
      );
    }
  });
  $portBtn.on("click", function (e) {
    if (domainUrlCache.length === 0 || !domainValue) {
      alert("请先读取左侧表格数据");
    } else if (!$portInput.val()) {
      alert("端口不能为空");
    } else if (isNaN(Number($portInput.val()))) {
      alert("端口只能是数字");
    } else {
      let params = $(".right form").serialize();
      params += `&domain=${domainValue}`;
      domainUrlCache.forEach((url, index) => {
        params += `&url[${index}]=${url}`;
      });
      getData("index.php?action=getLocal", params, $portView, "port");
    }
  });
  $copyBtn.on("click", function (e) {
    if (domainUrlCache.length > 0 && portUrlCache.length > 0 && domainValue) {
      const _portUrlCache = portUrlCache.map((url) => {
        const prefix = url.split("//")[0] + "//";
        const next = url.split("//")[1].split("/");
        next.shift();
        return prefix + domainValue + "/" + next.join("/");
      });
      const length =
        _portUrlCache.length > domainUrlCache.length
          ? _portUrlCache.length
          : domainUrlCache.length;
      let copyText = "";
      for (let i = 0; i < length; i++) {
        if (domainUrlCache[i] !== _portUrlCache[i]) {
          copyText += `${domainUrlCache[i]} ${_portUrlCache[i]}\n`;
        }
      }
      $(this).attr("data-clipboard-text", copyText);
      clipboard && clipboard.destroy();
      clipboard = new ClipboardJS(".copy-btn button");
      clipboard.on("success", (e) => {
        $copyFailIcon.hide();
        $copySuccessIcon.show();
      });
      clipboard.on("error", (e) => {
        $copyFailIcon.show();
        $copySuccessIcon.hide();
      });
    }
  });
});
