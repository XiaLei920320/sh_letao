/**
 * Created by Administrator on 2018/7/2.
 */
$(function () {

  var productId = getSearch("productId")
  render()
  function render() {
    $.ajax({
      type: "get",
      dataType: "json",
      data: {
        id: productId
      },
      url: "/product/queryProductDetail",
      success: function (info) {
        console.log(info);
        var htmlStr = template("protpl", info);
        $('.mui-scroll').html(htmlStr)
        //开启轮播图
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
          interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
        });

        //开启数量按钮
        mui('.mui-numbox').numbox();
      }
    })
  }

  //选择尺码
  $('.mui-scroll').on('click', '.lt_size span', function () {
    $(this).addClass('current').siblings().removeClass('current');
  })

//去购物车 1 如果登录了就去购物车 ,没有登录去登录页
  $('.gocart').click(function () {
    $.ajax({
      type: "get",
      url: "/cart/queryCart",
      dataType: "json",
      success: function (info) {
        console.log(info);
        if(info.error==400){
          location.href = "login.html"
        }

      }
    })
  })

  //添加购物车
  $('.add-cart').click(function () {
    //获取尺寸 数量 发送 ajax
    var size = $('.lt_size span.current').text();
    if (!size) {
      mui.toast("请选择尺码");
      return false
    }
    var num = $(".mui-numbox-input").val();

    $.ajax({
      type: "post",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      url: "/cart/addCart",
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
            if (e.index == 0) {
              location.href = "cart.html"
            }
            if (e.index == 1) {
              render()
            }
          })
        }

        if (info.error == 400) {
          location.href = "login.html?retUrl=" + location.href;
        }


      }
    })

  })


})