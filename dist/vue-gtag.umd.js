(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueGtag = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var noop = function noop() {};
  function loadScript(url, domain) {
    return new Promise(function (resolve, reject) {
      var head = document.head || document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.async = true;
      script.src = url;
      script.charset = "utf-8";

      if (domain) {
        var link = document.createElement("link");
        link.href = domain;
        link.rel = "preconnect";
        head.appendChild(link);
      }

      head.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
    });
  }
  function warn(msg, err) {
    console.warn("[vue-gtag] " + msg);

    if (err && err.stack) {
      console.warn(err.stack);
    }
  }
  function isFn(item) {
    return typeof item === "function";
  }
  function isObject(item) {
    return item && _typeof(item) === "object" && !Array.isArray(item);
  }
  function mergeDeep(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (!sources.length) {
      return target;
    }

    var source = sources.shift();

    if (!isObject(target) || !isObject(source)) {
      return;
    }

    for (var key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, _defineProperty({}, key, {}));
        }

        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, _defineProperty({}, key, source[key]));
      }
    }

    return mergeDeep.apply(void 0, [target].concat(sources));
  }

  function query () {
    var _window;

    var _getOptions = getOptions(),
        globalObjectName = _getOptions.globalObjectName;

    if (typeof window === "undefined") {
      return;
    }

    (_window = window)[globalObjectName].apply(_window, arguments);
  }

  var config = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _getOptions = getOptions(),
        config = _getOptions.config,
        includes = _getOptions.includes;

    query.apply(void 0, ["config", config.id].concat(args));

    if (Array.isArray(includes)) {
      includes.forEach(function (domain) {
        query.apply(void 0, ["config", domain.id].concat(args));
      });
    }
  });

  var event = (function (name) {
    var _params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _getOptions = getOptions(),
        defaultGroupName = _getOptions.defaultGroupName,
        includes = _getOptions.includes;

    var params = _params;

    if (includes && params.send_to == null) {
      params.send_to = includes.map(function (include) {
        return include.id;
      }).concat(defaultGroupName);
    }

    query("event", name, params);
  });

  var pageview = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var arg = args[0];
    var params = {};

    if (typeof arg === "string") {
      params = {
        page_path: arg,
        page_location: window.location.href
      };
    } else {
      params = arg;
    }

    event("page_view", params);
  });

  var screenview = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    event.apply(void 0, ["screen_view"].concat(args));
  });

  var customMap = (function (map) {
    config({
      custom_map: map
    });
  });

  var time = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    event.apply(void 0, ["timing_complete"].concat(args));
  });

  var exception = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    event.apply(void 0, ["exception"].concat(args));
  });

  var linker = (function (params) {
    config("linker", params);
  });

  var purchase = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    event.apply(void 0, ["purchase"].concat(args));
  });

  var refund = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    event.apply(void 0, ["refund"].concat(args));
  });

  var set = (function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    query.apply(void 0, ["set"].concat(args));
  });

  var disable = (function () {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var _getOptions = getOptions(),
        includes = _getOptions.includes,
        config = _getOptions.config;

    window["ga-disable-".concat(config.id)] = value;

    if (Array.isArray(includes)) {
      includes.forEach(function (domain) {
        window["ga-disable-".concat(domain.id)] = value;
      });
    }
  });

  var optIn = (function () {
    disable(false);
  });

  var optOut = (function () {
    disable(true);
  });

  var api = {
    query: query,
    config: config,
    event: event,
    pageview: pageview,
    screenview: screenview,
    customMap: customMap,
    time: time,
    exception: exception,
    linker: linker,
    purchase: purchase,
    refund: refund,
    set: set,
    optIn: optIn,
    optOut: optOut
  };

  var extend = (function () {
    var Vue = getVue();
    Vue.$gtag = Vue.prototype.$gtag = api;
  });

  var trackPage = function trackPage(to, from) {
    if (to.path === from.path) {
      return;
    }

    var _getOptions = getOptions(),
        pageTrackerTemplate = _getOptions.pageTrackerTemplate,
        pageTrackerScreenviewEnabled = _getOptions.pageTrackerScreenviewEnabled,
        appName = _getOptions.appName;

    var template;
    var customTemplate = pageTrackerTemplate(to, from);

    if (customTemplate) {
      template = customTemplate;
    } else if (pageTrackerScreenviewEnabled) {
      template = {
        app_name: appName,
        screen_name: to.name
      };
    } else {
      template = {
        page_title: to.name,
        page_path: to.path,
        page_location: window.location.href
      };
    }

    if (pageTrackerScreenviewEnabled && !template.app_name) {
      warn("To use the screenview, add the appName to the plugin options");
      return;
    }

    if (pageTrackerScreenviewEnabled && !template.screen_name) {
      warn("To use the screenview, name your routes");
      return;
    }

    if (pageTrackerScreenviewEnabled) {
      screenview(template);
      return;
    }

    pageview(template);
  };
  var init = function init(Router) {
    var Vue = getVue();

    var _getOptions2 = getOptions(),
        onBeforeTrack = _getOptions2.onBeforeTrack,
        onAfterTrack = _getOptions2.onAfterTrack;
    /* istanbul ignore next */


    Router.onReady(function () {
      Router.afterEach(function (to, from) {
        Vue.nextTick().then(function () {
          onBeforeTrack(to, from);
          trackPage(to, from);
          onAfterTrack(to, from);
        });
      });
    });
  };
  var pageTracker = (function () {
    var Router = getRouter();

    if (!Router) {
      return;
    }

    init(Router);
  });

  function _bootstrap () {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    var _getOptions = getOptions(),
        enabled = _getOptions.enabled,
        globalObjectName = _getOptions.globalObjectName,
        globalDataLayerName = _getOptions.globalDataLayerName,
        _getOptions$config = _getOptions.config,
        id = _getOptions$config.id,
        params = _getOptions$config.params,
        includes = _getOptions.includes,
        pageTrackerEnabled = _getOptions.pageTrackerEnabled,
        onReady = _getOptions.onReady,
        disableScriptLoad = _getOptions.disableScriptLoad;

    if (!enabled) {
      optOut();
    }

    if (window[globalObjectName] == null) {
      window[globalDataLayerName] = [];

      window[globalObjectName] = function () {
        window[globalDataLayerName].push(arguments);
      };
    }

    window[globalObjectName]("js", new Date());

    if (params) {
      window[globalObjectName]("config", id, params);
    } else {
      window[globalObjectName]("config", id);
    }

    if (Array.isArray(includes)) {
      includes.forEach(function (domain) {
        if (domain.params) {
          window[globalObjectName]("config", domain.id, domain.params);
        } else {
          window[globalObjectName]("config", domain.id);
        }
      });
    }

    if (pageTrackerEnabled) {
      pageTracker();
    }

    if (disableScriptLoad) {
      return;
    }

    var domain = "https://www.googletagmanager.com";
    var resource = "".concat(domain, "/gtag/js?id=").concat(id, "&l=").concat(globalDataLayerName);
    return loadScript(resource, domain).then(function () {
      var library = window[globalObjectName];

      if (isFn(onReady)) {
        onReady(library);
      }

      return library;
    }).catch(function (error) {
      warn("Ops! Something happened and gtag.js couldn't be loaded", error);
      return error;
    });
  }

  var Vue;
  var Router;
  var options = {
    pageTrackerTemplate: noop,
    onBeforeTrack: noop,
    onAfterTrack: noop,
    onReady: noop,
    enabled: true,
    disableScriptLoad: false,
    bootstrap: true,
    globalObjectName: "gtag",
    globalDataLayerName: "dataLayer",
    pageTrackerEnabled: true,
    pageTrackerScreenviewEnabled: false,
    defaultGroupName: "default",
    includes: null,
    config: null
  };
  var getOptions = function getOptions() {
    return options;
  };
  var setOptions = function setOptions(_options) {
    return mergeDeep(options, _options);
  };
  var getVue = function getVue() {
    return Vue;
  };
  var getRouter = function getRouter() {
    return Router;
  };
  function install(_Vue) {
    var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _Router = arguments.length > 2 ? arguments[2] : undefined;

    Vue = _Vue;
    Router = _Router;
    setOptions(_options);
    extend();

    if (!options.bootstrap) {
      return;
    }

    _bootstrap();
  }

  var bootstrap = _bootstrap;
  var setOptions$1 = setOptions; // export api for usages outside Vuejs context

  var query$1 = api.query;
  var config$1 = api.config;
  var event$1 = api.event;
  var pageview$1 = api.pageview;
  var screenview$1 = api.screenview;
  var customMap$1 = api.customMap;
  var time$1 = api.time;
  var exception$1 = api.exception;
  var linker$1 = api.linker;
  var purchase$1 = api.purchase;
  var set$1 = api.set;
  var optIn$1 = api.optIn;
  var optOut$1 = api.optOut;

  exports.bootstrap = bootstrap;
  exports.config = config$1;
  exports.customMap = customMap$1;
  exports.default = install;
  exports.event = event$1;
  exports.exception = exception$1;
  exports.install = install;
  exports.linker = linker$1;
  exports.optIn = optIn$1;
  exports.optOut = optOut$1;
  exports.pageview = pageview$1;
  exports.purchase = purchase$1;
  exports.query = query$1;
  exports.screenview = screenview$1;
  exports.set = set$1;
  exports.setOptions = setOptions$1;
  exports.time = time$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
