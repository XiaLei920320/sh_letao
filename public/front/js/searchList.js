$(function () {
  var key = getSearch("key")
  //console.log(key);
  $('.search-input').val(key);
  render();
  //渲染页面
  function render() {
    //加载效果
    $('.lt_product').html('<div class="loading"></div>');
    var params = {};
    params.proName = $('.search-input').val();
    params.page = 1;
    params.pageSize = 100;
    var $current = $('.lt_sort .current');
    if ($current.length > 0) {
      var sortName = $current.data("type");  // 排序名称
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      params[sortName] = sortValue;
    }

    //模拟网络延迟
    setTimeout(function () {
      $.ajax({
        url: "/product/queryProduct",
        type: "get",
        data: params,
        dataType: "json",
        success: function (info) {
          //console.log(info);
          var htmlSrt = template("tpl", info);
          $(".lt_product").html(htmlSrt);
        }
      })
    },500)
  }
//点击搜索 1.渲染并判断  2加入历史记录
  $(".search-button").click(function () {
    var key = $('.search-input').val();
    if (key.trim() === "") {
      mui.toast("请输入搜索关键字");
      return;
    }
    render();
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);
    //不重复
    var index = arr.indexOf(key);
    if (index > -1) {
      arr.splice(index, 1);
    }
    if (arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem("search_list", JSON.stringify(arr));
    $('.search_input').val("");
  })


  $('.lt_sort a[data-type]').click(function () {
    if ($(this).hasClass("current")) {
      // 同时切换两个类名
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      // 添加 并移除
      $(this).addClass("current").siblings().removeClass("current");
    }
    // 调用 render 进行重新渲染
    render();
  })


  //在inpu
  $(".search-input").keydown(function (e) {//当按下按键时
    if (e.which == 13) {//.which属性判断按下的是哪个键，回车键的键位序号为13
      $('.search-button').trigger("click");//触发搜索按钮的点击事件
    }
  });


})

