$( "#Redo").hide();
$( "#output").hide();
$( "#Send").hide();
$( "#SendText").hide();

$( "#GIFRedo" ).click(function() {
    location.reload();
})

$("#logo").click(function() {
    location.href = "./index.html"
})

function sendMail() {
    var x = document.getElementById("myEmail").value;
    var link = "mailto:" + x
            + "&subject=" + escape("This is my expression")
           // + "&body=" + escape(document.getElementById('myText').value)
            + "&body=" + escape("testing")
        ;
    window.location.href = link;
}
