$(function () {
  var layer = layui.layer;
  var form = layui.form;
  // 初始化富文本编辑器
  initEditor();
  // 1. 初始化图片裁剪器
  var $image = $('#image');

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  // 隐藏原来的选择文件表单
  $('#file').hide();
  //  选择封面按钮触发文件表单点击事件
  $('.choosePic').on('click', function () {
    $('#file').click();
  });
  // 监听文件选择框的change事件
  $('#file').on('change', function (e) {
    //  获取用户选择的文件
    var filelist = e.target.files;
    // console.log(filelist);
    if (filelist.length === 0) {
      return layer.msg('请选择照片');
    }
    //   拿到图片
    var file = e.target.files[0];
    //   创建一个对应的URL地址
    var newImgURL = URL.createObjectURL(file);
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 渲染
  initCate();
  // 获取文章分类的数据
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败');
        }
        // console.log(res);
        var htmlStr = template('cate-select', res);
        $('[name=cate_id]').html(htmlStr);
        form.render();
      },
    });
  }

  // 定义文章的状态
  let art_state = '已经发布';
  //  给存草稿绑定点击事件
  $('#btnSave').on('click', function () {
    art_state = '草稿';
  });
  $('#btnSup').on('click', function () {
    art_state = '已发布';
  });
  // 为表单绑定submit事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    //  创建FormData对象
    var fd = new FormData($(this)[0]);
    console.log($(this)[0]);
    // 将文章的存储状态保存到fd中
    fd.append('state', art_state);
    //   将裁剪过的图片输出为文件
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 将文件对象存到fd中
        fd.append('cover_img', blob);
        // console.log(blob);
        //   发起ajax请求
        publishArticle(fd);
      });
    /* fd.forEach(function (item, index) {
      console.log(item, index);
    }); */
  });

  // 定义一个发布文章的函数
  function publishArticle(Fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: Fd,
      //  注意: 如果提交的格式为FormData
      //  则必须添加配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('发布失败');
        }
        layer.msg('发表成功');
        location.href = '/article/art_list.html';
      },
    });
  }
  // 用文章旧数据渲染页面
  if (id) {
    $.ajax({
      method: 'GET',
      url: `/my/article/${id}`,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.msg);
        }
        layui.form.val('formPublish', res.data);
        $image
          .cropper('destroy')
          .attr('src', 'http://127.0.0.1:5500' + res.data.cover_img)
          .cropper(options);
      },
    });
  }
});
