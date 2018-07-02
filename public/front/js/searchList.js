$(function () {
  //全局变量
  var courentPage = 1;
  var pageSize=4;


  var key = getSearch("key")
  //console.log(key);
  $('.search-input').val(key);
  //render();
  //渲染页面
  function render(callback ) {
    //加载效果
    //$('.lt_product').html('<div class="loading"></div>');

    //数据对象
    var params = {};
    params.proName = $('.search-input').val();
    params.page = courentPage;
    params.pageSize = pageSize;
    var $current = $('.lt_sort .current');
    if ($current.length > 0) {
      var sortName = $current.data("type");  // 排序名称
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      params[sortName] = sortValue;
    }

    //模拟网络延迟 ajax 请求
    setTimeout(function () {
      $.ajax({
        url: "/product/queryProduct",
        type: "get",
        data: params,
        dataType: "json",
        success: function (info) {
          //console.log(info);
          //var htmlSrt = template("tpl", info);
          //$(".lt_product").html(htmlSrt);
          callback && callback(info);
        }
      })
    },500)
  }


  //下拉刷新和上拉加载效果
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，


      down : {
        auto:true,  //一进入页面自动下拉刷新一次
        callback :function (){
          courentPage = 1 ;
          render(function (info) {
            var htmlSrt = template("tpl", info);
            $(".lt_product").html(htmlSrt);
            //数据回来需要关闭刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          })

        }
      },

      up:{
        callback:function () {
          console.log(122);
          courentPage ++;
          render(function(info){

            //追加数据完毕后关闭
            if(info.data.length ===0){
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
            }else {
              var htmlSrt = template("tpl", info);
              $(".lt_product").append(htmlSrt);
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }




          })


        }


      }

    }
  });


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





  //在inpu按回车键
  $(".search-input").keydown(function (e) {//当按下按键时
    if (e.which == 13) {//.which属性判断按下的是哪个键，回车键的键位序号为13
      $('.search-button').trigger("click");//触发搜索按钮的点击事件
    }
  });


})

