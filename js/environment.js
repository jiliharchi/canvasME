if(Gate == 0){
    groundBool = 0;
    wallBool = 2;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 0;
}
else if(Gate == 1){
    groundBool = 0;
    wallBool = 0;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 1;
}
else if(Gate == 2){
    groundBool = 0;
    wallBool = 3;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 1;
}
else if(Gate == 3 || Gate == 6){
    groundBool = 0;
    wallBool = 0;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 1;
}
else if(Gate == 4 || Gate == 5 || Gate == 7){
    groundBool = 1;
    wallBool = 1;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 1;
}
else if(Gate == 8){
    groundBool = 1;
    wallBool = 0;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 1;
}
else if(Gate == 9 || Gate == 10){
    groundBool = 1;
    wallBool = 0;
    AmLightBool = 1;
    DirectLight1Bool = 1;
    DirectLight2Bool = 1;
}

function createStage(groundBool, wallBool, AmLightBool, DirectLight1Bool, DirectLight2Bool, scene){
	if(groundBool == 1){
	   var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
           var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
           groundMat.color.setHSL( 0.095, 0.095, 0.095 );
           var ground = new THREE.Mesh( groundGeo, groundMat );
           ground.rotation.x = -Math.PI/2;
           ground.position.y = -420;
           scene.add( ground );     
           ground.receiveShadow = true;
	}

	if(wallBool == 1){
	   var backWallGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
           var backWallMat = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, specular: 0x111111 } );
           backWallMat.color.setHSL( 0.2, 0.2, 0.2 );     
           var backWall = new THREE.Mesh( backWallGeo, backWallMat );
           backWall.position.z = 160;
           scene.add(backWall);
           backWall.receiveShadow = true;
	}
    else if(wallBool == 2){
        var backWallGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
        var backWallMat = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, specular: 0x111111 } );
        backWallMat.color.setHSL( 0.64, 0.66, 0.73 );
        var backWall = new THREE.Mesh( backWallGeo, backWallMat );
        backWall.position.z = 0;
        scene.add(backWall);
        backWall.receiveShadow = true;
    }
    else if(wallBool == 3){
        var backWallGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
        var backWallMat = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, specular: 0x111111 } );
        backWallMat.color.setHSL( 0.2, 0.2, 0.2 );
        var backWall = new THREE.Mesh( backWallGeo, backWallMat );
        backWall.position.z = -500;
        scene.add(backWall);
        backWall.receiveShadow = true;
    }

	if(AmLightBool == 1){
	   scene.add( new THREE.AmbientLight( 0xaaaaaa) );
	}

	if(DirectLight1Bool == 1){
	   var light1 = new THREE.DirectionalLight( 0xffffff, 1.0 );
           light1.position.x = -1500;
           light1.position.y = 300;
           light1.position.z = 1500;
           light1.castShadow = true;
           light1.shadowDarkness = 0.5;
           light1.shadowCameraLeft = -1000.0;
           light1.shadowCameraRight = 1000.0;
           light1.shadowCameraTop = 1000.0;
           light1.shadowCameraBottom = -1000.0;
           light1.shadowBias = -0.00002;
           light1.shadowMapWidth = 1024;
            light1.shadowMapHeight=1024;
           scene.add(light1);  
	}

	if(DirectLight2Bool == 1){
	   var light2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
           light2.position.x = -700;
           light2.position.y = 2050;
           light2.position.z = 2500;
           light2.castShadow = true;
           light2.shadowDarkness = 0.1;
           light2.shadowCameraLeft = -1000.0;
           light2.shadowCameraRight = 1000.0;
           light2.shadowCameraTop = 1000.0;
           light2.shadowCameraBottom = -1000.0;
           light1.shadowBias = -0.001;
           light2.shadowMapWidth = 1024;
           scene.add(light2);
	}
}