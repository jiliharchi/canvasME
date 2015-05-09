$( "#Redo").hide();
$( "#output").hide();
$( "#Send").hide();
$( "#SendText").hide();

$('.dropdown-toggle').dropdown()
$(document).ready(function() {
    $("#GIFSizeSelect li a").click(function () {
        $("#GIFSizeCur").text($(this).text());
        $("#GIFSizeCur").val($(this).parent().val());
    });
})

$( "#GIFRedo" ).click(function() {
    location.reload();
})

$("#logo").click(function() {
    location.href = "./index.html"
})

function sendMail() {
    var x = document.getElementById("myEmail").value;

    var img=document.getElementById('theImage');

    if (!img) return;

    socket.emit("emailImage", {to:x, src:img.src});
   /* var link = "mailto:" + x
            + "&subject=" + escape("This is my expression")
           // + "&body=" + escape(document.getElementById('myText').value)
            + "&body=" + escape("testing")
        ;
    window.location.href = link;*/
}
