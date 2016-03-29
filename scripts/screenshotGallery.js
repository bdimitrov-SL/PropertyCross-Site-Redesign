var screenshotWidth, screenshotOuterWidth, screenshotMargin, screenshotContainerWidth, screenshotContainerMargin;

function toggleGalleryIndicators() {
  $('.gallery-indicators li').toggleClass('active');
  $('.gallery-indicators-mobile div').toggleClass('active');
  $('.download-btn').toggleClass('hide');
}

function scrollGallery(offset) {
 $('.screenshot-container').animate({
   scrollLeft: offset
  }, 'fast', function() {
    var visibleAndroidScreenshots = visibleScreenshots('android');
    var visibleIOSScreenshots = visibleScreenshots('ios');
    var activeIndicator = $('.gallery-indicators .active');
    
    if(activeIndicator.hasClass('android')) {
      if(visibleAndroidScreenshots < visibleIOSScreenshots) {
        toggleGalleryIndicators();
      }
    } else {
      if(visibleIOSScreenshots < visibleAndroidScreenshots) {
        toggleGalleryIndicators();
      }
    }
  });
}

function scrollToFirstScreenshot(indicatorClicked) {
  // How many pixels the container has been scrolled
  var containerScroll = $('.screenshot-container').scrollLeft();
  
  if(!indicatorClicked.hasClass('active')) {
    if(indicatorClicked.hasClass('android')) {
      $('.screenshot-container').animate({
        scrollLeft: $(".android-first").position().left - screenshotMargin - screenshotContainerMargin + containerScroll
      },'slow');
    } else {
      $('.screenshot-container').animate({
        scrollLeft: $(".ios-first").position().left - screenshotMargin - screenshotContainerMargin + containerScroll
      },'slow');
    }
  }
}

function visibleScreenshots(type) {
  return $('.screenshot-container .screenshot.' + type).filter(function() {
    // How many pixels the container has been scrolled
    var containerScroll = $('.screenshot-container').scrollLeft();
    // Position relative to the screenshot container
    var screenshotPositionLeft = $(this).position().left /*- screenshotMargin*/ - screenshotContainerMargin + containerScroll;
    var screenshotPositionRight = screenshotPositionLeft + screenshotWidth;
    
    var viewportLeftBoundary = containerScroll;
    var viewportRightBoundary = containerScroll + screenshotContainerWidth;
    
    return screenshotPositionLeft >= viewportLeftBoundary && screenshotPositionLeft < viewportRightBoundary && screenshotPositionRight > viewportLeftBoundary && screenshotPositionRight <= viewportRightBoundary;
  }).length;
}

$(document).ready(function() {
  screenshotWidth = $('.screenshot').width();
  screenshotOuterWidth = $('.screenshot').outerWidth(true);
  screenshotMargin = Number($('.screenshot').css('margin-left').split("px")[0]);
  screenshotContainerWidth = $('.screenshot-container').width();
  screenshotContainerMargin = Number($('.screenshot-container').css('margin-left').split("px")[0]);
  
  // Container width and margin changes with screen size
  $(window).resize(function() {
    screenshotContainerWidth = $('.screenshot-container').width();
    screenshotContainerMargin = Number($('.screenshot-container').css('margin-left').split("px")[0]);
  });
  
  $('.screenshot-container').scroll(function() {
    // Scroll arrows are hidden so we are on mobile screen
    if(!$('.right').is(':visible')) {
      var visibleAndroidScreenshots = visibleScreenshots('android');
      var visibleIOSScreenshots = visibleScreenshots('ios');
      var activeIndicator = $('.gallery-indicators-mobile .active');
      
      if(visibleAndroidScreenshots > visibleIOSScreenshots) {
        if(activeIndicator.hasClass('ios')) {
          toggleGalleryIndicators();
        }
      } else if(visibleIOSScreenshots > visibleAndroidScreenshots) {
        if(activeIndicator.hasClass('android')) {
          toggleGalleryIndicators();
        }
      }
    }
  });
  
  //Scroll the image gallery using the left/right buttons
  $('.right').click(function() { 
    scrollGallery('+=' + 2*screenshotOuterWidth);
  });
  
  $('.left').click(function() { 
    scrollGallery('-=' + 2*screenshotOuterWidth);
  });
  
  $('.gallery-indicators li').click(function() {
    scrollToFirstScreenshot($(this));
    
    if(!$(this).hasClass('active')) {
      toggleGalleryIndicators();
    }
  });
  
  $('.gallery-indicators-mobile div').click(function() {
    scrollToFirstScreenshot($(this));
  });
});