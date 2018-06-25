/**
 * Created by Administrator on 2018/6/25.
 */
//登录验证
/*
 * 1. 进行表单校验配置
 *    校验要求:
 *        (1) 用户名不能为空, 长度为2-6位
 *        (2) 密码不能为空, 长度为6-12位
 * */
$(function () {
  $("#form").bootstrapValidator({
    //图标配置
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //校验用户名
    fields: {
      //用户名
      username: {
        validators:{
          notEmpty:{
            message:"用户名不能为空!"
          },
          stringLength: {
            min:2,
            max:6,
            message:"用户名为2-6个字!"
          },

          callback : {
            message:"用户名不存在!"
          }
        }
      },
      //密码校验
      password:{
        validators:{
          notEmpty:{
            message:"密码不能为空!"
          },
          stringLength: {
            min:6,
            max:12,
            message:"密码为2-6个字!"
          },

          callback:{
            message: "密码错误!"
          }
        }
      }
    }
  })
})


/*
 * 2.需要注册表单验证成功事件,在成功事件内,阻止默认表单提交,通过ajax进行提交
 *
 */
$("#form").on('success.form.bv', function (e) {
  e.preventDefault(); //阻止请求

  $.ajax({
    type:"post",
    url:"/employee/employeeLogin",
    data:$("#form").serialize(),
    dataType:"json",
    success : function (info) {
      console.log(info);
      if(info.success){
        //密码正确的时候跳转
        location.href="index.html";
      }
      if(info.error===1000){
        //用户名不存在
        $('#form').data('bootstrapValidator').updateStatus('username',"INVALID", "callback")
      }
      if(info.error === 1001){
        //密码错误
        $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback')
      }
    }
  })
})

// 3. 重置功能实现
$('[type="reset"]').on('click',function () {

$('#form').data('bootstrapValidator').resetForm(true);

})
