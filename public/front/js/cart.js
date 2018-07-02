/**
 * Created by Administrator on 2018/7/2.
 */
$(function () {

  render()
  function render() {

    $.ajax({
      type: "get",
      url: "/cart/queryCart",
      dataType: "json",
      success: function (info) {
        //console.log(info);
        var htmlStr = template('tpl', {info: info});
        $(".lt_cart").html(htmlStr);
      }
    })
  }

  //删除购物车功能  根据id
  $('.lt_cart').on('click', '.btn-delete', function () {

    var id = $(this).data('id')
    //console.log(id);
    $.ajax({
      type: "get",
      data: {
        id: id
      },
      url: "/cart/deleteCart",
      dataType: "json",
      success: function (info) {
        //console.log(info);
        render()
      }
    })
  })

  //编辑功能
  $('.lt_cart').on("click", ".btn-edit", function () {
    var data = this.dataset;
    //console.log(data);

    var html = template("modelTpl", data);

    html = html.replace(/\n/g, '');
    mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
      if (e.index === 0) {
        var id = data.id;
        var num = $(".mui-numbox-input").val();
        var size = $(".lt_edit_size span.now").text();
        $.ajax({
          type: "post",
          data: {
            id: id,
            num: num,
            size: size
          },
          url: "/cart/updateCart",
          dataType: "",
          success: function (info) {
            render()
          }
        })


      }
    })

    //加类名
    $(".lt_edit_size span").on("tap", function () {
      $(this).addClass("now").siblings().removeClass("now");
    });

    //数量按钮
    mui(".mui-numbox").numbox();
  })


})
