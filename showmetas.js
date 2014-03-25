(function($){
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

  function extract_info(item_tag){

  	if (typeof item_tag.attr("itemscope") === "undefined"){
  		var prop_content = item_tag.attr("content")
  		var prop_src = item_tag.attr("src")
  		var prop_href = item_tag.attr("href")
  		var prop_txt = $.trim(item_tag.text())
  		return prop_content || prop_src || prop_href || prop_txt
  	}else{
	  	var item = [{type: item_tag.attr("itemtype")}]
	  	item_tag._sm_findButNotInside("[itemprop]").each(function(i, prop_tag){
	  		var prop = $(prop_tag)
	  		var prop_name = $(prop).attr("itemprop")
	  		var obj = {}
	  		obj[prop_name] = extract_info(prop)
	  		item.push(obj)
	  	})
	  	return item
  	}
  }
	
  function object2html(item){  	
  	var tag = $("<dl style='margin-left:1em'>")
  	var is_array = Array.isArray(item)
  	for (attr in item){
  		if (!is_array){tag.append($("<dt>").text(attr))}
  		if (typeof item[attr] === "object"){
	  		tag.append($("<dd style='margin-left:1em'>").html(object2html(item[attr])))
	  	}else{
	  		tag.append($("<dd style='margin-left:1em'>").text(item[attr]))
	  	}
  	}
  	return tag
  }


	showmetas_tag = $("<div style='border:1px solid #000'>")

  items.each(function(i, item_tag){
  	
  	item = extract_info($(item_tag))

  	div = $("<div style='border:1px solid #000'>")

  	div.html(object2html(item))

  	showmetas_tag.append(div)

  })

	$(body).first().prepend(showmetas_tag)

})(jQuery)
