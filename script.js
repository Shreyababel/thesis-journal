function parseDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function shortDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function longDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

// Link id for an entry: its date, plus "-2", "-3"... when several entries share a date.
function entryId(index) {
  const date = ENTRIES[index].date;
  const sameDayAfter = ENTRIES.slice(index + 1).filter((e) => e.date === date).length;
  return sameDayAfter ? `${date}-${sameDayAfter + 1}` : date;
}

// Entry numbers count up from the oldest, so the newest entry has the highest number.
function entryNo(index) {
  return pad(ENTRIES.length - index);
}

// Turns nested item arrays into one flat run of bullets with a depth, so an
// entry can break between any two bullets when it spills onto the next page.
function flatten(items, depth = 0, out = []) {
  items.forEach((item) => {
    if (Array.isArray(item)) flatten(item, depth + 1, out);
    else out.push({ html: item, depth });
  });
  return out;
}

/* ---------- Pagination ---------- */

const folder = document.getElementById("folder");
const cover = document.getElementById("cover");
const leftSheet = document.getElementById("sheet-left");
const rightSheet = document.getElementById("sheet-right");
const tabsNav = document.getElementById("folder-tabs");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const counter = document.getElementById("page-counter");
const closeBtn = document.getElementById("close-file");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const narrow = window.matchMedia("(max-width: 860px)");

const PHONE_PAGE_H = 620; // keep in sync with .page height in the phone media query

let pages = []; // every page in the file, in order: { entry, el }
let entryStart = []; // spread index where each entry begins

function pageSize() {
  if (narrow.matches) return { w: folder.clientWidth - 28, h: PHONE_PAGE_H };
  return { w: folder.offsetWidth / 2 - 18, h: folder.offsetHeight - 36 };
}

function pageShell(side) {
  const page = el("div", "page " + side);
  if (side === "page-left") {
    page.appendChild(el("div", "punches", "<span></span><span></span><span></span><span></span>"));
  } else {
    page.appendChild(el("div", "digit-strip mono"));
  }
  page.appendChild(el("div", "page-scroll"));
  page.appendChild(el("div", "page-foot mono"));
  return page;
}

function fillHead(page, index, first) {
  const entry = ENTRIES[index];
  const scroll = page.querySelector(".page-scroll");
  const strip = page.querySelector(".digit-strip");
  if (strip) strip.textContent = entry.date.replace(/-/g, "") + entryNo(index);

  if (first) {
    const top = el("div", "page-top");
    top.appendChild(
      el(
        "p",
        "mono margin-note",
        `Entry no. ${entryNo(index)}.<br>Filed ${longDate(entry.date)}.`
      )
    );
    top.appendChild(el("span", "file-no", `File &#8470;${entryNo(index)}`));
    scroll.appendChild(top);
    scroll.appendChild(el("h2", "left-title", entry.heading || "Untitled entry"));
  } else {
    scroll.appendChild(el("p", "mono running-head", `Entry ${entryNo(index)} &middot; ${longDate(entry.date)} &middot; continued`));
  }
}

function overflows(page) {
  const scroll = page.querySelector(".page-scroll");
  return scroll.scrollHeight > scroll.clientHeight + 1;
}

function paginate() {
  const { w, h } = pageSize();
  const measurer = el("div");
  measurer.style.cssText = `position:absolute;left:-10000px;top:0;width:${w}px;height:${h}px;visibility:hidden;`;
  folder.appendChild(measurer);

  pages = [];
  entryStart = [];

  ENTRIES.forEach((entry, i) => {
    entryStart[i] = pages.length / 2;
    let k = 0;
    let page;
    let list;

    const startPage = () => {
      page = pageShell(k % 2 === 0 ? "page-left" : "page-right");
      fillHead(page, i, k === 0);
      list = el("ul", "flow");
      const content = el("div", "entry-content");
      content.appendChild(list);
      page.querySelector(".page-scroll").appendChild(content);
      measurer.replaceChildren(page);
    };
    const finishPage = () => {
      pages.push({ entry: i, el: page });
      k++;
    };

    startPage();
    flatten(entry.items).forEach((b) => {
      const li = el("li", entry.prose && b.depth === 0 ? "para" : "d" + Math.min(b.depth, 2), b.html);
      list.appendChild(li);
      if (!overflows(page) || list.children.length === 1) return;

      li.remove();
      const carry = [li];
      // Don't strand a bold heading bullet at the bottom of a page without its sub-points.
      const last = list.lastElementChild;
      if (b.depth > 0 && last.classList.contains("d0") && list.children.length > 1) {
        last.remove();
        carry.unshift(last);
      }
      finishPage();
      startPage();
      carry.forEach((n) => list.appendChild(n));
    });
    finishPage();

    // Every entry starts on a fresh spread, so close an odd page count with an end page.
    if (k % 2 === 1) {
      page = pageShell("page-right");
      page.classList.add("end-page");
      page.querySelector(".page-scroll").appendChild(
        el(
          "div",
          "end-mark",
          `<div class="stamp stamp-small"><span>sb</span><small>${shortDate(entry.date)}</small></div><p class="mono">End of entry ${entryNo(i)}.</p>`
        )
      );
      pages.push({ entry: i, el: page });
    }
  });

  measurer.remove();
  pages.forEach((p, n) => {
    const next = pages[n + 1];
    p.el.querySelector(".page-foot").innerHTML = `<span>Entry ${entryNo(p.entry)}</span><span>${pad(n + 1)}</span>`;
    // Right pages whose entry carries on get a curled corner that turns the page.
    const continues = next && next.entry === p.entry && !next.el.classList.contains("end-page");
    if (n % 2 === 1 && continues) {
      const corner = el("button", "turn-corner", `<span class="turn-label mono">Continued &rarr;</span>`);
      corner.type = "button";
      corner.setAttribute("aria-label", "Continued on the next page");
      p.el.appendChild(corner);
    }
  });
}

function spreadCount() {
  return pages.length / 2;
}

function pageCopy(n) {
  return pages[n].el.cloneNode(true);
}

function entryOf(spread) {
  return pages[spread * 2].entry;
}

/* ---------- State ---------- */

const COVER_MS = reduceMotion ? 0 : 1200;
const TURN_MS = 1000;

let current = 0; // spread index
let isOpen = false;
let busy = false;

function showSpread(spread) {
  leftSheet.replaceChildren(pageCopy(spread * 2));
  rightSheet.replaceChildren(pageCopy(spread * 2 + 1));
}

function updateChrome() {
  const activeEntry = pages.length ? entryOf(current) : -1;
  tabsNav.querySelectorAll(".folder-tab").forEach((tab, i) => {
    const active = isOpen && i === activeEntry;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active);
  });
  counter.textContent = isOpen
    ? `Pages ${current * 2 + 1}–${current * 2 + 2} of ${pages.length}`
    : "File closed";
  prevBtn.disabled = !isOpen || current === 0;
  nextBtn.disabled = !isOpen || current === spreadCount() - 1;
  closeBtn.hidden = !isOpen;
  if (isOpen) history.replaceState(null, "", "#" + entryId(activeEntry));
}

/* ---------- Open / close ---------- */

function openFile(spread = current) {
  if (isOpen || busy || !pages.length) return;
  busy = true;
  current = spread;
  showSpread(spread);
  isOpen = true;
  folder.classList.add("is-open");
  cover.setAttribute("aria-label", "Thesis file, open");
  updateChrome();
  setTimeout(() => {
    folder.classList.add("is-settled");
    busy = false;
  }, COVER_MS);
}

function closeFile() {
  if (!isOpen || busy) return;
  busy = true;
  isOpen = false;
  folder.classList.remove("is-settled");
  // Let the left page lift off before the cover swings back.
  setTimeout(() => {
    folder.classList.remove("is-open");
    cover.setAttribute("aria-label", "Open the thesis file");
    setTimeout(() => (busy = false), COVER_MS);
  }, reduceMotion ? 0 : 250);
  history.replaceState(null, "", location.pathname);
  updateChrome();
  document.querySelector(".desk").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

/* ---------- Page turning ---------- */

function goTo(target) {
  if (!isOpen || busy || target === current || target < 0 || target >= spreadCount()) return;
  const from = current;
  current = target;
  updateChrome();

  if (reduceMotion) {
    showSpread(target);
    return;
  }
  busy = true;

  if (narrow.matches) {
    // Phone: pages are stacked, so the whole spread turns like a single sheet.
    folder.classList.add("turn-out");
    setTimeout(() => {
      showSpread(target);
      folder.classList.remove("turn-out");
      folder.classList.add("turn-in");
      folder.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        folder.classList.remove("turn-in");
        busy = false;
      }, 450);
    }, 380);
    return;
  }

  // Desktop: a loose leaf lifts off one side and lands on the other, like a book.
  const forward = target > from;
  const leaf = el("div", "leaf " + (forward ? "leaf-forward" : "leaf-back"));
  const front = el("div", "leaf-face leaf-front");
  const back = el("div", "leaf-face leaf-back-face");
  front.appendChild(pageCopy(forward ? from * 2 + 1 : from * 2));
  back.appendChild(pageCopy(forward ? target * 2 : target * 2 + 1));
  leaf.append(front, back);
  folder.appendChild(leaf);

  // The page underneath is already the next one.
  if (forward) rightSheet.replaceChildren(pageCopy(target * 2 + 1));
  else leftSheet.replaceChildren(pageCopy(target * 2));
  folder.classList.add("is-turning", forward ? "turning-forward" : "turning-back");

  setTimeout(() => {
    if (forward) leftSheet.replaceChildren(pageCopy(target * 2));
    else rightSheet.replaceChildren(pageCopy(target * 2 + 1));
    leaf.remove();
    folder.classList.remove("is-turning", "turning-forward", "turning-back");
    busy = false;
  }, TURN_MS);
}

/* ---------- Tabs ---------- */

ENTRIES.forEach((entry, i) => {
  const tab = el("button", "folder-tab tab-c" + (i % 4), `<span>${shortDate(entry.date)}</span>`);
  tab.type = "button";
  tab.setAttribute("role", "tab");
  tab.style.setProperty("--i", i);
  tab.addEventListener("click", () => (isOpen ? goTo(entryStart[i]) : openFile(entryStart[i])));
  tabsNav.appendChild(tab);
});
folder.style.setProperty("--tab-count", ENTRIES.length);

/* ---------- Events ---------- */

cover.addEventListener("click", () => openFile());
cover.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openFile();
  }
});
folder.addEventListener("click", (e) => {
  if (e.target.closest(".turn-corner")) goTo(current + 1);
});
prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));
closeBtn.addEventListener("click", closeFile);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
  if (e.key === "Escape") closeFile();
});

// Page breaks depend on the page size, so redo them when the window changes shape.
let lastSize = "";
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const { w, h } = pageSize();
    const size = `${Math.round(w)}x${Math.round(h)}`;
    if (busy || size === lastSize) return;
    lastSize = size;
    const entry = entryOf(current);
    paginate();
    current = entryStart[entry];
    if (isOpen) showSpread(current);
    updateChrome();
  }, 200);
});

/* ---------- Heading fades as the files arrive ---------- */

const hero = document.querySelector(".hero");
const desk = document.querySelector(".desk");
let heroTicking = false;

function fadeHero() {
  heroTicking = false;
  // 1 while the desk is below the heading, 0 once the desk has covered it.
  const visible = Math.min(Math.max(desk.getBoundingClientRect().top / hero.offsetHeight, 0), 1);
  hero.style.opacity = visible;
  hero.style.transform = reduceMotion ? "" : `scale(${0.94 + 0.06 * visible})`;
  hero.style.visibility = visible === 0 ? "hidden" : "";
}

window.addEventListener("scroll", () => {
  if (!heroTicking) {
    heroTicking = true;
    requestAnimationFrame(fadeHero);
  }
}, { passive: true });
window.addEventListener("resize", fadeHero);
fadeHero();

/* ---------- Start closed ---------- */

document.getElementById("cover-count").textContent = pad(ENTRIES.length);
document.getElementById("currently-text").textContent = CURRENTLY;
document.getElementById("last-updated").textContent =
  "Last updated " +
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Wait for the fonts so page breaks are measured with the real type.
document.fonts.ready.then(() => {
  const { w, h } = pageSize();
  lastSize = `${Math.round(w)}x${Math.round(h)}`;
  paginate();
  const fromHash = ENTRIES.findIndex((e, i) => "#" + entryId(i) === location.hash);
  current = fromHash === -1 ? 0 : entryStart[fromHash];
  updateChrome();
});
updateChrome();
