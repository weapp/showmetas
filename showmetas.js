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
    var tag = $("<ul style='margin-left:.5em'>")
    
    for (attr in item){
      sub_item = item[attr]
      for (sub_attr in sub_item){

        var li = $("<li>")
        li.html($("<strong>").text(sub_attr + ":"))
        tag.append(li)

        if (typeof sub_item[sub_attr] === "object"){
          li.append(object2html(sub_item[sub_attr]))
        }else{
          li.append($("<span style='margin-left:.5em'>").text(sub_item[sub_attr]))
        }
        
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
