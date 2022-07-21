$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    password: [/^[\S]{6,12}$/, '密码长度应为6到12位,且不包含空格'],
    newpwd: function (value) {
      if (value === $('.layui-form [name=oldPwd]').val()) {
        return '新旧密码不能一致';
      }
    },
    repwd: function (value) {
      let pwd = $('.layui-form [name=newPwd]').val();
      if (pwd !== value) {
        return '两次密码不一致';
      }
    },
  });
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新密码失败');
        }
        layer.msg('更新密码成功');
        //重置表单 先用[0] 转为原生
        $('.layui-form')[0].reset();
      },
    });
  });
});
