$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());
    return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(data) {
    if (data < 10) {
      return '0' + data;
    }
    return data;
  }

  //  定义一个查询的参数对象
  let q = {
    pagenum: 1, // 默认请求第一页
    pagesize: 2, // 默认每页显示两条数据
    cate_id: '', // 文章分类的id
    state: '', // 文章的发布状态
  };
  initTable();
  // 获取文章列表数据
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败');
        }
        //   使用模板引擎渲染数据
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        // 渲染分页
        renderPage(res.total);
      },
    });
  }
  initCate();
  // 获取文章分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败');
        }
        // 使用模板引擎
        // console.log(res);
        var htmlStr = template('tpl-cate', res);
        // console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }
  // 监听筛选表单的submit事件
  $('#seek_form').on('click', function (e) {
    e.preventDefault();
    // console.log('ok');
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    q.state = state;
    q.cate_id = cate_id;
    initTable();
  });
  // 定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      elem: 'page', // 分页容器的id
      count: total, // 总数据条数
      curr: q.pagenum, // 默认被选中的分页
      limit: q.pagesize, // 每页的数据条数
      // 分页切换时 触发jump回调
      // 触发jump的方式有两种
      // 1. 点击页码会触发jump回调
      // 2. 只要调用了laypage.render方法就触发
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        q.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
        q.pagesize = obj.limit; //得到每页显示的条数
        // 直接调用会死循环
        // initTable();
        if (!first) {
          initTable();
        }
      },
      limits: [2, 3, 5, 10],
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    });
  }
  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮个数
    var len = $('.btn-delete').length;
    // console.log(len);
    let id = $(this).attr('data-id');
    // 弹出层
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败');
          }
          layer.msg('删除文章成功');
          //  当数据删除完成后 需要判断当前这页中是否还有剩余数据
          //  如果没有数据了 需要让当前页码-1 再调用initTable
          //  判断条件: 当前页面的删除按钮的个数
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });

  // 文章编辑功能 事件委托
  $('tbody').on('click', '.btn-edit', function () {
    var id = $(this).attr('data-id');
    location.href = `/article/art_upload.html?id=${id}`;
  });
});
