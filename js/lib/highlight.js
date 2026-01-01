mixins.highlight = {
data() {
return { copying: false };
},
created() {
hljs.configure({ ignoreUnescapedHTML: true });
this.renderers.push(this.highlight);
},
methods: {
sleep(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
},
highlight() {
 let codes = document.querySelectorAll("figure.highlight td.code pre");
 
 for (let pre of codes) {
  if (pre.dataset.hlProcessed === "1") continue;
 const lineNodes = pre.querySelectorAll("span.line");
 const code = lineNodes.length ? Array.from(lineNodes).map(n => n.textContent).join("\n") : pre.textContent;
  const fig = pre.closest("figure.highlight");
  const rawLanguage = (fig && Array.from(fig.classList).find((c) => c !== "highlight")) || "plaintext";
  const language = rawLanguage === "bash" ? "plaintext" : rawLanguage;
 
 let highlighted;
 try {
 highlighted = hljs.highlight(code, { language }).value;
 } catch (err) {
 console.warn(`Highlight failed for language "${language}", fallback used.`);
 highlighted = hljs.highlightAuto(code).value;
 }
 
 const languageLabel = rawLanguage === "bash" ? "" : language;
 const toolbar = languageLabel
   ? `<div class="code-toolbar"><div class="language">${languageLabel}</div><div class="copycode" title="Copy"><i class="fa-solid fa-copy fa-fw"></i><i class="fa-solid fa-check fa-fw"></i></div></div>`
   : `<div class="code-toolbar"><div class="copycode" title="Copy"><i class="fa-solid fa-copy fa-fw"></i><i class="fa-solid fa-check fa-fw"></i></div></div>`;
 pre.innerHTML = `${toolbar}<div class="code-content hljs">${highlighted}</div>`;
  pre.dataset.hlProcessed = "1";
 
 const content = pre.querySelector(".code-content");
 
 const copyBtn = pre.querySelector(".copycode");
 copyBtn.addEventListener("click", async () => {
 if (this.copying) return;
 this.copying = true;
 
 copyBtn.classList.add("copied");
 await navigator.clipboard.writeText(code);
 await this.sleep(1000);
 copyBtn.classList.remove("copied");
 
 this.copying = false;
 });
 
 if (fig) {
   const gutter = fig.querySelector("td.gutter");
   if (gutter) gutter.style.display = "none";
 }
 }
 },
 },
  };
