/**
 * Created by Administrator on 2018/6/26.
 */
$(function () {
  //全局变量
  var currentpage = 1;
  var pageSize = 5

  var currentId;
  var isDelete;
  //1.渲染页面
  render()
  function render() {
    $.ajax({
      type: 'get',
      data: {
        page: currentpage,
        pageSize: pageSize
      },
      url: '/user/queryUser',
      dataType: 'json',
      success: function (info) {
        console.log(info);
        var temp = template('tmp', info);
        $('tbody').html(temp);


        //2.分页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            console.log(page);
            currentpage = page;
            render();
          }
        })
      }
    })
  }

  //3.禁用和启用按钮弹出模块框
  //事件委托
  $('tbody').on("click", '.btn', function () {
    $("#userModal").modal("show");
    currentId = $(this).parent().data("id");
    //console.log(userId);
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  })
  //点击确认讲id 和 isDelect 发送给后台
  $('.submitBtn').click(function () {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        $("#userModal").modal("hide");
        render();
      }
    })
  })
})