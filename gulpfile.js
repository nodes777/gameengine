/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('browser-sync', function() {
	browserSync.init({
   	 server: {
            baseDir: "./"
        },
    open: false,
    files: [ '*.css', '*.html', 'css/*.css'],
    });
});


//./src/Engine/**/*.js'
gulp.task('scripts', function() {
  return gulp.src([
    'src/Engine/Core/Engine_Core.js',
    'src/Engine/Core/Engine_VertexBuffer.js',
    'src/Engine/Core/Engine_Input.js',
    'src/Engine/Core/Engine_GameLoop.js',
    'src/Engine/Core/Engine_Physics.js',
    'src/Engine/Core/Engine_Particle.js',
    'src/Engine/Core/Engine_LayerManager.js',
    'src/Engine/Core/Resources/Engine_ResourceMap.js',
    'src/Engine/Core/Resources/Engine_TextFileLoader.js',
    'src/Engine/Core/Resources/Engine_DefaultResources.js',
    'src/Engine/Core/Resources/Engine_AudioClips.js',
    'src/Engine/Core/Resources/Engine_Textures.js',
    'src/Engine/Core/Resources/Engine_Fonts.js',
    'src/Engine/Scene.js',
    'src/Engine/Material.js',
    'src/Engine/Lights/Light.js',
    'src/Engine/Lights/LightSet.js',
    'src/Engine/Utils/Transform.js',
    'src/Engine/Utils/BoundingBox.js',
    'src/Engine/Utils/Interpolate.js',
    'src/Engine/Utils/InterpolateVec2.js',
    'src/Engine/Utils/ShakePosition.js',
    'src/Engine/Utils/CollisionInfo.js',
    'src/Engine/Renderables/Renderable.js',
    'src/Engine/Renderables/TextureRenderable.js',
    'src/Engine/Renderables/TextureRenderable_PixelCollision.js',
    'src/Engine/Renderables/SpriteRenderable.js',
    'src/Engine/Renderables/SpriteRenderable_PixelCollision.js',
    "src/Engine/Renderables/SpriteAnimateRenderable.js",
    "src/Engine/Renderables/FontRenderable.js",
    "src/Engine/Renderables/LineRenderable.js",
    "src/Engine/Renderables/LightRenderable.js",
    "src/Engine/Renderables/IllumRenderable.js",
    "src/Engine/Renderables/ParticleRenderable.js",
    "src/Engine/Shadows/ShadowCaster.js",
    "src/Engine/Shadows/ShadowReceiver.js",
    "src/Engine/Shadows/ShadowReceiver_Stencil.js",
    "src/Engine/GameObjects/GameObject.js",
    "src/Engine/GameObjects/GameObject_PixelCollision.js",
    "src/Engine/GameObjects/GameObjectSet.js",
    "src/Engine/GameObjects/TiledGameObject.js",
    "src/Engine/GameObjects/ParallaxGameObject.js",
    "src/Engine/Particles/Particle.js",
    "src/Engine/Particles/ParticleGameObject.js",
    "src/Engine/Particles/ParticleGameObjectSet.js",
    "src/Engine/Particles/ParticleEmitter.js",
    "src/Engine/Physics/RigidShape.js",
    "src/Engine/Physics/RigidShape_Collision.js",
    "src/Engine/Physics/RigidShapeBehavior.js",
    "src/Engine/Physics/RigidCircle.js",
    "src/Engine/Physics/RigidCircle_Collision.js",
    "src/Engine/Physics/RigidRectangle.js",
    "src/Engine/Physics/RigidRectangle_Collision.js",
    "src/Engine/Shaders/SimpleShader.js",
    "src/Engine/Shaders/TextureShader.js",
    "src/Engine/Shaders/SpriteShader.js",
    "src/Engine/Shaders/LineShader.js",
    "src/Engine/Shaders/LightShader.js",
    "src/Engine/Shaders/ShaderLightAtIndex.js",
    "src/Engine/Shaders/IllumShader.js",
    "src/Engine/Shaders/ShaderMaterial.js",
    "src/Engine/Shaders/ShadowCasterShader.js",
    "src/Engine/Cameras/Camera.js",
    "src/Engine/Cameras/Camera_Manipulation.js",
    "src/Engine/Cameras/Camera_Input.js",
    "src/Engine/Cameras/Camera_Xform.js",
    "src/Engine/Cameras/CameraState.js",
    "src/Engine/Cameras/CameraShake.js"
    ])
    .pipe(concat('gameEngine.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});