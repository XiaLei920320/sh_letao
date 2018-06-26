/**
 * Created by Administrator on 2018/6/26.
 */
$(function () {
  //全局变量
  var currentPage = 1;
  var pageSize = 3;


  //1 一进入页面请求ajax ，渲染页面
  rander();
  function rander() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var tmp = template("tmp", info);
        $("tbody").html(tmp);

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked(a, b, c, page){

            currentPage = page;
            rander()
          }
        })
      }
    })
  }

  $("#addBtn").click(function () {
    $("#addModal").modal("show");
  })
  // 表单验证
  $("#form").bootstrapValidator({
    //图标配置
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置字段
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入分类名"
          }
        }
      }
    }
  })


  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();

    $.ajax({
      type: "post",
      data: $("#form").serialize(),
      url: "/category/addTopCategory",
      dataType: "json",
      success: function (info) {
        //console.log(info);
        if (info.success) {
          $("#addModal").modal("hide");
          currentPage = 1;
          rander()
          $("#form").data('bootstrapValidator').resetForm(true)
        }
      }
    })
  })
})