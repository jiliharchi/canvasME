$("#preview video").attr({
    "autoplay": "autoplay"
})

$("#logo").click(function() {
    location.href = "./index.html"
})

chooseVideo();

$("#preview video")[0].load();

var video = document.getElementsByTagName('video')[0];

video.onended = function(e) {
    chooseVideo();
    $("#preview video")[0].load();
};

function chooseVideo(){
    var dice = Math.random();
    var videoColle = ["./video/main/Main0.mp4","./video/main/Main1.mp4","./video/main/Main2.mp4","./video/main/Main3.mp4"]
    if(dice < 0.25){
        $("#previewWindow").attr("src", videoColle[0]);
    }
    else if(dice >= 0.25 && dice < 0.5){
        $("#previewWindow").attr("src", videoColle[1]);
    }
    else if(dice >= 0.5 && dice < 0.75){
        $("#previewWindow").attr("src", videoColle[2]);
    }
    else if(dice >= 0.75){
        $("#previewWindow").attr("src", videoColle[3]);
    }
}