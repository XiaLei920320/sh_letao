/**
 * Created by Administrator on 2018/6/29.
 */


$(function () {

  // 渲染一级分类
    $.ajax({
    url:"/category/queryTopCategory",
    type:"get",
    dataType:"json",
    success: function (info) {
      //console.log(info);
    var htmlStr= template("tpl",info);
    $(".lt_category_left ul").html(htmlStr)

      renderById(info.rows[0].id)
    }
  })

  //渲染二集分类
    function renderById(id) {
      $.ajax({
        url:"/category/querySecondCategory",
        type:"get",
        data:{id:id},
        dataType:"json",
        success: function (info) {
          console.log(info);
          var htmlStr= template("tpm",info);
          $(".lt_category_right ul").html(htmlStr)
        }
      })


    }

  //点击事件
  $(".lt_category_left ul").on ("click","a",function () {
    var id = $(this).data("id");
    renderById( id );
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");


  })




    
})