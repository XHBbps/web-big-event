$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();
  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败');
        }
        //   渲染表格
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      },
    });
  }
  //  添加类别按钮的点击事件
  // 定义弹出层
  let indexAdd = null;
  $('#addCat').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });
  //  通过代理的形式 为dialog 表单绑定submit事件
  $('body').on('submit', '#dialog', function (e) {
    e.preventDefault();
    // console.log('ok');
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $('#dialog').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加失败');
        }
        layer.msg('添加成功');
        initArtCateList();
        layer.close(indexAdd);
      },
    });
  });
  // 编辑按钮的点击事件
  // 定义编辑按钮的弹出层
  let editIndexAdd = null;
  $('tbody').on('click', '#btn-edit', function (e) {
    editIndexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '编辑',
      content: $('#dialog-edit').html(),
    });
    let id = $(this).attr('data-id');
    // console.log(id);
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res);
        form.val('form-edit', res.data);
      },
    });
  });
  // 编辑按钮弹出层里的提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    // console.log('ok');
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改失败');
        }
        layer.msg('修改成功');
        initArtCateList();
        layer.close(editIndexAdd);
      },
    });
  });
  //  删除事件
  $('body').on('click', '#btn-del', function (e) {
    let id = $(this).attr('data-id');
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败');
          }
          layer.msg('删除成功');
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
