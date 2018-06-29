/**
 * Created by Administrator on 2018/6/29.
 */
  //var arr = [ "耐克", "阿迪", "阿迪王", "耐克王" ];
  //var str = JSON.stringify( arr );
  //localStorage.setItem( "search_list", str );


$(function () {
  //1获取历史记录 渲染到页面
  function getHistory() {
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);

    return arr;
  }

  render();
  function render() {
    var arr = getHistory();
    console.log(arr);
    var htmlStr = template("tpl", {arr: arr});
    $('.lt_history').html(htmlStr);
  }

  //清空历史记录
  $(".lt_history").on("click",'.icon_clear',function () {

    mui.confirm("是否清空全部历史记录?","温馨提示",
    ["取消","确认"],function (e) {
       if(e.index===1){
         localStorage.removeItem("search_list");
         render();
       }
    })
  })

  //点击删除功能删除该条记录
  $(".lt_history").on("click",".btn_delete",function () {
    var that = this;

    mui.confirm("是否删除该条记录","温馨提示",["取消","确认"],function (e) {
        if (e.index===1){
          var index = $(that).data("index");
          var arr = getHistory();
          arr.splice(index,1);
          localStorage.setItem( "search_list", JSON.stringify( arr ) );
          // 重新渲染
          render();
        }
    })

    //添加搜索功能

    $(".search-button").click(function () {
      var key = $(".search-input").val();
      if(key===""){
        mui.toast("亲输入关键字");
        return;
      }

      var arr = getHistory();
      var index = arr.indexOf(key);
      if(index>-1){
        arr.pop();
      }

      arr.unshift(key);
      localStorage.setItem("search_list",JSON.stringify(arr));
      render();
      $(".search-input").val("");

      location.href="searchList.html?key="+key;



    })



  })




})


