// General Gate/////////////////////////////////////////////////////////////////
/* Menu
 Gate = 0 (Comic)
 Gate = 1 (Ink)
 Gate = 2 (Cocoon)
 Gate = 3 (Surface)
 Gate = 4 (SkeMesh Display)
 Gate = 5 (SkeMesh Replay)
 Gate = 6 (Geometry)
 Gate = 7 (Crowding)
 Gate = 8 (Stick)
 Gate = 9 (Paper)
 Gate = 10 (Canvas)
 */

function getParameter(q) {
    q = q.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + q + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var Gate = getParameter('Gate');
var SkeMod=getParameter('SkeMod');
var SurMod=getParameter('SurMod');
var DynMod=getParameter('DynMod');
var FrameC=getParameter('FrameCount');
FrameC = parseInt(FrameC);
if(isNaN(FrameC) || FrameC==0) FrameC = 1;
var PapMod=getParameter('PapMod');
var PatMod=getParameter('PatMod');

// three.js setup/////////////////////////////////////////////////////////////////
var container, stats;
var camera, scene, renderer;
// kinect/control setup///////////////////////////////////////////////////////////
  var socket=io();
  var SkeData = [];
  var pos = [];
  var acc = [];
  var SkeFromKinect = new Float32Array( 75 ); 
  var bodyAnchor;
  var bodyAnchorAcc;
  var rightWrist;
  var rightWristAcc;        
  var leftWrist; 
  var leftWristAcc;
  var rightAnkle;
  var rightAnkleAcc;        
  var leftAnkle; 
  var leftAnkleAcc;
  var rightKnee;
  var leftKnee;
///Scenarios/////////////////////////////////////////////////////////////////////
  if(Gate == 0){
    //object 1: DrawTrace (as Mesh)
      var ObjIndex1 = DrawTraceIndex();
      var RHDraw = new DrawTrace(ObjIndex1);
      var LHDraw = new DrawTrace(ObjIndex1);
      var RLDraw = new DrawTrace(ObjIndex1);
      var LLDraw = new DrawTrace(ObjIndex1);
    //object 2: Cut (as Mesh)
      var RCut = new DrawCut();
      var LCut = new DrawCut();
    //object 3: Impact (as TextureQuad)
      var RHImp = new DrawImpact();
      var LHImp = new DrawImpact();
      var RLImp = new DrawImpact();
      var LLImp = new DrawImpact();
    //object 4: Explode (as TextureQuad)
      var Exp = new DrawExplode();
    //Collection
      var sceneObjectBase = [RHDraw, LHDraw, RLDraw, LLDraw];
      var sceneObjectSub1 = [RCut, LCut];
      var sceneObjectSub2 = [RHImp, LHImp,RLImp,LLImp];
      var sceneObjectSub3 = [Exp];
    //Suppliment
      var DrawColle = [[],[],[],[]];
      var ImpTarget = 0;
      var interval  = 100;
      var interval2 = 75;
}
  else if(Gate == 1){
      //object 1: DrawTrace (as Mesh)
      var ObjIndex1 = DrawTraceIndex();
      var RHDraw = new DrawTrace(ObjIndex1);
      var LHDraw = new DrawTrace(ObjIndex1);
      //object 2: impact (as Mesh)
      var RImp = new DrawImpact();
      var LImp = new DrawImpact();
      //object 3: Cut (as Mesh)
      var RCut = new DrawCut();
      var LCut = new DrawCut();
      //Collection
      var sceneObjectBase = [RHDraw, LHDraw];
      var sceneObjectSub1 = [RImp, LImp];
      var sceneObjectSub2 = [RCut, LCut];
      //Suppliment
      var DrawColle = [[],[]];
      var ControlR = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlL = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlColle = [[],[]];
      var ControlOutput = [ControlR,ControlL];
      var NodeTrigger = [0,0];
      var ImpTarget = 0;
      var CutTarget = 0;
      var interval = 100;
  }
  else if(Gate == 2){
      //object 1: DrawTrace (as Mesh)
      var ObjIndex1 = DrawTraceIndex();
      var RHDraw = new DrawTrace(ObjIndex1);
      var LHDraw = new DrawTrace(ObjIndex1);
      //object 2: Background Node (as Line)
      var BNode = new NodeMulti(0,50,10000);
      //object 3: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(SkeMod,1,true);
      //Collection
      var sceneObjectBase = [RHDraw, LHDraw];
      var sceneObjectSub1 = [BNode];
      var sceneObjectSub2 = [SkeletonMesh];
      //Suppliment
      var DrawColle = [[],[]];
      var Edges= [];
      var Nodes= [];
      var NodeData = [];
      var ControlR = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlL = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlColle = [[],[]];
      var ControlOutput = [ControlR,ControlL];
      var NodeTrigger = [0,0];
  }
  else if(Gate == 3){
      //object 1: DrawTrace (as Mesh)
      var ObjIndex1 = DrawTraceIndex();
      var RHDraw = new DrawTrace(ObjIndex1);
      var LHDraw = new DrawTrace(ObjIndex1);
      //object 2: Background Node (as Line)
      var BNode = new NodeMulti(SurMod,50,10000);
      //Collection
      var sceneObjectBase = [RHDraw, LHDraw];
      var sceneObjectSub1 = [BNode];
      //Suppliment
      var DrawColle = [[],[]];
      var Edges= [];
      var Nodes= [];
      var NodeData = [];
      var ControlR = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlL = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlColle = [[],[]];
      var ControlOutput = [ControlR,ControlL];
      var NodeTrigger = [0,0];
  }
  else if(Gate == 4){
      //object 1: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(SkeMod,1,true);
      var SkeMeshCur = new SkeMeshMulti(FrameC,SkeletonMesh,true);
      //Collection
      var sceneObjectBase = [SkeMeshCur];
  }
  else if(Gate == 5){
      //object 1: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(SkeMod,1,true);
      //object 2: skeletonReplay (as Mesh)
      var SkeMeshRPTempt = new SkeMeshRP(FrameC,SkeletonMesh,true);
      var SkeMeshRP1 = new SkeMeshMulti(FrameC,SkeletonMesh,true);
      var SkeMeshRP2 = new SkeMeshMulti(FrameC,SkeletonMesh,true);
      var SkeMeshRP3 = new SkeMeshMulti(FrameC,SkeletonMesh,true);
      //Collection
      var sceneObjectBase = [SkeletonMesh];
      var sceneObjectSub1 = [SkeMeshRP1,SkeMeshRP2,SkeMeshRP3];
      //Suppliment
      var RPChangeUpdate = -1;
      var intervalRP = 100;
      var RecSwitch = 0;
  }
  else if(Gate == 6){
      //object 1: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(SkeMod,1,true);
      var SkeletonMeshBack = new SkeMeshMulti(FrameC,SkeletonMesh,true);
      //Collection
      var sceneObjectBase = [SkeletonMesh];
      var sceneObjectSub1 = [SkeletonMeshBack];
      //Suppliment
      var interval = 7;
  }
  else if(Gate == 7){
      var CrowdCount = 15; // adjustable;
      //object 1: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(0,1,true);
      //object 2: skeletonReplay (as Mesh)
      var SkeMeshRPTempt = new SkeMeshRP(75,SkeletonMesh,true);
      var SkeMeshCrowd = new SkeMeshCrowd(CrowdCount,SkeMeshRPTempt);
      //Collection
      var sceneObjectBase = [SkeletonMesh];
      var sceneObjectSub1 = [SkeMeshCrowd];
      //Suppliment
      var intervalRP = 80;
  }
  else if(Gate == 8){
      //object 1: skeleton (as Lines)
      var ObjIndex1 = skeLineIndex();
      var skeLine = new skeletonLine(ObjIndex1);
      var RP1Line = new skeletonLine(ObjIndex1);
      var RP2Line = new skeletonLine(ObjIndex1);
      var RP3Line = new skeletonLine(ObjIndex1);
      //object 1Sub: skeleton Head (as Circle)
      var skeHead = new skeletonLineHead(0);
      var RP1Head = new skeletonLineHead(1);
      var RP2Head = new skeletonLineHead(1);
      var RP3Head = new skeletonLineHead(1);
      //object 2: impact (as Mesh)
      var Impact1 = new ImpactPiece();
      var Impact2 = new ImpactPiece();
      var Impact3 = new ImpactPiece();
      //Collection
      var sceneObjectBase = [skeLine];
      var sceneObjectSub1 = [RP1Line, RP2Line, RP3Line];
      var sceneObjectBaseHead = [skeHead];
      var sceneObjectSub1Head = [RP1Head, RP2Head, RP3Head];
      var sceneObjectSub2 = [Impact1, Impact2, Impact3];
      //Suppliment
      var RPChangeUpdate = -1;
      var intervalSt = 50;
      var ColliOri = [];
      var RecStickSwitch = 0;
      var Status = [0,0,0];
  }
  else if(Gate == 9){
      //object 1: DrawTrace (as Mesh)
      var ObjIndex1 = DrawTraceIndex();
      var RHDraw = new DrawTrace(ObjIndex1);
      var LHDraw = new DrawTrace(ObjIndex1);
      //object 2: Background Node (as Line)
      var BNode = new NodePaper(30, 30, -1000, 1000, -500, 500, 100,PapMod);
      //object 3: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(SkeMod,1,true);
      //Collection
      var sceneObjectBase = [RHDraw, LHDraw];
      var sceneObjectSub1 = [BNode];
      var sceneObjectSub2 = [SkeletonMesh];
      //Suppliment
      var DrawColle = [[],[]];
      var Edges= [];
      var Nodes= [];
      var NodeData = [];
      var ControlR = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlL = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlColle = [[],[]];
      var ControlOutput = [ControlR,ControlL];
      var NodeTrigger = [0,0];
      var interval = 7;
      var tt = 0.0;
  }
  else if(Gate == 10){
      //object 1: DrawTrace (as Mesh)
      var ObjIndex1 = DrawTraceIndex();
      var RHDraw = new DrawTrace(ObjIndex1);
      var LHDraw = new DrawTrace(ObjIndex1);
      //object 2: Background Node (as Line)
      var BNode = new NodePaper(30, 30, -1000, 1000, -500, 500, 100,PatMod);
      //object 3: skeleton (as Mesh)
      var SkeletonMesh = new SkeMesh(SkeMod,1,true);
      //Collection
      var sceneObjectBase = [RHDraw, LHDraw];
      var sceneObjectSub1 = [BNode];
      var sceneObjectSub2 = [SkeletonMesh];
      //Suppliment
      var DrawColle = [[],[]];
      var Edges= [];
      var Nodes= [];
      var NodeData = [];
      var ControlR = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlL = {
          X : 0.0,
          Y : 0.0,
          Z : 0.0
      };
      var ControlColle = [[],[]];
      var ControlOutput = [ControlR,ControlL];
      var NodeTrigger = [0,0];
      var interval = 7;
      var tt = 0.0;
      var NodeV = 1;
      NodeV.type = "int"
      var NodeVX = 1.0;
      NodeVX.type = "float"
      var NodeVY = 1.0;
      NodeVY.type = "float"
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Iniciate(){
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    init();
    interpretControl();
    animate();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function init(){
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 2750;
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 2000, 3500 );
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if(Gate == 0){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            DrawTraceCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            DrawCutCreate(sceneObjectSub1[i],scene);
        }
        for(var i = 0; i < sceneObjectSub2.length ; i++){
            DrawImpactCreate(sceneObjectSub2[i],scene);
        }
        for(var i = 0; i < sceneObjectSub3.length ; i++){
            DrawExplodeCreate(sceneObjectSub3[i],scene);
        }
    }
    else if(Gate == 1){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            DrawTraceCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            DrawImpactCreate(sceneObjectSub1[i],scene);
        }
        for(var i = 0; i < sceneObjectSub2.length ; i++){
            DrawCutCreate(sceneObjectSub2[i],scene);
        }
    }
    else if(Gate == 2){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            DrawTraceCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            NodeMultiCreate(sceneObjectSub1[i],scene);
        }
        for(var i = 0; i < sceneObjectSub2.length ; i++){
            SkeMeshCreate(sceneObjectSub2[i],scene);
        }
    }
    else if(Gate == 3){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            DrawTraceCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            NodeMultiCreate(sceneObjectSub1[i],scene);
        }
    }
    else if(Gate == 4){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            SkeMeshCreate(sceneObjectBase[i],scene);
        }
    }
    else if(Gate == 5){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            SkeMeshCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            SkeMeshRPCreate(sceneObjectSub1[i],scene);
        }
        SkeMeshRPData(SkeMeshRPTempt);
    }
    else if(Gate == 6){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            SkeMeshCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            SkeMeshCreate(sceneObjectSub1[i],scene);
        }
    }
    else if(Gate == 7){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            SkeMeshCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            SkeMeshCrowdCreate(sceneObjectSub1[i],scene);
        }
        SkeMeshRPData(SkeMeshRPTempt);
    }
    else if(Gate == 8){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            skeLineCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            skeLineCreate(sceneObjectSub1[i],scene);
        }
        for(var i = 0; i < sceneObjectBaseHead.length ; i++){
            skeHeadCreate(sceneObjectBaseHead[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1Head.length ; i++){
            skeHeadCreate(sceneObjectSub1Head[i],scene);
        }
        for(var i = 0; i < sceneObjectSub2.length ; i++){
            ImpactPieceCreate(sceneObjectSub2[i],scene);
        }
    }
    else if(Gate == 9){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            DrawTraceCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            NodePaperCreate(sceneObjectSub1[i],scene);
        }
        for(var i = 0; i < sceneObjectSub2.length ; i++){
            SkeMeshCreate(sceneObjectSub2[i],scene);
        }
    }
    else if(Gate == 10){
        for(var i = 0; i < sceneObjectBase.length ; i++){
            DrawTraceCreate(sceneObjectBase[i],scene);
        }
        for(var i = 0; i < sceneObjectSub1.length ; i++){
            NodePaperCreate(sceneObjectSub1[i],scene);
        }
        for(var i = 0; i < sceneObjectSub2.length ; i++){
            SkeMeshCreate(sceneObjectSub2[i],scene);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
     createStage(groundBool, wallBool, AmLightBool, DirectLight1Bool, DirectLight2Bool, scene);
     // render setup
     renderer = new THREE.WebGLRenderer({ antialias: true});
     renderer.setClearColor( scene.fog.color );
     renderer.setPixelRatio( window.devicePixelRatio );
     renderer.setSize( window.innerWidth, window.innerHeight );
     container.appendChild( renderer.domElement );
     renderer.gammaInput = true;
     renderer.gammaOutput = true;
     renderer.shadowMapEnabled = true;
     renderer.shadowMapSoft = true;
     // status and others
     stats = new Stats();
     stats.domElement.style.position = 'absolute';
     stats.domElement.style.top = '0px';
     container.appendChild( stats.domElement );
     window.addEventListener( 'resize', onWindowResize, false );
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// kinect stream
  function interpretControl(){
    socket.on("KinectBodyData", function(data){
       SkeData.push(data.joints)     
       if(SkeData.length > 5) SkeData.shift();        
       if(SkeData.length == 5){
            controlData(SkeData);
       }     
    });    
    function controlData(SkeData){      
         pos = SkeData[4];
         for ( var i = 0; i < 75; i ++ ) {
              acc[i] = SkeData[4][i] - SkeData[0][i];
         } 
     }
  }
  function controlSetup(){
          if(pos.length == 0){           
            bodyAnchor = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
            bodyAnchorAcc = {
                           X : 0.0,
                           Y : 0.0,
                           Z : 0.0
                       };
            rightWrist = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
            leftWrist = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
            rightWristAcc = {
                           X : 0.0,
                           Y : 0.0,
                           Z : 0.0
                       };
            leftWristAcc = {
                           X : 0.0,
                           Y : 0.0,
                           Z : 0.0
                       }; 
            rightAnkle = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
            leftAnkle = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
            rightAnkleAcc = {
                           X : 0.0,
                           Y : 0.0,
                           Z : 0.0
                       };
            leftAnkleAcc = {
                           X : 0.0,
                           Y : 0.0,
                           Z : 0.0
                       };  
            rightKnee = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
            leftKnee = {
                           X : 0.0,
                           Y : 0.0,
                           Z : -6.0
                       };
          }
          else{           
            bodyAnchor = {
                           X : pos[0]*8,
                           Y : pos[1]*8,
                           Z : pos[2]*8
                       };

            bodyAnchorAcc = {
                           X : acc[0]*8,
                           Y : acc[1]*8,
                           Z : acc[2]*8
                       };
            rightWrist = {
                           X : pos[33]*400,
                           Y : pos[34]*400,
                           Z : pos[35]*400
                       };
            leftWrist = {
                           X : pos[21]*400,
                           Y : pos[22]*400,
                           Z : pos[23]*400
                       };
            rightWristAcc = {
                           X : acc[33]*8,
                           Y : acc[34]*8,
                           Z : acc[35]*8
                       };
            leftWristAcc = {
                           X : acc[21]*8,
                           Y : acc[22]*8,
                           Z : acc[23]*8
                       };   
            rightAnkle = {
                           X : pos[54]*400,
                           Y : pos[55]*400,
                           Z : pos[56]*400
                       };
            leftAnkle = {
                           X : pos[42]*400,
                           Y : pos[43]*400,
                           Z : pos[44]*400
                       };
            rightAnkleAcc = {
                           X : acc[54]*8,
                           Y : acc[55]*8,
                           Z : acc[56]*8
                       };
            leftAnkleAcc = {
                           X : acc[42]*8,
                           Y : acc[43]*8,
                           Z : acc[44]*8
                       };  
            rightKnee = {
                           X : pos[51]*400,
                           Y : pos[52]*400,
                           Z : pos[53]*400
                       };
            leftKnee = {
                           X : pos[39]*400,
                           Y : pos[40]*400,
                           Z : pos[41]*400
                       };
          }
    
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate(){
    controlSetup();
    ////////////////////////////////////////////////////////////////////////////////////
    if(Gate == 0){
        if(pos[0]){
            controlData = [rightWristAcc,leftWristAcc,rightAnkleAcc,leftAnkleAcc];
            posData = [rightWrist,leftWrist,rightAnkle,leftAnkle];
            var PosIndicater = [33, 21, 54, 42];
            for( var i = 0; i < sceneObjectBase.length ; i++){
                DrawColleDynamic(DrawColle[i],pos,PosIndicater[i]);
                DrawTraceDynamic(controlData[i],sceneObjectBase[i],DrawColle[i],false);
            };
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                DrawCutDynamic(controlData[i],posData[i],sceneObjectSub1[i],DrawColle[i]);
            };
            for( var i = 0; i < sceneObjectSub2.length ; i++){
                DrawImpactDynamic(controlData[i],posData[i],sceneObjectSub2[i]);
            }
            for( var i = 0; i < sceneObjectSub3.length ; i++){
                DrawExplodeDynamic(sceneObjectSub2,sceneObjectSub3[i]);
            }
        }
    }
    else if(Gate == 1){
        if(pos[0]){
            controlData = [rightWristAcc,leftWristAcc];
            posData = [rightWrist,leftWrist];
            var PosIndicater = [33, 21];
            for( var i = 0; i < ControlColle.length ; i++){
                CtrlField(ControlColle[i],i,ControlOutput[i]);
            }
            for( var i = 0; i < sceneObjectBase.length ; i++){
                DrawColleDynamic(DrawColle[i],pos,PosIndicater[i]);
                DrawTraceDynamic(controlData[i],sceneObjectBase[i],DrawColle[i],ControlOutput[i]);
            };
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                DrawImpactDynamic(controlData[i],posData[i],sceneObjectSub1[i]);
            }
            for( var i = 0; i < sceneObjectSub2.length ; i++){
                DrawCutDynamic(controlData[i],posData[i],sceneObjectSub2[i],DrawColle[i]);
            };
        }
    }
    else if(Gate == 2){
        if(pos[0]){
            var PosIndicater = [33, 21];
            for( var i = 0; i < ControlColle.length ; i++){
                CtrlField(ControlColle[i],i,ControlOutput[i]);
            }
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                NodeMultiDynamic(sceneObjectSub1[i],0);
            };
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            };
            for( var i = 0; i < sceneObjectSub2.length ; i++){
                SkeMeshDynamic(bodyAnchorAcc,SkeFromKinect,sceneObjectSub2[i]);
            };
        }
    }
    else if(Gate == 3){
        if(pos[0]){
            controlData = [rightWristAcc,leftWristAcc,rightAnkleAcc,leftAnkleAcc];
            posData = [rightWrist,leftWrist,rightAnkle,leftAnkle];
            var PosIndicater = [33, 21];
            for( var i = 0; i < sceneObjectBase.length ; i++){
                DrawColleDynamic(DrawColle[i],pos,PosIndicater[i]);
                DrawTraceDynamic(controlData[i],sceneObjectBase[i],DrawColle[i]);
            };
            for( var i = 0; i < ControlColle.length ; i++){
                CtrlField(ControlColle[i],i,ControlOutput[i]);
            }
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                NodeMultiDynamic(sceneObjectSub1[i],DynMod);
            };

        }
    }
    else if(Gate == 4){
        if(pos[0]){
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            }
            for( var i = 0; i < sceneObjectBase.length ; i++){
                SkeMeshMultiDynamic(bodyAnchorAcc,SkeFromKinect,sceneObjectBase[i]);
            }
        }
    }
    else if(Gate == 5){
        if(pos[0]){
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            }
            for( var i = 0; i < sceneObjectBase.length ; i++){
                SkeMeshDynamic(bodyAnchorAcc,SkeFromKinect,sceneObjectBase[i]);
            }
            SkeMeshRPDataDynamic(bodyAnchorAcc,SkeFromKinect,SkeMeshRPTempt);
            SkeMeshRPCapture(bodyAnchorAcc,SkeMeshRPTempt,sceneObjectSub1,false);
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                SkeMeshMultiRPplay(sceneObjectSub1[i],i);
            }
        }
    }
    else if(Gate == 6){
        if(pos[0]){
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            };
            for( var i = 0; i < sceneObjectBase.length ; i++){
                SkeMeshDynamicShift(bodyAnchorAcc,SkeFromKinect,sceneObjectBase[i]);
            }
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                SkeMeshDynamicShift(bodyAnchorAcc,SkeFromKinect,sceneObjectSub1[i]);
            }
        }
    }
    else if(Gate == 7){
        if(pos[0]){
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            }
            for( var i = 0; i < sceneObjectBase.length ; i++){
                SkeMeshDynamic(bodyAnchorAcc,SkeFromKinect,sceneObjectBase[i]);
            }
            SkeMeshRPDataDynamic(bodyAnchorAcc,SkeFromKinect,SkeMeshRPTempt);
            SkeMeshRPCrowdCapture(bodyAnchorAcc,SkeMeshRPTempt,SkeMeshCrowd,true);
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                SkeMeshCrowdPlay(sceneObjectSub1[i],i);
            }
        }
    }
    else if(Gate == 8){
        if(pos[0]){
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            };
            for( var i = 0; i < sceneObjectBase.length ; i++){
                SkeDynamic(bodyAnchorAcc,SkeFromKinect,sceneObjectBase[i],sceneObjectBaseHead[i]);
                sceneObjectBase[i].trigger(bodyAnchorAcc,sceneObjectSub1);
                ColliOri = ColliAnalysis(sceneObjectBase[i],sceneObjectSub1);
            };
            if(ColliOri.length != 0){
                for( var i = 0; i < ColliOri.length ; i++){
                    ImpactPieceDynamic(ColliOri[i],sceneObjectSub2[i],i);
                    impactPieceSpread(sceneObjectSub2[i]);
                }
            }
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                skeLineDown(sceneObjectSub1[i],sceneObjectSub1Head[i],Status[i],i)
            }
        }
    }
    else if(Gate == 9){
        if(pos[0]){
            controlData = [rightWristAcc,leftWristAcc];
            posData = [rightWrist,leftWrist];
            var PosIndicater = [33, 21];
            for( var i = 0; i < sceneObjectBase.length ; i++){
                DrawColleDynamic(DrawColle[i],pos,PosIndicater[i]);
                DrawTraceDynamic(controlData[i],sceneObjectBase[i],DrawColle[i]);
            };
            for( var i = 0; i < ControlColle.length ; i++){
                CtrlField(ControlColle[i],i,ControlOutput[i]);
            }
            for( var i = 0; i < sceneObjectSub1.length ; i++){
                NodePaperDynamic(sceneObjectSub1[i],0,tt);
            };
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            };
            for( var i = 0; i < sceneObjectSub2.length ; i++){
                SkeMeshPaperDynamicShift(bodyAnchorAcc,SkeFromKinect,sceneObjectSub2[i]);
            }
        }
    }
    else if(Gate == 10){
        if(pos[0]){
            controlData = [rightWristAcc,leftWristAcc];
            posData = [rightWrist,leftWrist];
            var PosIndicater = [33, 21];
            for( var i = 0; i < sceneObjectBase.length ; i++){
                DrawColleDynamic(DrawColle[i],pos,PosIndicater[i]);
                DrawTraceDynamic(controlData[i],sceneObjectBase[i],DrawColle[i]);
            };
            for( var i = 0; i < ControlColle.length ; i++){
                CtrlField(ControlColle[i],i,ControlOutput[i]);
            }
            for( var j = 0; j < SkeFromKinect.length; j++ ) {
                SkeFromKinect[j] = pos[j]*400;
            };
            for( var i = 0; i < sceneObjectSub2.length ; i++){
                SkeMeshPaperDynamicShift(bodyAnchorAcc,SkeFromKinect,sceneObjectSub2[i]);
            }
            PatternUpdate();
        }
    }
   ////////////////////////////////////////////////////////////////////////////////////   
    if(Gate == 0){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    else if(Gate == 1){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    else if(Gate == 2){
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub2.length ; i++){
            if(sceneObjectSub2[i].Hybrid == false){
                sceneObjectSub2[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectSub2[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectSub2[i].Geo.attributes.color.needsUpdate = true;
            }
            else if(sceneObjectSub2[i].Hybrid == true){
                sceneObjectSub2[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectSub2[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectSub2[i].Geo.attributes.color.needsUpdate = true;
                sceneObjectSub2[i].GeoSub.attributes.position.needsUpdate = true;
                sceneObjectSub2[i].GeoSub.attributes.color.needsUpdate = true;
            }
        }
    }
    else if(Gate == 3){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    else if(Gate == 4){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            if(sceneObjectBase[i].Hybrid == false){
                sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
            }
            else if(sceneObjectBase[i].Hybrid == true){
                sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
                sceneObjectBase[i].GeoSub.attributes.position.needsUpdate = true;
                sceneObjectBase[i].GeoSub.attributes.color.needsUpdate = true;
            }
        }
    }
    else if(Gate == 5){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            if(sceneObjectBase[i].Hybrid == false){
                sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
            }
            else if(sceneObjectBase[i].Hybrid == true){
                sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
                sceneObjectBase[i].GeoSub.attributes.position.needsUpdate = true;
                sceneObjectBase[i].GeoSub.attributes.color.needsUpdate = true;
            }
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            if(sceneObjectSub1[i].Hybrid == false){
                sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectSub1[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
            }

            else if(sceneObjectSub1[i].Hybrid == true){
                sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectSub1[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
                sceneObjectSub1[i].GeoSub.attributes.position.needsUpdate = true;
                sceneObjectSub1[i].GeoSub.attributes.color.needsUpdate = true;
            }

        }
    }
    else if(Gate == 6){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            if(sceneObjectBase[i].Hybrid == false){
                sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
            }
            else if(sceneObjectBase[i].Hybrid == true){
                sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
                sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
                sceneObjectBase[i].GeoSub.attributes.position.needsUpdate = true;
                sceneObjectBase[i].GeoSub.attributes.color.needsUpdate = true;
            }
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    else if(Gate == 7){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    else if(Gate == 8){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectBaseHead.length ; i++){
            sceneObjectBaseHead[i].Geo.verticesNeedUpdate = true
        }
        for( var i = 0; i < sceneObjectSub1Head.length ; i++){
            sceneObjectSub1Head[i].Geo.verticesNeedUpdate = true
        }
    }
    else if(Gate == 9){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
            sceneObjectSub1[i].Mesh.material.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub2.length ; i++){
            sceneObjectSub2[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub2[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectSub2[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    else if(Gate == 10){
        for( var i = 0; i < sceneObjectBase.length ; i++){
            sceneObjectBase[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectBase[i].Geo.attributes.color.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub1.length ; i++){
            sceneObjectSub1[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectSub1[i].Geo.attributes.color.needsUpdate = true;
            sceneObjectSub1[i].Mesh.material.needsUpdate = true;
        }
        for( var i = 0; i < sceneObjectSub2.length ; i++){
            sceneObjectSub2[i].Geo.attributes.position.needsUpdate = true;
            sceneObjectSub2[i].Geo.attributes.normal.needsUpdate = true;
            sceneObjectSub2[i].Geo.attributes.color.needsUpdate = true;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////
    requestAnimationFrame( animate );
    render();
    stats.update();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // renderer
  function render(){      
      var time = performance.now();
      if(Gate == 9){
          var object0 = scene.children[ 2 ];
          if(PapMod == 2){
              object0.material.uniforms.time.value = time * 0.0005;
          }
          else if(PapMod == 3){
              object0.material.uniforms.time.value = time * 0.01;
          }
          else if(PapMod == 4 || PapMod == 5){
              object0.material.uniforms.time.value = time * 0.01;
          }
      }
      else if(Gate == 10){
          var object0 = scene.children[ 2 ];
          if(PatMod == 0){
              object0.material.uniforms.time.value = time * 0.005;
              object0.material.uniforms.NodeV.value = NodeV * 0.08;
          }
          else if(PatMod == 1){
              object0.material.uniforms.time.value = time * 0.005;
              object0.material.uniforms.NodeV.value = NodeV * 0.08;
          }
          else if(PatMod == 2){
              object0.material.uniforms.NodeV.value = NodeV * 0.08;
          }
          else if(PatMod == 3){
              object0.material.uniforms.NodeVX.value = NodeVX * 10;
              object0.material.uniforms.NodeVY.value = NodeVY * 10;
          }
      }
      renderer.shadowMapEnabled = true;
      renderer.shadowMapType = THREE.PCFShadowMap;
      renderer.render( scene, camera );
  }
  // resize windows
  function onWindowResize(){
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize( window.innerWidth, window.innerHeight );
  }
