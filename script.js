const content = document.getElementById("doc-content")
const nav = document.getElementById("sidebar-nav")
const search = document.getElementById("search")

const langLabel = document.getElementById("lang-label")
const langSwitch = document.getElementById("lang-switch")

const state = {
  lang: "en",
  page: "",
  pages: [],
  metaCache: new Map()
}

/* ---------------- LANG ---------------- */

const translations = {
  en: {
    copy: "Copy",
    copied: "Copied",
    search: "Search..."
  },
  ru: {
    copy: "Копировать",
    copied: "Скопировано",
    search: "Поиск..."
  }
}

const detectLang = () =>
  navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en"

const getLang = () =>
  localStorage.getItem("lang") || detectLang()

function setLang(lang) {
  state.lang = lang
  localStorage.setItem("lang", lang)

  const t = translations[lang]

  langLabel.textContent = lang.toUpperCase()
  search.placeholder = t.search
}

/* ---------------- DATA ---------------- */

async function loadMarkdown(page, lang) {
  try {
    let r = await fetch(`docs/${page}.${lang}.md`)
    if (!r.ok) r = await fetch(`docs/${page}.en.md`)
    return await r.text()
  } catch {
    return "# 404\nNot found"
  }
}

async function getMeta(id) {
  if (state.metaCache.has(id)) return state.metaCache.get(id)

  const md = await loadMarkdown(id, state.lang)

  const meta = {
    id,
    title: md.match(/^# (.+)$/m)?.[1] || id,
    icon: `icons/${id}.png`
  }

  state.metaCache.set(id, meta)
  return meta
}

async function loadPages() {
  const res = await fetch("docs/blocks.txt")
  const ids = (await res.text())
    .split("\n")
    .map(x => x.trim())
    .filter(Boolean)

  state.pages = await Promise.all(ids.map(getMeta))
}

/* ---------------- NAV ---------------- */

function renderNav(filter = "") {
  nav.innerHTML = ""

  const q = filter.toLowerCase()

  const filtered = state.pages.filter(p =>
    p.id.toLowerCase().includes(q) ||
    p.title.toLowerCase().includes(q)
  )

  const frag = document.createDocumentFragment()

  filtered.forEach(page => {
    const btn = document.createElement("button")

    btn.className = "nav-item"
    btn.dataset.page = page.id
    btn.innerHTML = `
      <img src="${page.icon}">
      <span>${page.title}</span>
    `

    btn.onclick = () => {
      if (state.page === page.id) return
      location.hash = page.id
    }

    frag.appendChild(btn)
  })

  nav.appendChild(frag)
  updateNav()
}

function updateNav() {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === state.page)
  })
}

/* ---------------- RENDER ---------------- */

async function render() {
  if (!state.pages.length) return

  state.page = location.hash.slice(1) || state.pages[0].id

  history.replaceState(null, "", `#${state.page}`)

  const md = await loadMarkdown(state.page, state.lang)

  content.innerHTML = marked.parse(md)

  Prism.highlightAll()
  addCopyButtons()

  updateNav()

  window.scrollTo({ top: 0, behavior: "smooth" })
}

/* ---------------- COPY ---------------- */

function addCopyButtons() {
  document.querySelectorAll("pre").forEach(pre => {
    if (pre.querySelector(".copy-btn")) return

    const btn = document.createElement("button")
    btn.className = "copy-btn"
    btn.textContent = translations[state.lang].copy

    btn.onclick = async () => {
      const code = pre.querySelector("code")?.innerText || ""
      await navigator.clipboard.writeText(code)

      btn.textContent = translations[state.lang].copied
      setTimeout(() => btn.textContent = translations[state.lang].copy, 1200)
    }

    pre.appendChild(btn)
  })
}

/* ---------------- EVENTS ---------------- */

langSwitch.onclick = async () => {
  setLang(state.lang === "en" ? "ru" : "en")

  state.metaCache.clear()

  await loadPages()
  renderNav(search.value)
  render()
}

search.oninput = () => renderNav(search.value)

window.addEventListener("hashchange", render)

/* ---------------- INIT ---------------- */

async function init() {
  setLang(getLang())

  await loadPages()

  renderNav()
  render()

  state.page = location.hash.slice(1) || state.pages[0].id
  history.replaceState(null, "", `#${state.page}`)
}

init()