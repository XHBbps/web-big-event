$(function () {
  // 点击去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  // 点击去登陆账号的链接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  // 从layui获取form对象
  var form = layui.form;
  var layer = layui.layer;
  // 通过form.verify() 来自定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) {
        return '两次密码不一致';
      }
    },
  });

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // console.log('触发了');
    e.preventDefault();
    let data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val(),
    };
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功,请登录!');
      $('#link_login').click();
    });
  });

  // 监听登陆表单的提交事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/login',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('登陆成功!');
        // 将token字符串保存到localStorage
        localStorage.setItem('token', res.token);
        location.href = '/index.html';
      },
    });
  });
});
