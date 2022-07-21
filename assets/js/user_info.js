$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: [/^[\S]{1,6}$/, '昵称必须1到6位,且不能出现空格'],
    email: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      '邮箱不符合规范',
    ],
  });
  initUserInfo();
  // 获取用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败');
        }
        // console.log(res);
        form.val('formUserInfo', res.data);
      },
    });
  }
  // 表单的重置效果
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 表单的提交
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('更新用户信息失败!');
        layer.msg(res.message);
        //   调用父页面中的方法 重新渲染
        window.parent.getUserinfo();
      },
    });
  });
});
