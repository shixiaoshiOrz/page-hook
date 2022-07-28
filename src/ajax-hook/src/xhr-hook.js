/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 */

// Save original XMLHttpRequest as _rxhr
var realXhr = "__xhr-gcshi"

export var events = ['load', 'loadend', 'timeout', 'error', 'readystatechange', 'abort'];

export function configEvent(event, xhrProxy) {
  var e = {};
  for (var attr in event) e[attr] = event[attr];
  // xhrProxy instead
  e.target = e.currentTarget = xhrProxy
  return e;
}

export function hook(proxy, win) {
  
  win = win || window;
  // 备份原生XMLHttpRequest构造函数，避免出现双份hook
  win[realXhr] = win[realXhr] || win.XMLHttpRequest
  //修改原生XMLHttpRequest方法
  win.XMLHttpRequest = function () {

    // 不直接代理XMLHttpRequest，因为我们不知道有多少属性，我们直接代理它的对象
    var xhr = new win[realXhr];
    
    //如果存在__xhr属性，返回原生对象  兼容处理
    if(unsafeWindow.__xhr) return xhr

    // 将所有不可枚举属性全部重写，变成可枚举属性
    for (var i = 0; i < events.length; ++i) {
      var key='on'+events[i];
      if (xhr[key] === undefined) {
        // console.log(key);
        xhr[key] = null
      };
    }

    for (var attr in xhr) {
      // console.log(attr,xhr[attr]);
      var type = "";
      try {
        type = typeof xhr[attr] // May cause exception on some browser
      } catch (e) {
      }
      if (type === "function") {
        // 原生方法代理   此时，实例xhr对象上已经增加了所有xhr对象的函数
        this[attr] = hookFunction(attr);

        // 原生属性代理
      } else {
        Object.defineProperty(this, attr, {
          get: getterFactory(attr),
          set: setterFactory(attr),
          enumerable: true
        })
      }
    }
    var that = this;
    //原生xhr对象扩展了一个`getProxy()`方法，调用它可以获取代理xhr对象
    xhr.getProxy = function () {
      return that
    }
    //实例xhr对象上绑定一个xhr原生对象
    this.xhr = xhr;
  }
  // let a = new win.XMLHttpRequest
  // console.log('win.XMLHttpRequest(): ', a);

  // Object.assign(win.XMLHttpRequest, {UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4});

  // Generate getter for attributes of xhr
  function getterFactory(attr) {
    return function () {
      var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
      var attrGetterHook = (proxy[attr] || {})["getter"]
      return attrGetterHook && attrGetterHook(v, this) || v
    }
  }

  // Generate setter for attributes of xhr; by this we have an opportunity
  // to hookAjax event callbacks （eg: `onload`） of xhr;
  function setterFactory(attr) {
    return function (v) {
      var xhr = this.xhr;
      var that = this;
      var hook = proxy[attr];
      // hookAjax  event callbacks such as `onload`、`onreadystatechange`...
      if (attr.substring(0, 2) === 'on') {
        that[attr + "_"] = v;
        xhr[attr] = function (e) {
          e = configEvent(e, that)
          var ret = proxy[attr] && proxy[attr].call(that, xhr, e)
          ret || v.call(that, e);
        }
      } else {
        //If the attribute isn't writable, generate proxy attribute
        var attrSetterHook = (hook || {})["setter"];
        v = attrSetterHook && attrSetterHook(v, that) || v
        this[attr + "_"] = v;
        try {
          // Not all attributes of xhr are writable(setter may undefined).
          xhr[attr] = v;
        } catch (e) {
        }
      }
    }
  }

  // xhr对象的代理函数
  function hookFunction(fun) {
    return function () {
      //效果同  [...arguments]
      var args = [].slice.call(arguments)
      //如果自定义的代理函数存在
      if (proxy[fun]) {
        // console.log("-----------",this);
        var ret = proxy[fun].call(this, args, this.xhr)
        // If the proxy return value exists, return it directly,
        // otherwise call the function of xhr.
        if (ret) return ret;
      }
      return this.xhr[fun].apply(this.xhr, args);
    }
  }

  // Return the real XMLHttpRequest
  return win[realXhr];
}

export function unHook(win) {
  win = win || window
  if (win[realXhr]) win.XMLHttpRequest = win[realXhr];
  win[realXhr] = undefined;
}


