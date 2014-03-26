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
    class_attr = arguments[1]
    class_attr = class_attr ? ' class="_sm_value_obj _sm_value_' + class_attr + '"' : ""

    var tag = $('<ul' + class_attr + '>')
    
    for (attr in item){
      sub_item = item[attr]
      for (sub_attr in sub_item){

        var li = $('<li>')
        li.html($('<strong class="_sm_field_' + sub_attr + '">').text(sub_attr + ': '))
        tag.append(li)

        if (typeof sub_item[sub_attr] === 'object'){
          li.append(object2html(sub_item[sub_attr], sub_attr))
        }else{
          li.append($('<span class="_sm_value_string _sm_value_' + sub_attr + '">').text(sub_item[sub_attr]))
        }
        
      }

    }


    return tag
  }


  showmetas_tag = $('<div class="_sm_showmetas">')

  function hereDoc(f) {
    return f.toString().
        replace(/^[^\/]+\/\*!?/, '').
        replace(/\*\/[^\/]+$/, '');
  }

  var tennysonQuote = hereDoc(function() {/*!
    ._sm_showmetas{
      background: #F0F0F0;
      color: #000;
      position:fixed;
      max-height:100%;
      width:300px;
      overflow:scroll;
      right:20px;
      word-break:break-all;
      font-size:12px;
      z-index: 9999999999999 !important;
    }

    ._sm_showmetas ._sm_block{
      border: 1px solid #DDD;
      padding: 4ex 0 2ex 0;
    }

    ._sm_showmetas ._sm_block *{
      white-space: normal;
      max-width:100%;
    }
    
    ._sm_showmetas ul{
      padding:0;
      margin:0 0 0 1em;
      list-style:none;
    }
    
    ._sm_showmetas li{
      margin:0;
      padding:0;
    }
    
    ._sm_showmetas ._sm_value_obj{
      border-left: 2px solid #DDD;
      border-bottom: 1px dotted #DDD;
      padding-bottom: .5ex;
      padding-left: .5em;
      margin-left: .5em;
    }

    ._sm_field_type{
      display:none;
    }

    ._sm_value_type{
      font-size: 13px;
      font-weight: bold;
      display:block;
      padding: 1ex 0 .5ex;
      color: #666;
    }
    

  */});

  style = $('<style>').text(tennysonQuote)
  showmetas_tag.append(style)

  items.each(function(i, item_tag){
    item = extract_info($(item_tag))
    div = $('<div class="_sm_block">')
    div.html(object2html(item))
    showmetas_tag.append(div)
  })

  $(body).first().prepend(showmetas_tag)

})(jQuery)
