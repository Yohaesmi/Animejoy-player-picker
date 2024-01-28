// ==UserScript==
// @name        Animejoy player picker
// @namespace   Violentmonkey Scripts
// @match       https://animejoy.ru/*
// @grant       none
// @version     1.0
// @author      Jafia
// @description Автоматический выбор плеера при загрузке страницы
// ==/UserScript==

(() => {
  const players = ['Наш плеер', 'CDA']; // Список предпочтительных плееров по порядку
  const subs = ['AL', 'UNT-LATORS', 'Sanae'];  // Список предпочтительных сабов по порядку
  let ready;

  function run(){
    if(ready) return;
    ready = true;
    console.log('Ready!!!');
    let hasSubs;
    const lists = document.querySelector(`.playlists-lists`);
    if(lists && lists.children.length > 1) hasSubs = true;
    let plOnPage = [];
    let subsOnPage = [];
    let pPick;
    let sPick;

    //Выбор сабов
    if(hasSubs){
      for(let i = 0, arr = document.querySelectorAll(`.playlists-lists>:nth-child(1) ul>li`), len = arr.length; i < len; i++){
        subsOnPage.push(arr[i].textContent);
      }
      subsOnPage = [...new Set(subsOnPage)];
      console.log(subsOnPage);
      for(let i = 0, sLen = subs.length; i < sLen; i++){
        // console.log('q');
        for(let s = 0, spLen = subsOnPage.length; s < spLen; s++){
          if(subsOnPage[s].match(subs[i])){
            sPick = subs[i];
            console.log(`Будут выбраны субтитры: ${sPick}`);
            break;
          }
        }
        if(sPick) break;
      };
      if(sPick) for(let i = 0, arr = document.querySelectorAll(`.playlists-lists>:nth-child(1) ul>li`), len = arr.length; i < len; i++){
       if(arr[i].textContent.match(sPick, 'gmi')){
         arr[i].click();
         console.log(`Выбраны субтитры: ${arr[i].textContent}`);
         break;
       }
      }
    }

    // Выбор плеера
    for(let i = 0, arr = document.querySelectorAll(`.playlists-lists>:nth-child(${hasSubs ? 2:1}) ul>li`), len = arr.length; i < len; i++){
      plOnPage.push(arr[i].textContent);
    }
    plOnPage = [...new Set(plOnPage)];
    console.log(plOnPage);
    for(let i = 0, pLen = players.length; i < pLen; i++){
      const pCheck = plOnPage.indexOf(players[i]);
      if(pCheck !== -1){
        pPick = plOnPage[pCheck];
        console.log(`Будет выбран ${pPick}`);
        break;
      }
    }
    if(pPick) for(let i = 0, arr = document.querySelectorAll(`.playlists-lists>:nth-child(${hasSubs ? 2:1}) ul>li`), len = arr.length; i < len; i++){
     if(arr[i].textContent === pPick){
       arr[i].click();
       console.log(`Выбран ${arr[i].textContent}`);
       break;
     }
    }
  }

  (function() {
    var proxied = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function(){
      var pointer = this
      var intervalId = window.setInterval(function(){
        if(pointer.readyState != 4){
          return;
        }
        // console.log(pointer);
        // console.log(pointer.responseURL);
        if(pointer.responseURL.match(/https:\/\/animejoy.ru\/tv-serialy\/engine\/ajax\/ajax.php/)) document.dispatchEvent(
          new CustomEvent('status', {
            bubbles: true,
            detail: {
              status: 'ready'
            }
          })
        );
        clearInterval(intervalId);

      }, 1);
      return proxied.apply(this, [].slice.call(arguments));
    };


  })();

  window.addEventListener('status', (e) => {
    console.log('[STATUS]', e.detail);

    run(e.detail);
  }, {once:true});
})();
