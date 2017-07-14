# Asset not in map bug

gEngine.retrieveAsset: [undefined] not in map!

consolas-16, 24, segment-96, 32, 72  are in map

Its a texInfo thing?

Starts at 112 in myGame:
this._initText(this.mTextSysFont, 50, 60, [1, 0, 0, 1], 3);


It was an uppercase "F" in font image:
Engine_Fonts 93: gEngine.Textures.getTextureInfo(fontInfo.FontImage)