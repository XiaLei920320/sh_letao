
$(function () {
  $('.btn_login').click(function () {
    //获取用户名和密码
    var username = $('[name="username"]').val()
    var password = $('[name="password"]').val()
  //非空校验
    if(!username.trim()){
      mui.toast("请输入用户名");
      return false;
    }
    if(!password){
      mui.toast("请输入密码");
      return false;
    }

    $.ajax({
      type:"post",
      data:{
        username:username,
        password:password
      },
      url:"/user/login",
      dataType:"json",
      success:function (info) {
        console.log(info);
          if (info.error === 403) {
            mui.toast(data.message);
          }
        if(info.success){
          var search = location.search;
          if (search.indexOf("retUrl") != -1) {
            //说明需要回跳
            search = search.replace("?retUrl=", "");
            location.href = search;
          } else {
            //跳转到会员中心
            location.href = "user.html";
          }
        }
      }
    })
  })
  //重置
  $(".btn_reset").click(function () {
    $('[name="username"]').val('')
    $('[name="password"]').val('')
  })

})