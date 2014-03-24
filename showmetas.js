function($){
	$._sm_findButNotInside = function(selector) {
		return $(document)._sm_findButNotInside(selector)
	}

  $.fn._sm_findButNotInside = function(selector) {
      var origElement = $(this);
      return origElement.find(selector).filter(function() {
          var nearestMatch = $(this).parent().closest(selector);
          return nearestMatch.length == 0 || origElement.find(nearestMatch).length == 0;
      });
  };

  items = $._sm_findButNotInside("[itemscope]")

  items.each(function(i, item_tag){
  	item = {type: $(item_tag).attr("itemtype")}
  	$(item_tag)._sm_findButNotInside("[itemprop]").each(function(i, prop_tag){
  		prop_name = $(prop_tag).attr("itemprop")
  		prop_src = $(prop_tag).attr("src")
  		prop_txt = $.trim($(prop_tag).text())

  		item[prop_name] = prop_src || prop_txt
  	})
  	console.log(item)
  })
}(jQuery)
