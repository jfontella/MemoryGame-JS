var ArrayGamemode = ["img/android.png", "img/chrome.png", "img/facebook.png", "img/firefox.png", "img/googleplus.png",
  "img/html5.png", "img/twitter.png", "img/windows.png"];
var Gamemode = "#tabuleiro";
var GameBoxOpen = "";
var GameImgOpen = "";
var Contador = 0;
var Pontos = 0;
var deltaTime;
var startTime;

let c1 = app.getComponente('c1');
let $ctrl = c1.$ctrl;

function RandomFunction(MaxValue, MinValue) {
  return Math.round(Math.random() * (MaxValue - MinValue) + MinValue);
}

function onGameModeShuffle() {
  var ListaImagem = new Array();

  for (var i = 0; i < $(Gamemode).children().length; i++) {

    var divtabuleiro = ($(Gamemode).children()[i]);
    var img = $(divtabuleiro).find('img');
    ListaImagem.push(img.attr('src'));
  }
    var Randomico;
  for (var i = 0; i < $(Gamemode).children().length; i++) {

    var divtabuleiro = ($(Gamemode).children()[i]);
    var img = $(divtabuleiro).find('img');
    Randomico = RandomFunction(ListaImagem.length - 1, 0);
    var x = ListaImagem[Randomico];
    ListaImagem.splice(Randomico, 1);
    $(img).attr('src', x);

  }

}

 $ctrl.onGameModeInit = function() {
  let lid;
  for (var j = 0; j < 2; j++) {
    for (var i = 0; i < ArrayGamemode.length; i++) {
      if (j == 0) {
        lid = i;
      } else {
        lid = i + 8;
      }

      $("#tabuleiro").append("<div id=card" + lid + " class=cardmem> <img id=imgcard" + lid + " src=" + ArrayGamemode[i] + " class=picture>");
    }
    onGameModeShuffle();
    GetRecordOnInit();
  }
  $("#tabuleiro div").click(onPlayerOpenCard);
}

function onGameModeReset() {
  onGameModeShuffle();
  $(Gamemode + " div img").hide();
  $(Gamemode + " div").css("visibility", "visible");
  Contador = 0;
  $("#success").remove();
  
  GameBoxOpen = "";
  GameImgOpen = "";
  Pontos = 0;
  alert('Gerando novo tabuleiro.');
  onGameModePrev();
  return false;
}
$(".lbutton").click(function(){
       onGameModeReset();
    });


function onPlayerOpenCard() {

  if (Contador == 0) {
    startTime = new Date().getTime();
  }
  var id = $(this).attr("id");
  if ($("#" + id + " img").is(":hidden")) {
    $(Gamemode + " div").unbind("click", onPlayerOpenCard);
    $("#" + id + " img").fadeIn('fast');
    if (GameImgOpen == "") {
      GameBoxOpen = id;
      GameImgOpen = $("#" + id + " img").attr("src");
      setTimeout(function() {
        $(Gamemode + " div").bind("click", onPlayerOpenCard)
      }, 300);
    } else {
      cGameOpened = $("#" + id + " img").attr("src");
      if (GameImgOpen != cGameOpened) {
        setTimeout(function() {
          $("#" + id + " img").fadeOut('fast');
          $("#" + GameBoxOpen + " img").fadeOut('fast');
          GameBoxOpen = "";
          GameImgOpen = "";
        }, 400);
      } else {
        Pontos++;
        GameBoxOpen = "";
        GameImgOpen = "";
      }
      setTimeout(function() {
        $(Gamemode + " div").bind("click", onPlayerOpenCard)
      }, 400);
    }
    Contador++;
    $("#Contador").html("" + Contador);
    if (Pontos == ArrayGamemode.length) {

      deltaTime = GetDeltaTime();
      CheckSetRecord(deltaTime);
      alert('Você ganhou o jogo!\n\n Para gerar um novo jogo clique no botão de gerar jogo.');

    }
  }
}

function onGameModePrev() {
  $(".picture").each(function() {
    $(this).fadeIn("slow");
    $(this).fadeOut(3000);
  });
}

function GetDeltaTime() {
  var now = new Date().getTime();
  return (now - startTime);
}

function PrintTime(myTime) {
  var result;
  var minutes = Math.floor((myTime % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (myTime % (1000 * 60)) / 1000;
  result = minutes + " minutos e " + seconds + " segundos";
  if (minutes == 0) {
    result = seconds + " segundos";
  }
  return result;
}

function GetRecordOnInit() {

  if (typeof(Storage) !== "undefined") {

    if ((lastRecord = localStorage.getItem("record")) != null) {

      document.getElementById("record").innerHTML = "RECORDE: " + PrintTime(lastRecord);
    }
  }
}

function CheckSetRecord(newDeltaTime) {

  if (typeof(Storage) !== "undefined") {
    var lastRecord;

    if (localStorage.getItem("record") == null) {
      localStorage.setItem("record", newDeltaTime.toString());
    } else {

      lastRecord = Number(localStorage.getItem("record"));

      if (newDeltaTime < lastRecord) {

        localStorage.setItem("record", newDeltaTime.toString());

        alert('Novo recorde!\nO melhor tempo era: ' + PrintTime(lastRecord) + '\nAgora o melhor tempo é o seu recorde de: ' + PrintTime(newDeltaTime));
      }
    }


    document.getElementById("record").innerHTML = "RECORDE: " + PrintTime(localStorage.getItem("record"));
  } else {
    alert('O NAVEGADOR UTILIZADO NÃO TEM CAPACIDADE DE ARMAZENAR DADOS');

  }
}

$(function() {
  app.c1.$ctrl.onGameModeInit();
  onGameModePrev();
});