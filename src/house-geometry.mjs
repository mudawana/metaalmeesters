// Dimensions in metres. Door values are the visitor's opening measurements.
// This calculation is shared by the Three.js house and the automated tests.
export function getHouseGeometry(widthMm=900,heightMm=2200) {
  const requestedWidth=Number(widthMm),requestedHeight=Number(heightMm);
  const width=Number.isFinite(requestedWidth)?Math.max(.5,Math.min(8,requestedWidth/1000)):.9;
  const height=Number.isFinite(requestedHeight)?Math.max(1.4,Math.min(4.5,requestedHeight/1000)):2.2;
  // A small installation gap between the design and the 3D architectural reveal.
  const openingWidth=width+.04;
  const openingHeight=height+.025;
  const wallWidth=Math.max(7.3,openingWidth+4.9);
  const wallHeight=Math.max(5.05,openingHeight+2.25);
  const wingWidth=(wallWidth-openingWidth)/2;
  const upperWindowHeight=.92;
  const upperWindowCenter=openingHeight+1.02;
  return {
    width,height,openingWidth,openingHeight,wallWidth,wallHeight,wingWidth,
    upperWindowHeight,upperWindowCenter,
    doorFrameClearanceX:(openingWidth-width)/2,
    doorFrameClearanceY:openingHeight-height
  };
}
