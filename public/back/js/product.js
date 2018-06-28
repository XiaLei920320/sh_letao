/**
 * Created by Administrator on 2018/6/28.
 */
$(function () {
  //全局变量
  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];
  //1.通过ajax 发送请求 获取数据 渲染页面
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        //console.log(info);
        var htmlStr = template("proTmp", info);
        $("tbody").html(htmlStr)
        //分页
        $("#pagintor").bootstrapPaginator({
          //版本号
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          itemTexts: function (type, page, current) {
            //console.log(type);
            switch (type) {
              case "page" :
                return page;
              case "first" :
                return "首页";
              case "prev" :
                return "上一页";
              case "next" :
                return "下一页";
              case "last" :
                return "尾页";
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往" + page + "页";
            }
          },
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  //显示模态框
  $("#addBtn").click(function () {
    $("#addModal").modal("show");
    //渲染下拉框
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        //console.log(info);
        var htmlStr = template("tpl", info);
        $(".dropdown-menu").html(htmlStr)
      }
    })
  })
  //下拉框注册事件委托 给a 注册点击事件
  $(".dropdown-menu").on("click","a",function () {
    var  txt = $(this).text();
    $("#dropdownTxt").text(txt);
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
    $("#form").data("bootstrapValidator").updateStatus('brandId',"VALID")
  })
  //上传图片回调函数
  $("#fileupload").fileupload ({
    dataType:"json",
    done:function (e,data) {
      //console.log(data);
      var picurl = data.result
      picArr.unshift(picurl);
      var picAddr = picurl.picAddr;
      console.log(picAddr);
      $("#imgBox").prepend('<img src=" '+ picAddr+' " width="100" height="100" >');
      //数组大于三删除最后一个 并以最后的图片
      if(picArr.length> 3){
        picArr.pop();
        $("#imgBox img:last-of-type").remove();
      }//!!!
      if(picArr.length===3){
        $("#form").data("bootstrapValidator").updateStatus("picStatu","VALID")
      }
    }
  })
  //阻止默认提交,使用ajax提交
  $("#form").on("success.form.bv",function (e) {
    e.preventDefault();
    var  formData= $('#form').serialize();
    formData+="&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
    formData+="&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
    formData+="&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;
    $.ajax({
      type:"post",
      url:"/product/addProduct",
      dataType:"json",
      data: formData,
      success:function (info) {
        console.log(info);
        if(info.success){}
        //模态框关闭
        $("#addModal").modal("hide");
        //渲染当前页
        currentPage = 1;
        render();
        $("#form").data("bootstrapValidator").resetForm(true);
        $("#dropdownTxt").text("请选择二级分类");
        $("#imgBox img").remove();
        picArr = [];
      }
    })
  })
//点击取消 重置表单
  $(".cancel").click(function () {
    $("#form").data("bootstrapValidator").resetForm(true);
    $("#dropdownTxt").text("请选择二级分类");
    $("#imgBox img").remove();
    picArr = [];
  })
$(".close").click(function () {
  $("#form").data("bootstrapValidator").resetForm(true);
  $("#dropdownTxt").text("请选择二级分类");
  $("#imgBox img").remove();
  picArr = [];
})
  //表单校验
  $("#form").bootstrapValidator({
    //隐藏域初始化
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    //设置检查规则
    fields: {
      //1.brandId
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      //2.brandName
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      //3.proDesc
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      //4.num
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp :{
            regexp:/^[1-9]\d*$/,
            message:"商品库存格式, 必须是非零开头的数字"
          }
        }
      },
      //5.size
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp :{
            regexp:/^\d{2}-\d{2}$/,
            message:'尺码格式, 必须是 32-40'

          }
        }
      },
      //6.oldPrice
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      //7
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      //8.picStatu
      picStatu: {
        validators: {
          notEmpty: {
            message: "请输入三张照片"
          }
        }
      }
    }
  })
})