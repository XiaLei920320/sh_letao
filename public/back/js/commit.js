/**
 * Created by Administrator on 2018/6/25.
 */

$(function () {
  //6验证是否登录过
  if (location.href.indexOf("login.html") === -1) {
    $.ajax({
      type: 'get',
      url: '/employee/checkRootLogin',
      dataType: 'json',
      success: function (info) {
        if (info.error == 400) {
          location.href = "login.html"
        }
      }
    })
  }


  //5.进度条
  $(document).ajaxStart(function () {
    NProgress.start();
  })
  setInterval(function () {
    $(document).ajaxStop(function () {
      NProgress.done();
    })
  }, 5000)

  //1.左侧隐藏
  $(".lt_topbar .icon_menu").click(function () {
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
  })
  //2 二级菜单显示
  $(".category").click(function () {
    $(".child").stop().slideToggle()
  })

  //3 模态框显示
  $(".icon_logout").click(function () {
    $("#logoutModal").modal("show")
    //4.隐藏模态框 点击模态框中的退出按钮, 需要进行退出操作(ajax)
    $(".logoutBtn").click(function () {
      $.ajax({
        type: "get",
        dataType: "json",
        url: "/employee/employeeLogout",
        success: function (info) {
          if (info.success) {
            // 跳转到登录
            location.href = "login.html";
          }
        }
      })
    })
    
    
  })


})