import { Component } from '@angular/core';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as Hammer from 'hammerjs';
// import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import { HostListener } from '@angular/core';



@Component({
  selector: 'app-cornerstone-viewer',
  templateUrl: './cornerstone-viewer.component.html',
  styleUrls: ['./cornerstone-viewer.component.scss']
})

export class CornerstoneViewerComponent {
  private image: any;
  private element: any;
  private imageIds = [
    'wadouri:http://10.0.0.50:8000/sample_samsung.dcm',
    'wadouri:http://10.0.0.50:8000/IM-0001-0014.dcm',
    'wadouri:http://10.0.0.50:8000/IM-0001-0012.dcm',
    'wadouri:http://10.0.0.50:8000/IM-0001-0013.dcm',
  ];
  maxStackIndex: number = 0; // Set this value based on the number of images in the stack
  currentStackIndex: number = 0;
  stack = {
    currentImageIdIndex: 0,
    imageIds: this.imageIds,
  };
  private images = [];
  private isFirstImageLoaded = false;
  // WwwcTool = cornerstoneTools.WwwcTool;

  // const WwwcTool = cornerstoneTools.WwwcTool;
  constructor() {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstone.registerImageLoader('dicomweb', cornerstoneWADOImageLoader.wadouri.loadImage);
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = Hammer;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // this.updateImageSize();
  }

  onSliderChange(event: any) {
    this.image = this.images[this.currentStackIndex];
    const viewport = cornerstone.getDefaultViewportForImage(this.element, this.images[this.currentStackIndex]);
    cornerstone.displayImage(this.element, this.images[this.currentStackIndex], viewport);
    // this.updateImageSize();
    // console.log(cornerstoneTools.scrollToIndex(this.element, 1));

    // console.log(this.currentStackIndex);
    // console.log(this.stack.currentImageIdIndex);
    // this.stack.currentImageIdIndex = this.currentStackIndex;
    // console.log(cornerstoneTools);
    // Change the image in the stack here...
  }

  ngAfterViewInit() {

    cornerstoneTools.init({
      globalToolSyncEnabled: true,
      showSVGCursors: true,
    });

    cornerstoneTools.enableLogger(
      'cornerstoneTools:*,-cornerstoneTools:eventListeners:*'
    );

    localStorage.setItem("debug", "cornerstoneTools")
    // console.log(cornerstoneTools);

    const element = document.getElementById('dicomImage');
    this.element = element;


    cornerstone.enable(element);
    this.imageIds.forEach((imageId, index) => {
      cornerstone.loadImage(imageId).then((image) => {
        // Display the image

        this.images.push(image);
        if (this.isFirstImageLoaded) {
          return;
        }
        const viewport = cornerstone.getDefaultViewportForImage(element, this.images[0]);
        cornerstone.displayImage(element, this.images[0], viewport);
        this.isFirstImageLoaded = true;

      });
    });




    const LengthTool = cornerstoneTools.LengthTool;
    const WwwcTool = cornerstoneTools.WwwcTool;
    const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
    const PanMultiTouchTool = cornerstoneTools.PanMultiTouchTool;
    const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
    // const StackScrollTool = cornerstoneTools.StackScrollTool;

    cornerstoneTools.addTool(WwwcTool);
    cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
    cornerstoneTools.addTool(ZoomTouchPinchTool);
    cornerstoneTools.setToolActive('ZoomTouchPinch', { touchEnabled: true });
    cornerstoneTools.addTool(PanMultiTouchTool);
    cornerstoneTools.setToolActive('PanMultiTouch', { touchEnabled: true });


    var myElement = document.getElementById('dicomImage');

    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // listen to events...
    mc.on("doubletap", (ev) => {
      console.log(ev.type + " gesture detected.");
      // cornerstoneTools.playClip(this.element);

      this.reset();
    });

    cornerstoneTools.addStackStateManager(element, ['stack']);
    cornerstoneTools.addToolState(element, 'stack', this.stack);
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
    cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 1 });
    // cornerstoneTools.addTool(StackScrollTool);
    // cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
    // console.log(cornerstoneTools);

    // cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
    // cornerstone.enable(element1);

    // cornerstoneTools.init({
    //   /**
    //    * When cornerstone elements are enabled,
    //    * should `mouse` input events be listened for?
    //    */
    //   mouseEnabled: true,
    //   /**
    //    * When cornerstone elements are enabled,
    //    * should `touch` input events be listened for?
    //    */
    //   touchEnabled: true,
    //   /**
    //    * A special flag that synchronizes newly enabled cornerstone elements. When
    //    * enabled, their active tools are set to reflect tools that have been
    //    * activated with `setToolActive`.
    //    */
    //   globalToolSyncEnabled: true,
    //   /**
    //    * Most tools have an associated canvas or SVG cursor. Enabling this flag
    //    * causes the cursor to be shown when the tool is active, bound to left
    //    * click, and the user is hovering the enabledElement.
    //    */
    //   showSVGCursors: true,

    // });


    // // Set the tool width
    // cornerstoneTools.toolStyle.setToolWidth(5);

    // // Set color for inactive tools
    // cornerstoneTools.toolColors.setToolColor('rgb(255, 0, 0)');

    // // Set color for active tools
    // cornerstoneTools.toolColors.setActiveColor('rgb(0, 0, 255)');

    // // this.enablePanMultiTouch();
    // // this.enableWindowLevel();
    // this.enableLength();
    // this.enableLength();
    // this.enableLength();

    // // const WwwcTool = cornerstoneTools.WwwcTool;
    // // // const element = document.getElementById('dicomImage');
    // // cornerstoneTools.addTool(WwwcTool);
    // // cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });

    // // cornerstoneTools.addToolForElement(element1, WwwcTool);
    // // cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
    // // Add the image to the images array

    // const element = document.getElementById('dicomImage');
    // this.element = element;
    // cornerstone.enable(element);


    // const imageId = 'wadouri:http://10.0.0.50:8000/IM-0001-0014.dcm';


    // cornerstoneTools.init({
    //   /**
    //    * When cornerstone elements are enabled,
    //    * should `mouse` input events be listened for?
    //    */
    //   mouseEnabled: true,
    //   /**
    //    * When cornerstone elements are enabled,
    //    * should `touch` input events be listened for?
    //    */
    //   // touchEnabled: true,
    //   /**
    //    * A special flag that synchronizes newly enabled cornerstone elements. When
    //    * enabled, their active tools are set to reflect tools that have been
    //    * activated with `setToolActive`.
    //    */
    //   // globalToolSyncEnabled: true,
    //   /**
    //    * Most tools have an associated canvas or SVG cursor. Enabling this flag
    //    * causes the cursor to be shown when the tool is active, bound to left
    //    * click, and the user is hovering the enabledElement.
    //    */
    //   showSVGCursors: true,

    // });



    // cornerstoneTools.enableLogger(
    //   'cornerstoneTools:*,-cornerstoneTools:eventListeners:*'
    // );
    // localStorage.setItem("debug", "cornerstoneTools")

    // this.imageIds.forEach((imageId, index) => {

    // });
    // cornerstone.resize(element1, true);
    // cornerstone.loadImage(imageId).then((image: any) => {
    //   this.image = image;

    //   // cornerstoneTools.init({
    //   //   /**
    //   //    * When cornerstone elements are enabled,
    //   //    * should `mouse` input events be listened for?
    //   //    */
    //   //   mouseEnabled: true,
    //   //   /**
    //   //    * When cornerstone elements are enabled,
    //   //    * should `touch` input events be listened for?
    //   //    */
    //   //   touchEnabled: true,
    //   //   /**
    //   //    * A special flag that synchronizes newly enabled cornerstone elements. When
    //   //    * enabled, their active tools are set to reflect tools that have been
    //   //    * activated with `setToolActive`.
    //   //    */
    //   //   globalToolSyncEnabled: false,
    //   //   /**
    //   //    * Most tools have an associated canvas or SVG cursor. Enabling this flag
    //   //    * causes the cursor to be shown when the tool is active, bound to left
    //   //    * click, and the user is hovering the enabledElement.
    //   //    */
    //   //   showSVGCursors: true,
    //   // });
    //   // const viewport = cornerstone.getDefaultViewportForImage(element1, this.image);
    //   // cornerstone.displayImage(element1, this.image, viewport);






    //   // var myElement = document.getElementById('dicomImage');

    //   // create a simple instance
    //   // by default, it only adds horizontal recognizers
    //   // var mc = new Hammer(myElement);

    //   // // listen to events...
    //   // mc.on("tap press", (ev) => {
    //   //   console.log(ev.type + " gesture detected.");
    //   //   this.enableWindowLevel();
    //   // });

    //   // setTimeout(() => {
    //   //   console.log('here');
    //   //   const WwwcTool = cornerstoneTools.WwwcTool;
    //   //   // const element = document.getElementById('dicomImage');
    //   //   cornerstoneTools.addToolForElement(element1, WwwcTool);
    //   //   cornerstoneTools.setToolActive('Wwwc', { isTouchActive: true, mouseButtonMask: 1 });
    //   // }, 3000);
    // });



    // console.log(cornerstoneTools);
    // this.enableWindowLevel();
    // this.enableZoomTouchPinch();
    // this.enablePanMultiTouch();
    // this.enabledStack();

    // var myElement = document.getElementById('dicomImage');

    // // create a simple instance
    // // by default, it only adds horizontal recognizers


    // cornerstoneTools.addStackStateManager(element1, ['stack']);
    // cornerstoneTools.addToolState(element1, 'stack', this.stack);



    // Enable the scroll tool



    // const WwwcTool = cornerstoneTools.WwwcTool;
    // const element = document.getElementById('dicomImage');
    // cornerstoneTools.addToolForElement(element, WwwcTool);
    // cornerstoneTools.setToolActive('Wwwc', { isTouchActive: true, mouseButtonMask: 1 });















    // cornerstoneTools.mouseInput.enable(element);
    // cornerstoneTools.mouseWheelInput.enable(element);
    // cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
    // cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
    // cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
    // cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

    // cornerstoneTools.touchInput.enable(element);
    // cornerstoneTools.panTouchDrag.activate(element);
    // cornerstoneTools.zoomTouchPinch.activate(element);

    // Enable any elements, and display images
    // ...

    // Add our tool, and set it's mode

    // console.log(cornerstoneTools.);

    // cornerstoneTools.setToolActive(ArrowAnnotateTool.name);



    // console.log(cornerstoneTools);
    // cornerstoneTools.init(
    //   {
    //     mouseEnabled: true,
    //     //   /**
    //     //    * When cornerstone elements are enabled,
    //     //    * should `touch` input events be listened for?
    //     //    */
    //     //   touchEnabled: true,
    //     //   /**
    //     //    * A special flag that synchronizes newly enabled cornerstone elements. When
    //     //    * enabled, their active tools are set to reflect tools that have been
    //     //    * activated with `setToolActive`.
    //     //    */
    //     // globalToolSyncEnabled: true,
    //     //   /**
    //     //    * Most tools have an associated canvas or SVG cursor. Enabling this flag
    //     //    * causes the cursor to be shown when the tool is active, bound to left
    //     //    * click, and the user is hovering the enabledElement.
    //     //    */
    //     showSVGCursors: true,
    //   }
    // );

    // Set the tool width
    // cornerstoneTools.toolStyle.setToolWidth(2);

    // // Set color for inactive tools
    // cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');

    // // Set color for active tools
    // cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

    // const ZoomTool = cornerstoneTools.ZoomTool;
    // const PanTool = cornerstoneTools.PanTool;
    // const WwwcTool = cornerstoneTools.WwwcTool;
    // const MagnifyTool = cornerstoneTools.MagnifyTool;
    // const StackScrollTool = cornerstoneTools.StackScrollTool;
    // const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
    // const StackScrollMultiTouchTool = cornerstoneTools.StackScrollMultiTouchTool;
    // const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
    // const PanMultiTouchTool = cornerstoneTools.PanMultiTouchTool;
    // const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    // const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
    // const AngleTool = cornerstoneTools.AngleTool;
    // const LengthTool = cornerstoneTools.LengthTool;

    // cornerstoneTools.addTool(LengthTool);
    // cornerstoneTools.addTool(ZoomTool);
    // cornerstoneTools.addTool(PanTool);
    // cornerstoneTools.addTool(WwwcTool);
    // cornerstoneTools.addTool(MagnifyTool);
    // cornerstoneTools.addTool(StackScrollTool);
    // cornerstoneTools.addTool(StackScrollMouseWheelTool);
    // cornerstoneTools.addTool(StackScrollMultiTouchTool);
    // cornerstoneTools.addTool(ZoomTouchPinchTool);
    // cornerstoneTools.addTool(PanMultiTouchTool);
    // cornerstoneTools.addTool(EllipticalRoiTool);
    // cornerstoneTools.addTool(RectangleRoiTool);
    // cornerstoneTools.addTool(AngleTool);


    // // cornerstoneTools.setToolActive(PanTool.name, { mouseButtonMask: 1 }, ['Mouse']);
    // // cornerstoneTools.setToolActive(ZoomTool.name, { mouseButtonMask: 2 }, ['Mouse']);
    // // const element1 = document.querySelector('#dicomImage');

    // cornerstoneTools.setToolActive(element, AngleTool.name);
  }

  // enabledStack() {
  //   const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
  //   const element = document.getElementById('dicomImage');
  //   cornerstoneTools.addToolForElement(element, StackScrollMouseWheelTool);
  //   cornerstoneTools.setToolActive('StackScrollMouseWheel');
  // }

  // enableWindowLevel() {
  //   const WwwcTool = cornerstoneTools.WwwcTool;
  //   const element = document.getElementById('dicomImage');
  //   cornerstoneTools.addToolForElement(element, WwwcTool);
  //   cornerstoneTools.setToolActiveForElement(
  //     element,
  //     "Wwwc",
  //     { mouseButtonMask: 1 },
  //     ['Mouse']
  //   );
  // }

  // enableLength() {
  //   const LengthTool = cornerstoneTools.LengthTool;
  //   const element = document.getElementById('dicomImage');
  //   cornerstoneTools.addToolForElement(element, LengthTool);

  //   cornerstoneTools.setToolActiveForElement(element, 'Length', { mouseButtonMask: 1 });
  // }

  // enableZoomTouchPinch() {
  //   const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
  //   const element = document.getElementById('dicomImage');
  //   cornerstoneTools.addToolForElement(element, ZoomTouchPinchTool);

  //   cornerstoneTools.setToolActive('ZoomTouchPinch', { isTouchActive: true });
  // }
  // enablePanMultiTouch() {
  //   const PanMultiTouchTool = cornerstoneTools.PanMultiTouchTool;
  //   const element = document.getElementById('dicomImage');
  //   cornerstoneTools.addTool(PanMultiTouchTool);

  //   cornerstoneTools.setToolActive('PanMultiTouch', { isTouchActive: true });
  // }

  reset() {
    const element = document.getElementById('dicomImage');
    cornerstone.reset(element);
  }


  updateImageSize() {
    if (this.image) {

      const viewport = cornerstone.getDefaultViewportForImage(this.element, this.image);
      //this.imageIds.forEach((imageId, index) => {
      //  cornerstone.loadImage(imageId).then((image) => {
      // Display the image

      cornerstone.displayImage(this.element, this.image, viewport);
      cornerstone.resize(this.element, true);

      // });
      //});

    }
  }
}
