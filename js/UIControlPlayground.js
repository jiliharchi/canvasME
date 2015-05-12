var CtrlTextC0 = "Captures arm motions (specially impact and slash) and express in comic language.";
var CtrlTextC1 = "Captures arm motions (specially impact and slash) and use ink splitter effect to express.";
var CtrlTextC2 = "Captures whole body movement and emphasize on the arm motion and its effect.";
var CtrlTextC3 = "Captures arm motions and use dynamic surface to illustrate the effect.";
var CtrlTextC4 = "Captures the frames of body movement and use geometry to illustrate.";
var CtrlTextC5 = "Create geometries representing body motions, allow custom control on recordings.";
var CtrlTextC6 = "Use two set of geometries to represent body motions.";
var CtrlTextC7 = "Emphasize body motions by the amount of figures.";
var CtrlTextC8 = "Create a dialogue between figures in different times.";
var CtrlTextC9 = "Capture arm motions and create responsive canvas.";
var CtrlTextC10 = "Capture arm motions and create responsive patterns to illustrate the effect.";
$("#CtrlTextContent").text(CtrlTextC0);
$('.dropdown-toggle').dropdown()

var refPic0 = ["./img/main/Pro0.jpg","./img/main/ref0.jpg","./img/main/ref1.jpg","./img/main/ref2.jpg","./img/main/ref3.jpg"];
var refTitle0 = "Roy Lichtenstein";
var refTxt0 = "Pop art is an postmodern art movement that emerged in the mid-1950s in Britain and in the late 1950s in the United States. Roy Fox Lichtenstein is one of the leading figure of this movement. Such art style is close related to cartoon, advertisements and mundane cultural objects. 'Whaam!' and 'Drowning Girl' are generally regarded as his most famous works.";
var egPic0 = ["./img/gallery/a00.gif","./img/gallery/a01.gif","./img/gallery/a02.gif","./img/gallery/a03.gif","./img/gallery/a04.gif","./img/gallery/a05.gif"];

var refPic1 = ["./img/main/Pro1.jpg","./img/main/ref4.jpg","./img/main/ref5.jpg","./img/main/ref6.jpg","./img/main/ref7.jpg"];
var refTitle1 = "Jackson Pollock";
var refTxt1 = "Ink splitter art is one form of abstract expressionism and Jackson Pollock is well known for his unique style of drip painting. His motions and inner emotions can be read from the trace of the ink, and the randomness of the splatter adds unique beauty to it. Traditional Chinese calligraphy has similar features, that audiences read the speed, turns, sharpness ... to read the emotions of the calligrapher. ";
var egPic1 = ["./img/gallery/b00.gif","./img/gallery/b01.gif","./img/gallery/b02.gif","./img/gallery/b03.gif","./img/gallery/b04.gif","./img/gallery/b05.gif"];

var refPic2 = ["./img/main/ref8.jpg","./img/main/ref9.jpg","./img/main/ref10.jpg","./img/main/ref11.jpg"];
var refTitle2 = "Concept art of cocoon";
var refTxt2 = "As its unique visual features, cocoon and its textile are common language to express trends, dynamics and reactions. It is widely used in various design fields such as architecture, installation, fashion and concept arts. Its interactions with hands and arms relate to Tai Chi, which imagine the force ('Qi', as refered by Chinese culture) follows your motions.";
var egPic2 = ["./img/gallery/c00.gif","./img/gallery/c01.gif","./img/gallery/c02.gif","./img/gallery/c03.gif","./img/gallery/c04.gif","./img/gallery/c05.gif"];

var refPic3 = ["./img/main/ref12.jpg","./img/main/ref13.jpg","./img/main/ref14.jpg","./img/main/ref15.jpg"];
var refTitle3 = "Gradual change and parametrics";
var refTxt3 = "Gradual change is another common use language in design field, especially we now have computational tools to achieve the visual effect. Such techniques are widely used in architecture design, landscapes, installations and facade designs. When its parameters are changed, the canvas can achieve different effect.";
var egPic3 = ["./img/gallery/d00.gif","./img/gallery/d01.gif","./img/gallery/d02.gif","./img/gallery/d03.gif","./img/gallery/d04.gif","./img/gallery/d05.gif"];

var refPic4 = ["./img/main/Pro2.jpg","./img/main/ref16.jpg","./img/main/ref17.jpg","./img/main/ref18.jpg","./img/main/ref19.jpg"];
var refTitle4 = "Marcel Duchamp";
var refTxt4 = "To illustrate motion, chronophotography technique captures the movement frames in a serial sequence. How about putting these frames on the same canvas? Marcel Duchamp is one famous artist of cubism and futurism. His work 'Nude Descending a Staircase, No. 2', collides multiple frames into one picture to express the motion. The geometries representations of the figure has referenced Issey Miyake's design.";
var egPic4 = ["./img/gallery/e00.gif","./img/gallery/e01.gif","./img/gallery/e02.gif","./img/gallery/e03.gif","./img/gallery/e04.gif","./img/gallery/e05.gif"];

var refPic5 = ["./img/main/Pro3.jpg","./img/main/ref20.jpg","./img/main/ref21.jpg","./img/main/ref22.jpg","./img/main/ref23.jpg"];
var refTitle5 = "Kazimir Malevich";
var refTxt5 = "Kazimir Severinovich Malevich is a pioneer of geometric abstract art during the avant-garde movement. The technique is to use geometry layouts to illustrate motion dynamics. The strong contrast of the color is another feature.";
var egPic5 = ["./img/gallery/f00.gif","./img/gallery/f01.gif","./img/gallery/f02.gif","./img/gallery/f03.gif","./img/gallery/f04.gif","./img/gallery/f05.gif"];
var egPic6 = ["./img/gallery/g00.gif","./img/gallery/g01.gif","./img/gallery/g02.gif","./img/gallery/g03.gif","./img/gallery/g04.gif","./img/gallery/g05.gif"];

var refPic6 = ["./img/main/ref24.jpg","./img/main/ref25.jpg","./img/main/ref26.jpg","./img/main/ref27.jpg"];
var refTitle6 = "Crowd as emotion catalysis";
var refTxt6 = "When expressed as a group rather than an individual, emotions are much more strengthened. This canvas allows people to express their feelings to the maxium extent.";
var egPic7 = ["./img/gallery/h00.gif","./img/gallery/h01.gif","./img/gallery/h02.gif","./img/gallery/h03.gif","./img/gallery/h04.gif","./img/gallery/h05.gif"];

var refPic7 = ["./img/main/ref28.jpg","./img/main/ref29.jpg"];
var refTitle7 = "Stick figures interactions";
var refTxt7 = "The most simple language to illustrate actions: stick figures. When combine with other elements they can express motion elegantly. This canvas setup allow people to record their previous positions and interact with them.";
var egPic8 = ["./img/gallery/i00.gif","./img/gallery/i01.gif","./img/gallery/i02.gif","./img/gallery/i03.gif","./img/gallery/i04.gif","./img/gallery/i05.gif"];

var refPic8 = ["./img/main/ref30.jpg","./img/main/ref31.jpg","./img/main/ref32.jpg","./img/main/ref33.jpg"];
var refTitle8 = "Interactive canvas";
var refTxt8 = "This is one of those examples that use the interact result to express emotions. The canvas is mode of nodes that receive force more people's hands and also have resistance tensions. The cloth-like appearance can also integrate with various dynamic patterns.."
var egPic9 = ["./img/gallery/j00.gif","./img/gallery/j01.gif","./img/gallery/j02.gif","./img/gallery/j03.gif","./img/gallery/j04.gif","./img/gallery/j05.gif"];

var refPic9 = ["./img/main/ref34.jpg","./img/main/ref35.jpg","./img/main/ref36.jpg","./img/main/ref37.jpg"];
var refTitle9 = "Interactive patterns";
var refTxt9 = "Based on different control methods, the patterns on the canvas can create various motion dialogue with people, thus developing new user experiences. ";
var egPic10 = ["./img/gallery/k00.gif","./img/gallery/k01.gif","./img/gallery/k02.gif","./img/gallery/k03.gif","./img/gallery/k04.gif","./img/gallery/k05.gif"];

$("#refPro").attr("src", refPic0[0]);
$("#refSlide0").attr("src", refPic0[1]);
$("#refSlide1").attr("src", refPic0[2]);
$("#refSlide2").attr("src", refPic0[3]);
$("#refSlide3").attr("src", refPic0[4]);
$("#refTitle").text(refTitle0);
$("#refText").text(refTxt0);
$("#eg0").attr("src", egPic0[0]);
$("#eg1").attr("src", egPic0[1]);
$("#eg2").attr("src", egPic0[2]);
$("#eg3").attr("src", egPic0[3]);
$("#eg4").attr("src", egPic0[4]);
$("#eg5").attr("src", egPic0[5]);

$(document).ready(function() {
    $("#FrameCountNum").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});

$("#logo").click(function() {
    location.href = "./index.html"
})

$(".ModSel").click(function() {
    $(".ModSel").removeClass( "active" );
    $(this).addClass("active");
});

$(document).ready(function()
{
    $("#PicSelect li a").click(function(){
        $("#PicCur").text($(this).text());
        $("#PicCur").val($(this).parent().val());
    });

    $("#FigureSelect li a").click(function(){
        $("#FigureCur").text($(this).text());
        $("#FigureCur").val($(this).parent().val());
    });

    $("#SurfaceSelect li a").click(function(){
        $("#SurfaceCur").text($(this).text());
        $("#SurfaceCur").val($(this).parent().val());
    });

    $("#DynamicSelect li a").click(function(){
        $("#DynamicCur").text($(this).text());
        $("#DynamicCur").val($(this).parent().val());
    });

    $("#PaperSelect li a").click(function(){
        $("#PaperCur").text($(this).text());
        $("#PaperCur").val($(this).parent().val());
    });

    $("#PatternSelect li a").click(function(){
        $("#PatternCur").text($(this).text());
        $("#PatternCur").val($(this).parent().val());
    });
});

$("#previewPlay video").attr({
    "autoplay": "autoplay"
})

var ModTarget = 0;
$( "#FigureMOD").hide();
$( "#SurfaceMOD").hide();
$( "#DynamicMOD").hide();
$( "#PaperMOD").hide();
$( "#PatternMOD").hide();
$( "#Frames").hide();
$("#PicMOD").show();

$( ".ModSel" ).click(function() {
    ModTarget = parseInt($(this).children()[0].id) ;
    iniciateCtrl(ModTarget);
});

function iniciateCtrl(ModTarget){
    if(ModTarget == 1 || ModTarget == 7 || ModTarget == 8){
        $( "#FigureMOD").hide();
        $( "#SurfaceMOD").hide();
        $( "#DynamicMOD").hide();
        $( "#Frames").hide();
        $( "#PaperMOD").hide();
        $( "#PatternMOD").hide();
        $("#PicMOD").hide();
    }
    else if(ModTarget == 0){
        $( "#FigureMOD").hide();
        $( "#SurfaceMOD").hide();
        $( "#DynamicMOD").hide();
        $( "#Frames").hide();
        $( "#PaperMOD").hide();
        $( "#PatternMOD").hide();
        $("#PicMOD").show();
    }
    else if(ModTarget == 2){
        $( "#FigureMOD").show();
        $( "#SurfaceMOD").hide();
        $( "#DynamicMOD").hide();
        $( "#Frames").hide();
        $( "#PaperMOD").hide();
        $( "#PatternMOD").hide();
        $("#PicMOD").hide();
    }
    else if(ModTarget == 3){
        $( "#FigureMOD").hide();
        $( "#SurfaceMOD").show();
        $( "#DynamicMOD").show();
        $( "#Frames").hide();
        $( "#PaperMOD").hide();
        $( "#PatternMOD").hide();
        $("#PicMOD").hide();
    }
    else if(ModTarget == 4 || ModTarget == 5 || ModTarget == 6){
        $( "#FigureMOD").show();
        $( "#SurfaceMOD").hide();
        $( "#DynamicMOD").hide();
        $( "#Frames").show();
        $( "#PaperMOD").hide();
        $( "#PatternMOD").hide();
        $("#PicMOD").hide();
    }
    else if( ModTarget == 9){
        $( "#FigureMOD").show();
        $( "#SurfaceMOD").hide();
        $( "#DynamicMOD").hide();
        $( "#Frames").hide();
        $( "#PaperMOD").show();
        $( "#PatternMOD").hide();
        $("#PicMOD").hide();
    }
    else if(ModTarget == 10){
        $( "#FigureMOD").show();
        $( "#SurfaceMOD").hide();
        $( "#DynamicMOD").hide();
        $( "#Frames").hide();
        $( "#PaperMOD").hide();
        $( "#PatternMOD").show();
        $("#PicMOD").hide();
    }



    if(ModTarget == 0){
        $("#previewWindow").attr("src", "./video/Mode0.mp4");
        $("#CtrlTextContent").text(CtrlTextC0);
        $("#refPro").show();
        $("#refPro").attr("src", refPic0[0]);
        $("#refSlide0").attr("src", refPic0[1]);
        $("#refSlide1").attr("src", refPic0[2]);
        $("#refSlide2").attr("src", refPic0[3]);
        $("#refSlide3").attr("src", refPic0[4]);
        $("#refTitle").text(refTitle0);
        $("#refText").text(refTxt0);
        $("#eg0").attr("src", egPic0[0]);
        $("#eg1").attr("src", egPic0[1]);
        $("#eg2").attr("src", egPic0[2]);
        $("#eg3").attr("src", egPic0[3]);
        $("#eg4").attr("src", egPic0[4]);
        $("#eg5").attr("src", egPic0[5]);
    }
    else if(ModTarget == 1){
        $("#previewWindow").attr("src", "./video/Mode1.mp4");
        $("#CtrlTextContent").text(CtrlTextC1);
        $("#refPro").show();
        $("#refPro").attr("src", refPic1[0]);
        $("#refSlide0").attr("src", refPic1[1]);
        $("#refSlide1").attr("src", refPic1[2]);
        $("#refSlide2").attr("src", refPic1[3]);
        $("#refSlide3").attr("src", refPic1[4]);
        $("#refTitle").text(refTitle1);
        $("#refText").text(refTxt1);
        $("#eg0").attr("src", egPic1[0]);
        $("#eg1").attr("src", egPic1[1]);
        $("#eg2").attr("src", egPic1[2]);
        $("#eg3").attr("src", egPic1[3]);
        $("#eg4").attr("src", egPic1[4]);
        $("#eg5").attr("src", egPic1[5]);
    }
    else if(ModTarget == 2){
        $("#previewWindow").attr("src", "./video/Mode2.mp4");
        $("#CtrlTextContent").text(CtrlTextC2);
        $("#refPro").hide();
        $("#refSlide0").attr("src", refPic2[0]);
        $("#refSlide1").attr("src", refPic2[1]);
        $("#refSlide2").attr("src", refPic2[2]);
        $("#refSlide3").attr("src", refPic2[3]);
        $("#refTitle").text(refTitle2);
        $("#refText").text(refTxt2);
        $("#eg0").attr("src", egPic2[0]);
        $("#eg1").attr("src", egPic2[1]);
        $("#eg2").attr("src", egPic2[2]);
        $("#eg3").attr("src", egPic2[3]);
        $("#eg4").attr("src", egPic2[4]);
        $("#eg5").attr("src", egPic2[5]);
    }
    else if(ModTarget == 3){
        $("#previewWindow").attr("src", "./video/Mode3.mp4");
        $("#CtrlTextContent").text(CtrlTextC3);
        $("#refPro").hide();
        $("#refSlide0").attr("src", refPic3[0]);
        $("#refSlide1").attr("src", refPic3[1]);
        $("#refSlide2").attr("src", refPic3[2]);
        $("#refSlide3").attr("src", refPic3[3]);
        $("#refTitle").text(refTitle3);
        $("#refText").text(refTxt3);
        $("#eg0").attr("src", egPic3[0]);
        $("#eg1").attr("src", egPic3[1]);
        $("#eg2").attr("src", egPic3[2]);
        $("#eg3").attr("src", egPic3[3]);
        $("#eg4").attr("src", egPic3[4]);
        $("#eg5").attr("src", egPic3[5]);
    }
    else if(ModTarget == 4){
        $("#previewWindow").attr("src", "./video/Mode4.mp4");
        $("#CtrlTextContent").text(CtrlTextC4);
        $("#refPro").show();
        $("#refPro").attr("src", refPic4[0]);
        $("#refSlide0").attr("src", refPic4[1]);
        $("#refSlide1").attr("src", refPic4[2]);
        $("#refSlide2").attr("src", refPic4[3]);
        $("#refSlide3").attr("src", refPic4[4]);
        $("#refTitle").text(refTitle4);
        $("#refText").text(refTxt4);
        $("#eg0").attr("src", egPic4[0]);
        $("#eg1").attr("src", egPic4[1]);
        $("#eg2").attr("src", egPic4[2]);
        $("#eg3").attr("src", egPic4[3]);
        $("#eg4").attr("src", egPic4[4]);
        $("#eg5").attr("src", egPic4[5]);
    }
    else if(ModTarget == 5){
        $("#previewWindow").attr("src", "./video/Mode5.mp4");
        $("#CtrlTextContent").text(CtrlTextC5);
        $("#refPro").show();
        $("#refPro").attr("src", refPic4[0]);
        $("#refSlide0").attr("src", refPic4[1]);
        $("#refSlide1").attr("src", refPic4[2]);
        $("#refSlide2").attr("src", refPic4[3]);
        $("#refSlide3").attr("src", refPic4[4]);
        $("#refTitle").text(refTitle4);
        $("#refText").text(refTxt4);
        $("#eg0").attr("src", egPic5[0]);
        $("#eg1").attr("src", egPic5[1]);
        $("#eg2").attr("src", egPic5[2]);
        $("#eg3").attr("src", egPic5[3]);
        $("#eg4").attr("src", egPic5[4]);
        $("#eg5").attr("src", egPic5[5]);
    }
    else if(ModTarget == 6){
        $("#previewWindow").attr("src", "./video/Mode6.mp4");
        $("#CtrlTextContent").text(CtrlTextC6);
        $("#refPro").show();
        $("#refPro").attr("src", refPic5[0]);
        $("#refSlide0").attr("src", refPic5[1]);
        $("#refSlide1").attr("src", refPic5[2]);
        $("#refSlide2").attr("src", refPic5[3]);
        $("#refSlide3").attr("src", refPic5[4]);
        $("#refTitle").text(refTitle5);
        $("#refText").text(refTxt5);
        $("#eg0").attr("src", egPic6[0]);
        $("#eg1").attr("src", egPic6[1]);
        $("#eg2").attr("src", egPic6[2]);
        $("#eg3").attr("src", egPic6[3]);
        $("#eg4").attr("src", egPic6[4]);
        $("#eg5").attr("src", egPic6[5]);
    }
    else if(ModTarget == 7){
        $("#previewWindow").attr("src", "./video/Mode7.mp4");
        $("#CtrlTextContent").text(CtrlTextC7);
        $("#refPro").hide();
        $("#refSlide0").attr("src", refPic6[0]);
        $("#refSlide1").attr("src", refPic6[1]);
        $("#refSlide2").attr("src", refPic6[2]);
        $("#refSlide3").attr("src", refPic6[3]);
        $("#refTitle").text(refTitle6);
        $("#refText").text(refTxt6);
        $("#eg0").attr("src", egPic7[0]);
        $("#eg1").attr("src", egPic7[1]);
        $("#eg2").attr("src", egPic7[2]);
        $("#eg3").attr("src", egPic7[3]);
        $("#eg4").attr("src", egPic7[4]);
        $("#eg5").attr("src", egPic7[5]);
    }
    else if(ModTarget == 8){
        $("#previewWindow").attr("src", "./video/Mode8.mp4");
        $("#CtrlTextContent").text(CtrlTextC8);
        $("#refPro").hide();
        $("#refSlide0").attr("src", refPic7[0]);
        $("#refSlide1").attr("src", refPic7[1]);
        $("#refSlide2").attr("src", refPic7[0]);
        $("#refSlide3").attr("src", refPic7[1]);
        $("#refTitle").text(refTitle7);
        $("#refText").text(refTxt7);
        $("#eg0").attr("src", egPic8[0]);
        $("#eg1").attr("src", egPic8[1]);
        $("#eg2").attr("src", egPic8[2]);
        $("#eg3").attr("src", egPic8[3]);
        $("#eg4").attr("src", egPic8[4]);
        $("#eg5").attr("src", egPic8[5]);
    }
    else if(ModTarget == 9){
        $("#previewWindow").attr("src", "./video/Mode9.mp4");
        $("#CtrlTextContent").text(CtrlTextC9);
        $("#refPro").hide();
        $("#refSlide0").attr("src", refPic8[0]);
        $("#refSlide1").attr("src", refPic8[1]);
        $("#refSlide2").attr("src", refPic8[2]);
        $("#refSlide3").attr("src", refPic8[3]);
        $("#refTitle").text(refTitle8);
        $("#refText").text(refTxt8);
        $("#eg0").attr("src", egPic9[0]);
        $("#eg1").attr("src", egPic9[1]);
        $("#eg2").attr("src", egPic9[2]);
        $("#eg3").attr("src", egPic9[3]);
        $("#eg4").attr("src", egPic9[4]);
        $("#eg5").attr("src", egPic9[5]);
    }
    else if(ModTarget == 10){
        $("#previewWindow").attr("src", "./video/Mode10.mp4");
        $("#CtrlTextContent").text(CtrlTextC10);
        $("#refPro").hide();
        $("#refSlide0").attr("src", refPic9[0]);
        $("#refSlide1").attr("src", refPic9[1]);
        $("#refSlide2").attr("src", refPic9[2]);
        $("#refSlide3").attr("src", refPic9[3]);
        $("#refTitle").text(refTitle9);
        $("#refText").text(refTxt9);
        $("#eg0").attr("src", egPic10[0]);
        $("#eg1").attr("src", egPic10[1]);
        $("#eg2").attr("src", egPic10[2]);
        $("#eg3").attr("src", egPic10[3]);
        $("#eg4").attr("src", egPic10[4]);
        $("#eg5").attr("src", egPic10[5]);
    }
    $("#previewPlay video")[0].load()
}

$( "#toCanvas" ).click(function() {
    alert("We are sorry that this function has yet implanted on web-based terminal.");
});

$( "#toGIF" ).click(function() {
    alert("We are sorry that this function has yet implanted on web-based terminal.");
});


