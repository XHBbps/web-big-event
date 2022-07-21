$(function () {
  // 调用 getUserinfo 获取用户信息
  getUserinfo();
  // 退出请求
  var layer = layui.layer;
  $('#quit').on('click', function () {
    // console.log('ok');
    layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
      // 1. 清空本地存储中的 token
      localStorage.removeItem('token');
      // 2. 跳转到登陆界面
      location.href = '/login.html';
      //  关闭confirm询问框
      layer.close(index);
    });
  });
});

// 获取用户信息
function getUserinfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 请求头配置对象
    /*  headers: {
      Authorization: localStorage.getItem('token') || '',
    }, */
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败');
      // 调用renderAvatar 渲染用户头像
      renderAvatar(res.data);
    },
  });
}
// 渲染头像区域
function renderAvatar(user) {
  if (user.user_pic) {
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    $('.layui-nav-img').hide();
    if (user.nickname) {
      $('.text-avatar').html(`${user.nickname[0].toUpperCase()}`).show();
    } else {
      $('.text-avatar').html(`${user.username[0].toUpperCase()}`).show();
    }
  }

  if (user.nickname) {
    $('#welcome').html(`欢迎 ${user.nickname}`);
  } else {
    $('#welcome').html(`欢迎 ${user.username}`);
  }
}
