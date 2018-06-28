/**
 * Created by Administrator on 2018/6/26.
 */
$(function () {
  var courrentPage = 1;
  var pagesize = 2;

  //进入页面执行ajax获取数据 通过模板
  rander()
  function rander() {

    $.ajax({
      type: "get",
      data: {
        page: courrentPage,
        pageSize: pagesize
      },
      url: "/category/querySecondCategoryPaging",
      dataType: "json",
      success: function (info) {
        //console.log(info);
        var tmp = template("tmp", info)
        $("tbody").html(tmp);
        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            courrentPage = page;
            rander();
          }
        })

      }
    })
  }

  //点击按钮显示模态
  $("#addBtn").click(function () {
    $("#addModal").modal("show");
    //渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 50
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var tpl = template("tpl", info);
        $(".dropdown-menu").html(tpl)
      }
    })
  })
  //点击下拉菜单下的li 事件委托
  $(".dropdown-menu").on("click", 'a', function () {
    //给下拉框动态设置文本
    var txt = $(this).text();
    $("#dropdownTxt").text(txt);
    //记录当前选择的id
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);

    //重置
    $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID")
  })


  //上传图片
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data.result.picAddr);
      var url = data.result.picAddr;
      $("#imgBox img").attr("src", url);
      //将地址给隐藏域
      $('[name="brandLogo"]').val(url);

      //重置
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  console.log(1)
  //表单验证
  $("#form").bootstrapValidator({
    //清除默认

    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //设置字段
    fields: {
      //id name 图片
      categoryId: {
        validators: {
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      },

      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });

  //阻止submit 提交


  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();
    //发送ajax请求
    $.ajax({
      type: "post",
      data: $("#form").serialize(),
      url: "/category/addSecondCategory",
      dataType: "json",
      success: function (info) {
        console.log(info);
      if(info.success){
        $('#addModal').modal("hide");
        courrentPage= 1;
        rander()

        $('#form').data("bootstrapValidator").resetForm(true);
        $('#dropdownTxt').text("请选择一级分类");
        $('#imgBox img').attr("src", "images/none.png");

      }
      }
    })
  })





})