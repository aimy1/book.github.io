mixins.home = {
    mounted() {
        let background = this.$refs.homeBackground;
        background.style.backgroundImage = "none";
        background.style.backgroundColor = "transparent";
        this.menuColor = true;
    },
    methods: {
        homeClick() {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        },
    },
};
