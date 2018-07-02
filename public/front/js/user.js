/**
 * Created by Administrator on 2018/7/2.
 */
$(function () {

  $.ajax({
    type: "GET",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function (info) {
      //console.log(info);
      var htmlStr = template('tpl', info);
      $('.mui-media').html(htmlStr);
    }
  })

  //点击退出
  $('.btn_logout').click(function () {
       $.ajax({
             type:"get",
             url:"/user/logout",
             dataType:"json",
             success:function (info) {
               //console.log(info);
              if(info.success){
                location.href = "login.html"
              }

             }
           })

  })

})

