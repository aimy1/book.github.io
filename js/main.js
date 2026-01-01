function applyDarkPref() {
    const pref = localStorage.getItem("dark-reader");
    if (pref === "on") {
        document.body.classList.add("dark-reader");
        if (window.DarkReader) {
            if (window.DarkReader.setFetchMethod && window.fetch) {
                window.DarkReader.setFetchMethod(window.fetch);
            }
            window.DarkReader.enable({
                brightness: 105,
                contrast: 100,
                sepia: 0,
            });
        }
    } else if (window.DarkReader) {
        window.DarkReader.disable();
    }
}
window.toggleDarkMode = function () {
    const enable = !document.body.classList.contains("dark-reader");
    if (window.DarkReader) {
        if (enable) {
            if (window.DarkReader.setFetchMethod && window.fetch) {
                window.DarkReader.setFetchMethod(window.fetch);
            }
            window.DarkReader.enable({
                brightness: 105,
                contrast: 100,
                sepia: 0,
            });
        } else {
            window.DarkReader.disable();
        }
    }
    document.body.classList.toggle("dark-reader");
    localStorage.setItem("dark-reader", document.body.classList.contains("dark-reader") ? "on" : "off");
};
applyDarkPref();
function throttle(fn, wait) {
    let last = 0;
    return function (e) {
        const now = Date.now();
        if (now - last < wait) return;
        last = now;
        fn.call(this, e);
    };
}
function bindUI() {
    const cardBtn = document.getElementById("card-toggle-btn");
    if (cardBtn) {
        cardBtn.addEventListener(
            "click",
            throttle(() => {
                document.body.classList.toggle("sidebar-active");
                const panel = document.getElementById("card-style");
                if (panel) panel.classList.toggle("active");
            }, 250),
            { capture: true }
        );
    }
    const darkBtn = document.getElementById("dark-toggle-btn");
    if (darkBtn) {
        darkBtn.addEventListener(
            "click",
            throttle(() => {
                if (window.toggleDarkMode) window.toggleDarkMode();
            }, 250),
            { capture: true }
        );
    }
}
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindUI, { once: true });
} else {
    bindUI();
}
const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
    },
});
app.mount("#layout");
