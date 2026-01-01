// 点击特效
function clickEffect() {
  let hearts = [];
  let pool = [];
  let trails = [];
  let trailPool = [];
  let lastClick = 0;
  let running = false;
  let rafId = null;
  const MAX_HEARTS = 80;
  const HEARTS_PER_CLICK = 4;
  const CLICK_THROTTLE_MS = 180;
  window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        setTimeout(callback, 1000 / 60);
      };
  })();
  init();

  function init() {
    css(".heart{width:10px;height:10px;position:fixed;left:0;top:0;background:#f00;transform:translate3d(0,0,0) rotate(45deg);-webkit-transform:translate3d(0,0,0) rotate(45deg);-moz-transform:translate3d(0,0,0) rotate(45deg);will-change:transform,opacity;pointer-events:none;z-index:99999}.heart:after,.heart:before{content:'';width:inherit;height:inherit;background:inherit;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;position:fixed}.heart:after{top:-5px}.heart:before{left:-5px}");
    css(".heart-trail{width:8px;height:8px;position:fixed;left:0;top:0;border-radius:50%;pointer-events:none;z-index:99998;filter:blur(2px);will-change:transform,opacity}");
    attachEvent();
  }

  function step() {
    for (var i = 0; i < hearts.length; i++) {
      if (hearts[i].alpha <= 0) {
        hearts[i].el.remove();
        pool.push(hearts[i].el);
        hearts.splice(i, 1);
        continue;
      }
      hearts[i].x += hearts[i].vx;
      hearts[i].y += hearts[i].vy;
      hearts[i].vx *= 0.985;
      hearts[i].vy += 0.06;
      hearts[i].rot += hearts[i].spin;
      hearts[i].scale *= 0.985;
      hearts[i].alpha -= 0.012;
      hearts[i].el.style.opacity = hearts[i].alpha;
      hearts[i].el.style.transform = "translate3d(" + hearts[i].x + "px," + hearts[i].y + "px,0) scale(" + hearts[i].scale + "," + hearts[i].scale + ") rotate(" + (45 + hearts[i].rot) + "deg)";
      hearts[i].el.style.boxShadow = "0 0 " + (8 * hearts[i].alpha) + "px " + hearts[i].color;
      if (Math.random() < 0.4) createTrail(hearts[i]);
    }
    for (var j = 0; j < trails.length; j++) {
      var t = trails[j];
      if (t.alpha <= 0) {
        t.el.remove();
        trailPool.push(t.el);
        trails.splice(j, 1);
        j--;
        continue;
      }
      t.scale *= 0.96;
      t.alpha -= 0.04;
      t.el.style.opacity = t.alpha;
      t.el.style.transform = "translate3d(" + t.x + "px," + t.y + "px,0) scale(" + t.scale + "," + t.scale + ")";
      t.el.style.background = t.color;
      t.el.style.boxShadow = "0 0 " + (6 * t.alpha) + "px " + t.color;
    }
    if (hearts.length) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      rafId = null;
    }
  }

  function startLoop() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }

  function attachEvent() {
    document.addEventListener("click", function(event) {
      if (shouldIgnore(event)) return;
      createHeart(event);
    }, true);
  }

  function shouldIgnore(event) {
    const t = event.target;
    if (!t) return false;
    return !!t.closest("a, button, input, textarea, select, .copycode, #card-toggle-btn, #dark-toggle-btn, .code-toolbar, .icon-link, #menu");
  }

  function createHeart(event) {
    var now = Date.now();
    if (now - lastClick < CLICK_THROTTLE_MS) return;
    lastClick = now;

    var count = HEARTS_PER_CLICK;
    if (hearts.length > MAX_HEARTS * 0.6) count = Math.ceil(HEARTS_PER_CLICK / 2);
    if (hearts.length > MAX_HEARTS * 0.9) count = Math.max(4, Math.ceil(HEARTS_PER_CLICK / 4));

    var frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        var d = pool.length ? pool.pop() : document.createElement("div");
        if (!d.className) d.className = "heart";

        var angle = Math.random() * Math.PI * 2;
        var velocity = 2 + Math.random() * 3;
        var color = randomColor();

        d.style.background = color;
        d.style.opacity = "1";
        d.style.transform = "translate3d(" + (event.clientX - 5) + "px," + (event.clientY - 5) + "px,0) scale(1,1) rotate(45deg)";

        var h = {
          el: d,
          x: event.clientX - 5,
          y: event.clientY - 5,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          scale: 1 + Math.random() * 0.3,
          alpha: 1,
          rot: Math.random() * 180,
          spin: (Math.random() * 4 - 2),
          color: color
        };

        if (hearts.length >= MAX_HEARTS) {
          hearts.shift().el.remove();
        }
        hearts.push(h);
        frag.appendChild(d);
    }
    document.body.appendChild(frag);
    startLoop();
  }

  function createTrail(h) {
    var d = trailPool.length ? trailPool.pop() : document.createElement("div");
    if (!d.className) d.className = "heart-trail";
    d.style.opacity = "0.6";
    d.style.background = h.color;
    d.style.transform = "translate3d(" + h.x + "px," + h.y + "px,0) scale(" + (h.scale * 0.6) + "," + (h.scale * 0.6) + ")";
    var t = {
      el: d,
      x: h.x,
      y: h.y,
      scale: h.scale * 0.6,
      alpha: 0.6,
      color: h.color
    };
    trails.push(t);
    document.body.appendChild(d);
  }

  function css(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
      style.appendChild(document.createTextNode(css));
    } catch (ex) {
      style.styleSheet.cssText = css;
    }
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  function randomColor() {
    // 使用 HSL 颜色空间生成高饱和度、高亮度的颜色
    // 色相：0-360 随机
    // 饱和度：80%-100% 随机
    // 亮度：50%-70% 随机
    return "hsl(" + (~~(Math.random() * 360)) + ", " + (80 + ~~(Math.random() * 20)) + "%, " + (50 + ~~(Math.random() * 20)) + "%)";
  }
}

document.addEventListener('DOMContentLoaded', clickEffect);
