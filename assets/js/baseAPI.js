// 每次调用 $.get() $.post() $.ajax()的时候
// 会先调用  ajaxPrefilter   这个函数
// 在这个函数中 可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的Ajax请求前 统一拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

  // 统一为有权限的接口 设置header请求头
  if (options.url.indexOf('/my') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || '',
    };
  } else {
    // 不论成功失败都会调用complete
    options.complete = function (res) {
      // 在complete函数中 可以使用res.responseJSON拿到服务器响应的数据
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //   1. 强制清空token
        //   2. 强制跳转到登录页
        localStorage.removeItem('token');
        location.href = '/login.html';
      }
    };
  }
  // 不论成功失败都会调用complete
  options.complete = function (res) {
    // 在complete函数中 可以使用res.responseJSON拿到服务器响应的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //   1. 强制清空token
      //   2. 强制跳转到登录页
      localStorage.removeItem('token');
      location.href = '/login.html';
    }
  };
});
