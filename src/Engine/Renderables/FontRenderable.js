/*
 * File: FontRenderable.js
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, SpriteRenderable: false */

"use strict";
/**
* @class
* @params{string} aString - String to render in the game.
* @classdesc gets the default font, creates a new SpriteRenderable and a new Transform.
*/
function FontRenderable(aString) {
    this.mFont = gEngine.DefaultResources.getDefaultFont();
    this.mOneChar = new SpriteRenderable(this.mFont + ".png");
    this.mXform = new Transform(); // transform that moves this object around
    this.mText = aString;
}

/** @function Parses and draws each character in string via the mOneChar variable */
FontRenderable.prototype.draw = function(vpMatrix){
	var widthOfOneChar = this.mXform.getWidth() / this.mText.length;
	var heightOfOneChar = this.mXform.getHeight();
	var yPos = this.mXform.getYPos();

	// center position of first char
	var xPos = this.mXform() - (widthOfOneChar / 2) + (widthOfOneChar * 0.5);
	var charIndex, aChar, charInfo, xSize, ySize, xOffset, yOffset;
	for(charIndex = 0; charIndex < this.mText.length; charIndex++){
		aChar = this.mText.charCodeAt(charIndex);
		charInfo = gEngine.Fonts.getCharInfo(this.mFont, aChar);

		// set the texture coordinate
		this.mOneChar.setElementUVCoordinate(charInfo.mTexCoordLeft, charInfo.mTextCoordRight,
			charInfo.mTexCoordBottom, charInfo.mTexCoord);

		// now the size of the char
		xSize = widthOfOneChar * charInfo.mCharWidth;
		ySize = heightOfOneChar * charInfo.mCharHeight;
		this.mOneChar.getXform().setSize(xSize, ySize);

		// how much to offset from the center
		xOffset = widthOfOneChar * charInfo.mCharWidthOffset * 0.5;
		yOffset = heightOfOneChar * charInfo.mCharHeightOffset * 0.5;

		this.mOneChar.getXform().setPosition(xPos - xOffset, yPos - yOffset);

        this.mOneChar.draw(vpMatrix);

        xPos += widthOfOneChar;
	}
};

FontRenderable.prototype.getXform = function() { return this.mXform; };
FontRenderable.prototype.getText = function() { return this.mText; };
FontRenderable.prototype.setText = function(t) {
    this.mText = t;
    this.setTextHeight(this.getXform().getHeight());
};

FontRenderable.prototype.getFont = function() { return this.mFont; };
FontRenderable.prototype.setFont = function(f) {
    this.mFont = f;
    this.mOneChar.setTexture(this.mFont + ".png");
};

FontRenderable.prototype.setColor = function(c){ this.mOneChar.setColor(c); };
FontRenderable.prototype.getColor = function() {
    return this.mOneChar.getColor();
};

/** @function This is setting the size of the Font, which is different than the xForm size.
* Think word doc font size vs distoring image of text.
* The width of the entire message to be drawn is automatically computed based on
* the message string length and maintaining the character width to height aspect ratio.
*/
FontRenderable.prototype.setTextHeight = function(h){
	// this is for "A"
	var charInfo = gEngine.Fonts.getCharInfo(this.mFont, "A".charCodeAt(0));
	var w = h * charInfo.mCharAspectRatio;
	this.getXform().setSize(w * this.mText.length, h);
};