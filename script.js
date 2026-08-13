// ===============================
// 页面切换
// ===============================

const homePage = document.getElementById("homePage");
const memoryPage = document.getElementById("memoryPage");


const enterBtn = document.getElementById("enterBtn");
const backBtn = document.getElementById("backBtn");


enterBtn.addEventListener("click", () => {
  homePage.classList.remove("active");
  memoryPage.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });

  // Phase 8.19：正常敲门只进入客厅。生日贺卡由客厅照片墙左侧画框主动打开。
  updateDateTag();
});

backBtn.addEventListener("click", () => {
  memoryPage.classList.remove("active");
  homePage.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
});



// ===============================
// 8.19：门头倒计时 + 客厅照片墙生日贺卡 + 自动放映厅
// ===============================

const birthdayCardLivingRoomBtn = document.getElementById("birthdayCardLivingRoomBtn");
const birthdayCardIntro = document.getElementById("birthdayCardIntro");
const birthdayCardBook = document.getElementById("birthdayCardBook");
const birthdayCardHint = document.getElementById("birthdayCardHint");
const birthdayCardContinueBtn = document.getElementById("birthdayCardContinueBtn");
const skipBirthdayCardBtn = document.getElementById("skipBirthdayCardBtn");
const houseNameBoard = document.getElementById("houseNameBoard");
const birthdayCountdownText = document.getElementById("birthdayCountdownText");

let birthdayCardOpened = false;
let birthdayExperienceClosing = false;
let birthdayCardPreviousFocus = null;

function resetBirthdayCardIntro() {
  birthdayCardOpened = false;
  birthdayExperienceClosing = false;

  if (birthdayCardBook) {
    birthdayCardBook.classList.remove("opened");
    birthdayCardBook.setAttribute("aria-expanded", "false");
    birthdayCardBook.setAttribute("aria-label", "点击展开生日贺卡");
  }

  if (birthdayCardHint) {
    birthdayCardHint.textContent = "点击贺卡，拆开这份生日惊喜";
  }

  if (birthdayCardContinueBtn) {
    birthdayCardContinueBtn.hidden = true;
    birthdayCardContinueBtn.classList.remove("show");
  }
}

function openBirthdayCardIntro() {
  if (!birthdayCardIntro) return;

  birthdayCardPreviousFocus = document.activeElement;
  resetBirthdayCardIntro();

  birthdayCardIntro.classList.remove("closing");
  birthdayCardIntro.classList.add("show");
  birthdayCardIntro.setAttribute("aria-hidden", "false");
  document.body.classList.add("birthday-card-lock");

  window.setTimeout(() => {
    birthdayCardBook?.focus({ preventScroll: true });
  }, 220);
}

function unfoldBirthdayCard() {
  if (!birthdayCardBook || birthdayCardOpened || birthdayExperienceClosing) return;

  birthdayCardOpened = true;
  birthdayCardBook.classList.add("opened");
  birthdayCardBook.setAttribute("aria-expanded", "true");
  birthdayCardBook.setAttribute("aria-label", "生日贺卡已展开，请点击下方按钮进入 8.19 生日放映厅");

  if (birthdayCardHint) {
    birthdayCardHint.textContent = "祝这个小女孩生日快乐！";
  }

  if (birthdayCardContinueBtn) {
    birthdayCardContinueBtn.hidden = false;
    window.setTimeout(() => {
      birthdayCardContinueBtn.classList.add("show");
      birthdayCardContinueBtn.focus({ preventScroll: true });
    }, 520);
  }
}

function finishBirthdayExperience({ afterClose = null } = {}) {
  if (birthdayExperienceClosing || !birthdayCardIntro) return;

  birthdayExperienceClosing = true;
  birthdayCardIntro.classList.add("closing");

  window.setTimeout(() => {
    birthdayCardIntro.classList.remove("show", "closing");
    birthdayCardIntro.setAttribute("aria-hidden", "true");
    document.body.classList.remove("birthday-card-lock");

    birthdayCardContinueBtn?.classList.remove("show");
    birthdayExperienceClosing = false;

    if (typeof afterClose === "function") {
      afterClose();
      return;
    }

    if (birthdayCardPreviousFocus && typeof birthdayCardPreviousFocus.focus === "function") {
      birthdayCardPreviousFocus.focus({ preventScroll: true });
    }
  }, 520);
}

function handleBirthdayCardAction() {
  if (!birthdayCardOpened) unfoldBirthdayCard();
}

if (birthdayCardBook) {
  birthdayCardBook.addEventListener("click", handleBirthdayCardAction);
  birthdayCardBook.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleBirthdayCardAction();
    }
  });
}

// 门头只保留倒计时与丝带礼花；生日贺卡入口搬到客厅照片墙左侧的画框图标。
birthdayCardLivingRoomBtn?.addEventListener("click", openBirthdayCardIntro);
skipBirthdayCardBtn?.addEventListener("click", () => finishBirthdayExperience());

// ===============================
// 8.19：门头生日倒计时
// ===============================

const BIRTHDAY_TARGET = new Date(2026, 7, 19); // 2026-08-19，月份从 0 开始计数

function updateBirthdayCountdown() {
  if (!birthdayCountdownText) return;

  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetLocal = new Date(BIRTHDAY_TARGET.getFullYear(), BIRTHDAY_TARGET.getMonth(), BIRTHDAY_TARGET.getDate());
  const diffDays = Math.round((targetLocal.getTime() - todayLocal.getTime()) / 86400000);

  houseNameBoard?.classList.toggle("birthday-today", diffDays === 0);
  houseNameBoard?.classList.toggle("birthday-passed", diffDays < 0);

  if (diffDays > 0) {
    birthdayCountdownText.textContent = `距离 8.19 还有 ${diffDays} 天`;
    return;
  }

  if (diffDays === 0) {
    birthdayCountdownText.textContent = "今天就是 8.19 · 生日快乐 ♡";
    return;
  }

  birthdayCountdownText.textContent = "8.19 的生日彩带还留在门头上 ♡";
}

updateBirthdayCountdown();

// ===============================
// 8.19：芸芸时间线自动放映厅
// 照片不再读取照片墙 memories，而是依次读取：
// images/littleyun/1.jpg...  → 小时候
// images/youngyun/1.jpg...   → 较早时期
// images/noguyun/1.jpg...    → 这一年的她
// images/guyun/1.jpg...      → 恋爱后的她
// 每个文件夹都请从 1.jpg 开始连续编号，不要中间跳号。
// ===============================

const birthdayCinema = document.getElementById("birthdayCinema");
const closeBirthdayCinemaBtn = document.getElementById("closeBirthdayCinemaBtn");
const birthdayCinemaStage = document.getElementById("birthdayCinemaStage");
const birthdayCinemaPhotoWrap = document.getElementById("birthdayCinemaPhotoWrap");
const birthdayCinemaPhoto = document.getElementById("birthdayCinemaPhoto");
const birthdayCinemaConfetti = document.getElementById("birthdayCinemaConfetti");
const birthdayCinemaDate = document.getElementById("birthdayCinemaDate");
const birthdayCinemaSlideTitle = document.getElementById("birthdayCinemaSlideTitle");
const birthdayCinemaText = document.getElementById("birthdayCinemaText");
const birthdayCinemaCounter = document.getElementById("birthdayCinemaCounter");
const birthdayCinemaAutoHint = document.getElementById("birthdayCinemaAutoHint");
const birthdayCinemaProgressBar = document.getElementById("birthdayCinemaProgressBar");
const birthdayCinemaFinishBtn = document.getElementById("birthdayCinemaFinishBtn");
const birthdayCinemaMask = document.querySelector(".birthday-cinema-mask");

// ★ 每张照片的主节奏：3720 ≈ 3.72 秒。
// 转场本身约 700ms，会在两张照片之间做交叉淡化；字幕稍晚 120ms 再换。
const BIRTHDAY_CINEMA_SLIDE_MS = 3780;
const BIRTHDAY_CINEMA_CROSSFADE_MS = 700;
const BIRTHDAY_CINEMA_COPY_DELAY_MS = 120;
const BIRTHDAY_CINEMA_MUSIC_SRC = "music/放映厅.mp3";

// 四个阶段的顺序就是放映顺序。
// count 是每个文件夹实际照片数量；以后新增/删除照片，只改对应 count 即可。
// captions 会按照照片序号循环使用；以后想换文案，只需要改这里。
const BIRTHDAY_CINEMA_GROUPS = [
  {
    folder: "littleyun",
    count: 6,
    chapter: "第一幕 · 小小芸",
    title: "小时候的你",
    captions: [
      "谁家小嫩豆腐。",
      "豹纹款，你说也很喜欢这张。",
      "搞怪搞笑的你，要一直收藏。",
      "参见小小公主。",
      "双马尾的小小芸，怎么有点害羞呢。",
      "企鹅帽的潮流你懂不懂。",
    ]
  },
  {
    folder: "youngyun",
    count: 6,
    chapter: "第二幕 · 中中芸",
    title: "还未相遇的你和我",
    captions: [
      "18岁生日快乐！我喜欢现在的你，也很想认识每一个过去的你。",
      "19岁生日快乐！在遇见我以前，你已经留下了这么多漂亮的瞬间。",
      "20岁生日快乐！那些我缺席过的日子，现在可以借这些照片慢慢补回来。",
      "21岁生日快乐！这些年份对我来说原本是空白，现在终于有了你的样子。",
      "22岁生日快乐！那时候我们各自在自己的生活里，还不知道彼此会出现。",
      "五年前第一次在陈宁朋友圈看见你们的合照，命运的齿轮开始转动。",
     ]
  },
  {
    folder: "noguyun",
    count: 8,
    chapter: "第三幕 · 大大芸",
    title: "命运开始让我们越走越近",
    captions: [
      "这一年的你，有很多我后来才一张张补看的瞬间。",
      "从朋友圈慢慢往前翻，像是在重新认识这一年的你。",
      "现在再看这些照片，会觉得我们离相遇越来越近了。",
      "那时的你还不知道，后面的日子里会多一个很爱你的人。",
      "这一年的照片越往后翻，我们之间的距离也越来越短。",
      "现在知道结局以后，再看这些照片会有一种很奇妙的期待。",
      "你照常生活，而我们的故事已经悄悄快要开始了。",
      "那时谁也不知道，再过不久我们会变成彼此很重要的人。",
      "这些照片拍下来的时候，我还没出现，但已经离你不远了。"
    ]
  },
  {
    folder: "guyun",
    count: 13,
    chapter: "第四幕 · 此刻最好的你",
    title: "后来，我也在你的故事里了",
    captions: [
      "我终于不只是隔着照片看你了。",
      "以前只能看见你的某一个瞬间，现在可以站在你身边。",
      "以前是朋友圈里的你，后来是我手机相册里越来越多的你。",
      "能从旁观你的照片，变成参与照片里那些日子的人，真的很好。",    
      "喜欢镜头里的你，也更喜欢照片拍完以后还在我身边的你。",
      "再往后的照片里，我开始知道每一张背后发生了什么。",
      "你说：“请多偷拍。”",
      "越来越多的照片是我的专属。",
      "认识你以后，时间突然有了很多可以一起记住的坐标。",
      "最美味的小蛋糕。", 
      "你的相机里有两个萌物，我有三个。", 
      "爱你的人会把你拍得很好看。"

    ]
  }
];

let birthdayCinemaSlides = [];
let birthdayCinemaIndex = 0;
let birthdayCinemaTimer = null;
let birthdayCinemaMusicState = null;
let birthdayCinemaOwnsMusic = false;
let birthdayCinemaNeedsMusicGesture = false;
let birthdayCinemaSlidesCache = null;
let birthdayCinemaActivePhotoLayer = null;
let birthdayCinemaRenderedIndex = -1;
let birthdayCinemaCopyTimer = null;
let birthdayCinemaLayerCleanupTimer = null;
let birthdayCinemaChapterGlowTimer = null;

async function buildBirthdayCinemaSlides() {
  if (birthdayCinemaSlidesCache) return birthdayCinemaSlidesCache.slice();

  // 照片数量改为显式固定值，不再探测静态托管上的旧文件。
  // 当前总数：6 + 5 + 8 + 15 = 34 张。
  const slides = [];

  BIRTHDAY_CINEMA_GROUPS.forEach((group, groupIndex) => {
    const count = Math.max(0, Number(group.count) || 0);

    for (let imageIndex = 1; imageIndex <= count; imageIndex += 1) {
      const captions = Array.isArray(group.captions) && group.captions.length
        ? group.captions
        : [""];

      slides.push({
        date: `${group.chapter} · ${String(imageIndex).padStart(2, "0")}`,
        title: group.title,
        text: captions[(imageIndex - 1) % captions.length],
        image: `images/${group.folder}/${imageIndex}.jpg`,
        group: group.folder,
        groupIndex,
        imageIndex
      });
    }
  });

  birthdayCinemaSlidesCache = slides.slice();
  return slides;
}

function ensureBirthdayCinemaConfetti() {
  if (!birthdayCinemaConfetti || birthdayCinemaConfetti.childElementCount > 0) return;

  const colors = ["#ff79a9", "#ffd36e", "#7ecdf5", "#ffffff", "#c9a5ff", "#ff9e78"];
  const pieceCount = 42;

  for (let i = 0; i < pieceCount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "birthday-cinema-confetti-piece";
    piece.style.setProperty("--confetti-left", `${Math.random() * 100}%`);
    piece.style.setProperty("--confetti-delay", `${(Math.random() * 1.3).toFixed(2)}s`);
    piece.style.setProperty("--confetti-duration", `${(2.8 + Math.random() * 2.3).toFixed(2)}s`);
    piece.style.setProperty("--confetti-drift", `${(-70 + Math.random() * 140).toFixed(0)}px`);
    piece.style.setProperty("--confetti-rotate", `${(180 + Math.random() * 620).toFixed(0)}deg`);
    piece.style.setProperty("--confetti-size", `${(5 + Math.random() * 7).toFixed(1)}px`);
    piece.style.setProperty("--confetti-color", colors[i % colors.length]);
    piece.style.setProperty("--confetti-radius", i % 4 === 0 ? "50%" : (i % 3 === 0 ? "2px" : "0px"));
    birthdayCinemaConfetti.appendChild(piece);
  }
}

function setBirthdayCinemaFinalMoment(active) {
  const isActive = Boolean(active);
  birthdayCinemaStage?.classList.toggle("final-card", isActive);

  if (birthdayCinemaConfetti) {
    if (isActive) ensureBirthdayCinemaConfetti();
    birthdayCinemaConfetti.classList.toggle("show", isActive);
  }

  if (birthdayCinemaFinishBtn) {
    birthdayCinemaFinishBtn.textContent = isActive ? "点击实现愿望~❤" : "放映完啦，回到客厅 ♡";
    birthdayCinemaFinishBtn.hidden = !isActive;
  }
}

function clearBirthdayCinemaTimer() {
  if (birthdayCinemaTimer) {
    window.clearTimeout(birthdayCinemaTimer);
    birthdayCinemaTimer = null;
  }
  if (birthdayCinemaCopyTimer) {
    window.clearTimeout(birthdayCinemaCopyTimer);
    birthdayCinemaCopyTimer = null;
  }
  if (birthdayCinemaLayerCleanupTimer) {
    window.clearTimeout(birthdayCinemaLayerCleanupTimer);
    birthdayCinemaLayerCleanupTimer = null;
  }
  if (birthdayCinemaChapterGlowTimer) {
    window.clearTimeout(birthdayCinemaChapterGlowTimer);
    birthdayCinemaChapterGlowTimer = null;
  }
}

function completeBirthdayCinemaAutoplay() {
  clearBirthdayCinemaTimer();
  setBirthdayCinemaFinalMoment(true);
  if (birthdayCinemaAutoHint) birthdayCinemaAutoHint.textContent = "生日快乐 · ♫ 9号放映厅";
}

function scheduleBirthdayCinemaAdvance(expectedIndex) {
  // 这里只重置“下一张照片”的自动播放计时器。
  // 不能调用 clearBirthdayCinemaTimer()，否则会把刚创建的字幕淡换 timer 一起清掉，
  // 造成第一张之后字幕永远停在第一句。
  if (birthdayCinemaTimer) {
    window.clearTimeout(birthdayCinemaTimer);
    birthdayCinemaTimer = null;
  }
  if (!birthdayCinema?.classList.contains("show")) return;
  if (expectedIndex !== birthdayCinemaIndex) return;

  birthdayCinemaTimer = window.setTimeout(() => {
    if (!birthdayCinema?.classList.contains("show")) return;
    if (birthdayCinemaIndex >= birthdayCinemaSlides.length - 1) {
      completeBirthdayCinemaAutoplay();
      return;
    }
    renderBirthdayCinemaSlide(birthdayCinemaIndex + 1);
  }, BIRTHDAY_CINEMA_SLIDE_MS);
}

function preloadBirthdayCinemaImages(startIndex, amount = 2) {
  for (let offset = 0; offset < amount; offset += 1) {
    const nextSlide = birthdayCinemaSlides[startIndex + offset];
    if (!nextSlide?.image) continue;
    const preload = new Image();
    preload.src = nextSlide.image;
  }
}

function ensureBirthdayCinemaPhotoLayers() {
  if (!birthdayCinemaPhotoWrap || !birthdayCinemaPhoto) return [];

  birthdayCinemaPhoto.classList.add("birthday-cinema-photo-layer");
  let secondLayer = birthdayCinemaPhotoWrap.querySelector(".birthday-cinema-photo-layer-secondary");

  if (!secondLayer) {
    secondLayer = document.createElement("img");
    secondLayer.className = "birthday-cinema-photo-layer birthday-cinema-photo-layer-secondary";
    secondLayer.alt = "放映中的芸芸照片";
    secondLayer.decoding = "async";
    birthdayCinemaPhotoWrap.appendChild(secondLayer);
  }

  return [birthdayCinemaPhoto, secondLayer];
}

function updateBirthdayCinemaCopy(slide, isFinalSlide, { immediate = false } = {}) {
  const copy = birthdayCinemaStage?.querySelector(".birthday-cinema-copy");

  const applyText = () => {
    if (birthdayCinemaDate) birthdayCinemaDate.textContent = isFinalSlide ? "8.19 · HAPPY BIRTHDAY" : (slide.date || "");
    if (birthdayCinemaSlideTitle) birthdayCinemaSlideTitle.textContent = isFinalSlide ? "请许愿🎂" : (slide.title || "");
    if (birthdayCinemaText) birthdayCinemaText.textContent = isFinalSlide ? "" : (slide.text || "");
  };

  // 第一张 / 兜底场景直接显示，绝不允许字幕停留在 opacity:0。
  if (!copy || immediate) {
    applyText();
    if (copy) {
      copy.classList.remove("copy-changing");
      copy.style.opacity = "1";
      copy.style.transform = "translate3d(0, 0, 0)";
    }
    return;
  }

  // 先轻轻淡出旧字幕，120ms 后换字，再恢复显示。
  // 用定时器只控制字幕本身，不再和图片层的显隐状态互相依赖。
  copy.classList.remove("copy-changing");
  copy.style.opacity = "1";
  copy.style.transform = "translate3d(0, 0, 0)";
  void copy.offsetWidth;
  copy.classList.add("copy-changing");

  birthdayCinemaCopyTimer = window.setTimeout(() => {
    birthdayCinemaCopyTimer = null;
    applyText();
    copy.classList.remove("copy-changing");
    copy.style.opacity = "1";
    copy.style.transform = "translate3d(0, 0, 0)";
  }, BIRTHDAY_CINEMA_COPY_DELAY_MS);
}

function playBirthdayCinemaChapterGlow() {
  if (!birthdayCinemaStage) return;
  birthdayCinemaStage.classList.remove("chapter-transition");
  void birthdayCinemaStage.offsetWidth;
  birthdayCinemaStage.classList.add("chapter-transition");

  birthdayCinemaChapterGlowTimer = window.setTimeout(() => {
    birthdayCinemaChapterGlowTimer = null;
    birthdayCinemaStage?.classList.remove("chapter-transition");
  }, 1050);
}

function resetBirthdayCinemaPhotoLayers() {
  const layers = ensureBirthdayCinemaPhotoLayers();
  layers.forEach((layer) => {
    layer.onload = null;
    layer.onerror = null;
    layer.classList.remove("is-current", "is-outgoing", "is-preparing");
    // 显隐状态改用 inline style 控制，避开 #birthdayCinemaPhoto 与 class 的 CSS 优先级冲突。
    layer.style.opacity = "0";
    layer.style.visibility = "hidden";
    layer.style.zIndex = "1";
    layer.style.transform = "scale(1)";
    layer.removeAttribute("src");
  });
  birthdayCinemaActivePhotoLayer = null;
  birthdayCinemaRenderedIndex = -1;
}

function renderBirthdayCinemaSlide(index) {
  if (!birthdayCinemaStage || birthdayCinemaSlides.length === 0) return;

  clearBirthdayCinemaTimer();
  const previousRenderedIndex = birthdayCinemaRenderedIndex;
  birthdayCinemaIndex = Math.max(0, Math.min(index, birthdayCinemaSlides.length - 1));
  const slide = birthdayCinemaSlides[birthdayCinemaIndex];
  const previousSlide = previousRenderedIndex >= 0 ? birthdayCinemaSlides[previousRenderedIndex] : null;
  const expectedIndex = birthdayCinemaIndex;
  const isFinalSlide = birthdayCinemaIndex === birthdayCinemaSlides.length - 1;
  const isFirstRenderedSlide = previousRenderedIndex < 0;
  const isChapterChange = Boolean(previousSlide && previousSlide.groupIndex !== slide.groupIndex);

  // 最后一幕的礼花等新照片真正出现以后再开始，避免礼花先落在上一张照片上。
  setBirthdayCinemaFinalMoment(false);
  if (birthdayCinemaAutoHint) {
    birthdayCinemaAutoHint.textContent = birthdayCinemaNeedsMusicGesture
      ? "自动放映 · 轻触画面继续播放《放映厅》"
      : "生日快乐 · ♫ 9号放映厅";
  }

  birthdayCinemaStage.classList.remove("cinema-slide-in", "title-card");
  birthdayCinemaStage.classList.toggle("final-card", false);

  const layers = ensureBirthdayCinemaPhotoLayers();
  const targetLayer = layers.find((layer) => layer !== birthdayCinemaActivePhotoLayer) || layers[0];
  const outgoingLayer = birthdayCinemaActivePhotoLayer;

  if (birthdayCinemaPhotoWrap && targetLayer && slide.image) {
    birthdayCinemaPhotoWrap.hidden = false;
    targetLayer.onload = null;
    targetLayer.onerror = null;
    targetLayer.classList.remove("is-current", "is-outgoing");
    targetLayer.classList.add("is-preparing");
    targetLayer.style.opacity = "0";
    targetLayer.style.visibility = "visible";
    targetLayer.style.zIndex = "2";
    targetLayer.style.transform = "scale(1)";
    targetLayer.alt = `${slide.date || ""} ${slide.title || "芸芸的照片"}`.trim();

    const revealBirthdayCinemaPhoto = () => {
      if (birthdayCinemaIndex !== expectedIndex) return;

      birthdayCinemaPhotoWrap.hidden = false;
      targetLayer.classList.remove("is-preparing");
      targetLayer.classList.add("is-current");
      // 用 inline style 直接驱动两层交叉淡化，彻底避开 ID/class specificity 导致的隔张黑屏。
      targetLayer.style.opacity = "1";
      targetLayer.style.visibility = "visible";
      targetLayer.style.zIndex = "2";
      targetLayer.style.transform = "scale(1.02)";

      if (outgoingLayer && outgoingLayer !== targetLayer) {
        outgoingLayer.classList.remove("is-current", "is-preparing");
        outgoingLayer.classList.add("is-outgoing");
        outgoingLayer.style.opacity = "0";
        outgoingLayer.style.visibility = "visible";
        outgoingLayer.style.zIndex = "1";
        outgoingLayer.style.transform = "scale(1.022)";
      }

      birthdayCinemaActivePhotoLayer = targetLayer;
      birthdayCinemaRenderedIndex = expectedIndex;

      if (isChapterChange) playBirthdayCinemaChapterGlow();
      updateBirthdayCinemaCopy(slide, isFinalSlide, { immediate: isFirstRenderedSlide });

      if (isFinalSlide) {
        birthdayCinemaStage.classList.add("final-card");
        setBirthdayCinemaFinalMoment(true);
        if (birthdayCinemaAutoHint) birthdayCinemaAutoHint.textContent = "生日快乐 · ♫ 9号放映厅";
      } else {
        scheduleBirthdayCinemaAdvance(expectedIndex);
      }

      if (outgoingLayer && outgoingLayer !== targetLayer) {
        birthdayCinemaLayerCleanupTimer = window.setTimeout(() => {
          birthdayCinemaLayerCleanupTimer = null;
          if (outgoingLayer === birthdayCinemaActivePhotoLayer) return;
          outgoingLayer.classList.remove("is-outgoing");
          outgoingLayer.style.opacity = "0";
          outgoingLayer.style.visibility = "hidden";
          outgoingLayer.style.zIndex = "1";
          outgoingLayer.style.transform = "scale(1)";
          outgoingLayer.onload = null;
          outgoingLayer.onerror = null;
        }, BIRTHDAY_CINEMA_CROSSFADE_MS + 90);
      }
    };

    targetLayer.onload = revealBirthdayCinemaPhoto;
    targetLayer.onerror = () => {
      if (birthdayCinemaIndex !== expectedIndex) return;
      targetLayer.classList.remove("is-preparing", "is-current");
      targetLayer.style.opacity = "0";
      targetLayer.style.visibility = "hidden";
      targetLayer.style.zIndex = "1";
      targetLayer.style.transform = "scale(1)";
      if (!outgoingLayer) birthdayCinemaPhotoWrap.hidden = true;
      updateBirthdayCinemaCopy(slide, isFinalSlide, { immediate: isFirstRenderedSlide });
      birthdayCinemaRenderedIndex = expectedIndex;
      if (isFinalSlide) {
        birthdayCinemaStage.classList.add("final-card");
        setBirthdayCinemaFinalMoment(true);
      } else {
        scheduleBirthdayCinemaAdvance(expectedIndex);
      }
    };

    targetLayer.src = slide.image;

    if (targetLayer.complete && targetLayer.naturalWidth > 0) {
      window.requestAnimationFrame(revealBirthdayCinemaPhoto);
    }
  } else {
    if (birthdayCinemaPhotoWrap) birthdayCinemaPhotoWrap.hidden = true;
    birthdayCinemaRenderedIndex = expectedIndex;
    updateBirthdayCinemaCopy(slide, isFinalSlide, { immediate: isFirstRenderedSlide });
    if (isFinalSlide) {
      birthdayCinemaStage.classList.add("final-card");
      setBirthdayCinemaFinalMoment(true);
    } else {
      scheduleBirthdayCinemaAdvance(expectedIndex);
    }
  }

  const total = birthdayCinemaSlides.length;
  if (birthdayCinemaCounter) {
    birthdayCinemaCounter.textContent = `${String(birthdayCinemaIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  }
  if (birthdayCinemaProgressBar) {
    birthdayCinemaProgressBar.style.width = `${((birthdayCinemaIndex + 1) / total) * 100}%`;
  }

  preloadBirthdayCinemaImages(birthdayCinemaIndex + 1, 2);
}

function renderBirthdayCinemaLoading() {
  clearBirthdayCinemaTimer();
  resetBirthdayCinemaPhotoLayers();
  setBirthdayCinemaFinalMoment(false);
  if (birthdayCinemaPhotoWrap) birthdayCinemaPhotoWrap.hidden = true;
  birthdayCinemaStage?.classList.remove("cinema-slide-in", "final-card");
  birthdayCinemaStage?.classList.add("title-card");
  if (birthdayCinemaDate) birthdayCinemaDate.textContent = "8.19 · OUR CINEMA";
  if (birthdayCinemaSlideTitle) birthdayCinemaSlideTitle.textContent = "正在把她的照片装进放映机…";
  if (birthdayCinemaText) birthdayCinemaText.textContent = "从小时候开始，一张张按时间放到今天。";
  if (birthdayCinemaCounter) birthdayCinemaCounter.textContent = "-- / --";
  if (birthdayCinemaProgressBar) birthdayCinemaProgressBar.style.width = "4%";
  if (birthdayCinemaFinishBtn) birthdayCinemaFinishBtn.hidden = true;
}

function renderBirthdayCinemaEmpty() {
  setBirthdayCinemaFinalMoment(false);
  if (birthdayCinemaPhotoWrap) birthdayCinemaPhotoWrap.hidden = true;
  birthdayCinemaStage?.classList.remove("cinema-slide-in", "final-card");
  birthdayCinemaStage?.classList.add("title-card");
  if (birthdayCinemaDate) birthdayCinemaDate.textContent = "8.19 · OUR CINEMA";
  if (birthdayCinemaSlideTitle) birthdayCinemaSlideTitle.textContent = "放映机还在等照片";
  if (birthdayCinemaText) {
    birthdayCinemaText.textContent = "把照片从 1.jpg 开始依次放进 littleyun、youngyun、noguyun、guyun，下一次打开就会自动按顺序播放。";
  }
  if (birthdayCinemaCounter) birthdayCinemaCounter.textContent = "00 / 00";
  if (birthdayCinemaProgressBar) birthdayCinemaProgressBar.style.width = "0%";
  if (birthdayCinemaFinishBtn) {
    birthdayCinemaFinishBtn.textContent = "回到客厅 ♡";
    birthdayCinemaFinishBtn.hidden = false;
  }
}

function setMusicPlayerDisc(index) {
  const music = musicList[index];
  if (!playerDisc) return;

  if (!music) {
    playerDisc.classList.add("empty");
    playerDisc.innerHTML = '<span class="music-note">♪</span>';
    return;
  }

  playerDisc.classList.remove("empty");
  playerDisc.innerHTML = `<img src="${music.cover}" alt="${music.title}">`;
}

function startBirthdayCinemaMusic() {
  if (!bgMusic || birthdayCinemaOwnsMusic) return;

  birthdayCinemaMusicState = {
    index: currentMusicIndex,
    currentTime: Number(bgMusic.currentTime) || 0,
    wasPlaying: Boolean(bgMusic.src && !bgMusic.paused && !bgMusic.ended),
    loop: Boolean(bgMusic.loop)
  };
  birthdayCinemaOwnsMusic = true;
  birthdayCinemaNeedsMusicGesture = false;

  // 放映厅使用独立音乐，不加入客厅唱片列表；退出后仍恢复原先唱片与播放进度。
  currentMusicIndex = -1;
  bgMusic.src = BIRTHDAY_CINEMA_MUSIC_SRC;
  bgMusic.loop = true;
  try { bgMusic.currentTime = 0; } catch (_) {}
  setMusicPlayerDisc(-1);
  updateActiveAlbum();

  const playPromise = bgMusic.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => {
      birthdayCinemaNeedsMusicGesture = true;
      if (birthdayCinemaAutoHint) birthdayCinemaAutoHint.textContent = "自动放映 · 轻触画面继续播放《放映厅》";
      console.warn("[生日放映厅] 自动播放《放映厅》失败，等待下一次触摸：", error);
    });
  }
}

function retryBirthdayCinemaMusic() {
  if (!birthdayCinemaNeedsMusicGesture || !birthdayCinema?.classList.contains("show")) return;
  birthdayCinemaNeedsMusicGesture = false;
  const playPromise = bgMusic?.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise.then(() => {
      if (birthdayCinemaAutoHint) birthdayCinemaAutoHint.textContent = "自动放映 · ♫ 9号放映厅";
    }).catch((error) => {
      birthdayCinemaNeedsMusicGesture = true;
      console.warn("[生日放映厅] 再次播放《放映厅》失败：", error);
    });
  }
}

function restoreMusicAfterBirthdayCinema() {
  if (!birthdayCinemaOwnsMusic || !bgMusic) return;

  const previous = birthdayCinemaMusicState;
  birthdayCinemaOwnsMusic = false;
  birthdayCinemaNeedsMusicGesture = false;
  birthdayCinemaMusicState = null;
  bgMusic.pause();

  if (!previous || previous.index < 0 || !musicList[previous.index]) {
    currentMusicIndex = -1;
    bgMusic.removeAttribute("src");
    bgMusic.load();
    bgMusic.loop = false;
    setMusicPlayerDisc(-1);
    updateActiveAlbum();
    return;
  }

  const previousMusic = musicList[previous.index];
  currentMusicIndex = previous.index;
  bgMusic.src = previousMusic.src;
  bgMusic.loop = previous.loop;
  setMusicPlayerDisc(previous.index);

  const restoreTime = () => {
    try { bgMusic.currentTime = previous.currentTime || 0; } catch (_) {}
    if (previous.wasPlaying) {
      bgMusic.play().catch((error) => console.warn("[生日放映厅] 恢复原唱片失败：", error));
    } else {
      updateActiveAlbum();
    }
  };

  if (bgMusic.readyState >= 1) restoreTime();
  else bgMusic.addEventListener("loadedmetadata", restoreTime, { once: true });
}

async function openBirthdayCinema() {
  if (!birthdayCinema) return;

  birthdayCinemaIndex = 0;
  birthdayCinemaSlides = [];
  birthdayCinema.classList.add("show");
  birthdayCinema.setAttribute("aria-hidden", "false");
  document.body.classList.add("birthday-cinema-lock");
  renderBirthdayCinemaLoading();

  // 正常情况下音乐已经在“进入放映厅”按钮的点击手势里启动；这里再做一次兜底。
  if (!birthdayCinemaOwnsMusic) startBirthdayCinemaMusic();

  try {
    const slides = await buildBirthdayCinemaSlides();
    if (!birthdayCinema.classList.contains("show")) return;

    birthdayCinemaSlides = slides;
    if (birthdayCinemaSlides.length === 0) {
      renderBirthdayCinemaEmpty();
    } else {
      renderBirthdayCinemaSlide(0);
    }
  } catch (error) {
    console.error("[生日放映厅] 读取时间线照片失败：", error);
    if (birthdayCinema.classList.contains("show")) renderBirthdayCinemaEmpty();
  }

  window.setTimeout(() => {
    closeBirthdayCinemaBtn?.focus({ preventScroll: true });
  }, 180);
}

function closeBirthdayCinema() {
  if (!birthdayCinema) return;

  clearBirthdayCinemaTimer();
  resetBirthdayCinemaPhotoLayers();
  birthdayCinemaStage?.classList.remove("chapter-transition");
  const cinemaCopy = birthdayCinemaStage?.querySelector(".birthday-cinema-copy");
  cinemaCopy?.classList.remove("copy-changing");
  if (cinemaCopy) {
    cinemaCopy.style.opacity = "1";
    cinemaCopy.style.transform = "translate3d(0, 0, 0)";
  }
  birthdayCinema.classList.remove("show");
  birthdayCinema.setAttribute("aria-hidden", "true");
  document.body.classList.remove("birthday-cinema-lock");
  setBirthdayCinemaFinalMoment(false);

  restoreMusicAfterBirthdayCinema();

  // 放映厅属于客厅照片墙，关闭后仍停在客厅原位置。
  birthdayCardLivingRoomBtn?.focus({ preventScroll: true });
}

// 关键：在用户点击按钮的同一手势里先启动放映厅音乐，提高 iPhone Safari / PWA 自动播放成功率。
birthdayCardContinueBtn?.addEventListener("click", () => {
  startBirthdayCinemaMusic();
  finishBirthdayExperience({ afterClose: openBirthdayCinema });
});

birthdayCinemaFinishBtn?.addEventListener("click", closeBirthdayCinema);
closeBirthdayCinemaBtn?.addEventListener("click", closeBirthdayCinema);
birthdayCinemaMask?.addEventListener("click", closeBirthdayCinema);
birthdayCinemaStage?.addEventListener("click", retryBirthdayCinemaMusic);

// Esc 可退出贺卡或放映厅；放映厅优先。
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (birthdayCinema?.classList.contains("show")) {
    closeBirthdayCinema();
    return;
  }

  if (birthdayCardIntro?.classList.contains("show")) {
    finishBirthdayExperience();
  }
});


// ===============================
// 回忆数据区
// 之后你主要改这里就可以
// 日期格式必须是：YYYY-MM-DD
// image 写你的图片路径，例如：images/2026-04-01.webp
// 同一天只有一条：继续写 { ... }；同一天有多条：写成 [ { ... }, { ... } ]。
// 注意：不要重复写两个完全相同的日期 key，JavaScript 会让后一个覆盖前一个。
// 数组里排在上面的回忆，会先出现在照片墙；排在下面的会后出现。
// ===============================

const memories = {
  "2026-03-31": {
    featured: true,
    title: "那一天你走进了我的生命",
    image: "images/20260331.webp",
    text: "小众姓联盟成立！"
  },

  "2026-04-03": {
    title: "心跳114，心动得要死",
    images: ["images/20260403-1.jpg",
	"images/20260403-2.jpg",
	"images/20260403-3.jpg",
	    ],
    text: "请评价！"
  },

 "2026-04-09": {
    title: "LOVERs",
    images: ["images/20260409-1.jpg",
	"images/20260409-2.jpg",
		    ],
    text: "就这样巧吧"
  },

  "2026-04-10": {
    title: "我也看到这了分享给你",
    image: "images/20260410.jpg",
    text: "看剧速度这一块的"
  },


 "2026-04-14": {
    featured: true,
    title: "第一次见面",
    images: ["images/20260414-1.webp",
	"images/20260414-2.webp",
	"images/20260414-3.webp",
	"images/20260414-4.webp",
    ],
    text: "暴走西湖🚶"
  },

 "2026-04-25": {
    title: "边总莅临和山，意欲收购工大",
    images: ["images/20260425-1.webp",
	"images/20260425-2.webp",
	"images/20260425-3.webp",
	"images/20260425-4.webp",
    ],
    text: "可惜没有多拍几张照片"
  },


  "2026-04-26": {
    title: "I ❤️ YOU",
    image: "images/20260426-1.jpg",
    text: "回头看都是小巧思"
  },

 "2026-04-28": {
    title: "小狗假意收伞，趁机智取小手",
    images: ["images/20260428-1.webp",
	"images/20260428-2.webp",
	"images/20260428-3.webp",
	"images/20260428-4.webp",
    ],
    text: "你的伞小，打你的伞"
  },

 "2026-05-04": {
    title: "🌄 💐 ✉️ ",
    images: ["images/20260504-1.webp",
	"images/20260504-2.webp",
	"images/20260504-3.webp",
	"images/20260504-4.webp",
	"images/20260504-5.webp",
	"images/20260504-6.webp",
    ],
    text: "谈很久很久的恋爱"
  },

 "2026-05-07": {
    title: "给我庆生🎂",
    images: ["images/20260507-1.webp",
	"images/20260507-2.webp",
	"images/20260507-3.webp",
	"images/20260507-4.webp",
	"images/20260507-5.webp",
	    ],
    text: "谢谢宝宝，过得很开心的一个生日"
  },

  "2026-05-09": {
    featured: true,
    title: "在一起",
    images: ["images/20260509-1.webp",
	 "images/20260509-2.webp",
	 "images/20260509-3.webp",
	 "images/20260509-4.webp",
	    ],

    text: "城市阳台的风缓缓的，我们坐在长椅上聊着有的没的，贴在一起的时候，感到无比安心和放松"
  },

"2026-05-17": {
    title: "提前过520",
    images: ["images/20260517-1.webp",
	 "images/20260517-2.webp",
	 "images/20260517-3.webp",
	 "images/20260517-4.webp",
	 "images/20260517-5.webp",
	    ],

    text: "拍立得万岁！"
  },

"2026-05-22": {
    title: "拼豆＆牛肉火锅",
    images: ["images/20260522-1.webp",
	 "images/20260522-2.webp",
	 "images/20260522-3.webp",
	 "images/20260522-4.webp",
	 "images/20260522-5.webp",
	 "images/20260522-6.webp",
	 "images/20260522-7.webp",
	    ],

    text: "拼豆超级放松，很好吃的一顿牛肉"
  },

  "2026-06-01": {
    title: "儿童节特辑",
    images: ["images/20260601-1.webp",
	 "images/20260601-2.webp",
	 "images/20260601-3.webp",
	 "images/20260601-4.webp",
	 "images/20260601-5.webp",
	 "images/20260601-6.webp",
	 "images/20260601-7.webp",
	    ],
    text: "不要放过这个小年糕小豆腐小大福"
 },


  "2026-06-06": {
    title: "穿上我买的睡衣了",
    image: "images/20260606-1.webp",
    text: "超级适配、轻松驾驭、美衣配美人"
 },


"2026-06-09": {
    title: "小蛋糕屏保生成中...",
    images: ["images/20260609-1.webp",
	 "images/20260609-2.webp",
	 "images/20260609-3.webp",
	    ],

    text: "超多口味的小蛋糕供我选择，最喜欢的三张"
  },

"2026-06-10": {
    title: "被宝宝投喂杨梅了",
    images: ["images/20260610-1.webp",
	 "images/20260610-2.webp",
	 "images/20260610-3.webp",
	    ],

    text: "乒乓球一样大的杨梅，没吃过这么大的，而且很甜很新鲜"
  },

"2026-06-14": {
    title: "爱上泉市果切♥",
    images: ["images/20260614-1.webp",
	 "images/20260614-2.webp",
	 "images/20260614-3.webp",
	 "images/20260614-4.webp",
	 "images/20260614-5.webp",
	    ],
    text: "超鲜的牛肉，意外爱上的果切，美味的蛋糕"
  },

"2026-06-20": {
    title: "一个臭美的女子",
    images: ["images/20260620-1.webp",
	 "images/20260620-2.webp",
	 "images/20260620-3.webp",
	 "images/20260620-4.webp",
	 "images/20260620-5.webp",
	    ],
    text: "臭美？绝美！退可萌得钥匙，进可姐得勾人"
  },

"2026-07-22": {
    title: "欠你的一张照片",
    images: ["images/20260722-1.webp",
	 "images/20260722-2.webp",
	 	    ],
    text: "乌漆嘛黑但意外是最好的一张，萌萌的很安心~"
  },

  "2026-07-25": {
    title: "你怎么知道我要吃木屋烧烤",
    image: "images/20260725.webp",
    text: "鸡肫...娃娃菜...香肠...绿豆汤...柠檬茶...啤酒...🤤🤤"
  },

  "2026-08-01": {
    title: "🎀🎂",
    images: ["images/20260801-1.webp",
	 "images/20260801-2.webp",
	  "images/20260801-3.webp",
 	"images/20260801-4.webp",
 	"images/20260801-5.webp",	    ],
    text: "进行一个小小的拆箱吧✔外貌check！✔✔✔"
  },

 "2026-08-08": [
  {
    featured: true,
    title: "给你庆生！",
    images: ["images/20260808-1.webp",
	 "images/20260808-2.webp",
	 "images/20260808-3.webp",
	 "images/20260808-4.webp",
	 "images/20260808-5.webp",
	 "images/20260808-6.webp",
	 "images/20260808-7.webp",
	    ],
    text: "非常之美丽非常之美味的小蛋糕👸和小蛋糕🎂"
  },
  {
    title: "爱你的人会把你拍得很美",
    images: ["images/20260808-8.jpg",
      "images/20260808-9.jpg",
      "images/20260808-10.jpg",
      "images/20260808-11.jpg",
      "images/20260808-12.jpg"
    ],
    text: "所有人欣赏"
  }
 ],

};

// ===============================
// 客厅照片墙沿用原回忆数据（日期仍用于顶部日期跟随）
// ===============================

const START_DATE = new Date("2026-03-31T00:00:00");
const today = new Date();
today.setHours(0, 0, 0, 0);

const timelineList = document.getElementById("timelineList");


// ===============================
// 🚀 照片墙继续沿用缩略图 + IntersectionObserver 按需加载
// 只加载视口附近的图片，避免一打开网站就把几十张照片全部下载。
// ===============================
const timelineImageObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      });
    }, {
      // 提前约一屏开始下载，滑到照片时更容易已经加载完成
      rootMargin: "700px 0px",
      threshold: 0.01
    })
  : null;

function setTimelineImageSource(img, src, immediate = false) {
  if (!img || !src) return;

  const photo = img.closest(".memory-photo");
  if (photo) photo.classList.add("is-loading");

  if (timelineImageObserver) {
    timelineImageObserver.unobserve(img);
  }

  img.removeAttribute("src");
  img.dataset.src = src;

  // 用户主动点了上一张 / 下一张时立即加载，不再等待观察器。
  if (immediate || !timelineImageObserver) {
    img.src = src;
    img.removeAttribute("data-src");
    return;
  }

  timelineImageObserver.observe(img);
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

function formatDateText(dateKey) {
  return dateKey.replace(/-/g, ".");
}
function getMemoryImages(memory) {
  if (!memory) return [];

  if (Array.isArray(memory.images)) {
    return memory.images.filter(Boolean);
  }

  if (memory.image) {
    return [memory.image];
  }

  return [];
}

// 时间轴只加载 480px 左右的缩略图；点击照片后弹窗再加载高清图。
// 这样即使把整条时间轴滑一遍，手机也不会把所有高清照片都下载下来。
function getThumbnailPath(imagePath) {
  if (!imagePath) return "";

  const parts = imagePath.split("/");
  const filename = parts.pop();

  // 当前回忆照片统一放在 images/ 下，缩略图放在 images/thumbs/ 下。
  if (parts.join("/") === "images") {
    return `images/thumbs/${filename}`;
  }

  return imagePath;
}

function getMemoryEntriesInOrder() {
  const entries = [];

  Object.keys(memories)
    .sort((a, b) => new Date(a) - new Date(b))
    .forEach((dateKey) => {
      const rawValue = memories[dateKey];
      const sameDayMemories = Array.isArray(rawValue) ? rawValue : [rawValue];
      const validMemories = sameDayMemories.filter((memory) => memory && typeof memory === 'object');

      validMemories.forEach((memory, sameDayIndex) => {
        entries.push({
          dateKey,
          memory,
          sameDayIndex,
          sameDayCount: validMemories.length
        });
      });
    });

  return entries;
}

const COLLAGE_SKINS = ['cream', 'pink', 'blue'];

function getCollageSkin(memory, featuredIndex) {
  const requested = String(memory?.collage || '').trim().toLowerCase();
  if (COLLAGE_SKINS.includes(requested)) return requested;
  return COLLAGE_SKINS[featuredIndex % COLLAGE_SKINS.length];
}

const PHOTO_WALL_FEATURED_VARIANTS = {
  '2026-03-31': 'featured-card-dots',
  '2026-04-14': 'featured-card-note',
  '2026-05-09': 'featured-card-swag',
  '2026-08-08': 'featured-card-stars'
};

function buildDecoration(tagName = 'span', className = '', text = '') {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  if (text) el.textContent = text;
  el.setAttribute('aria-hidden', 'true');
  return el;
}

function applyPhotoWallFeaturedVariant(card, item, variantName) {
  if (!card || !item || !variantName) return;

  item.classList.add(variantName);
  card.classList.add(variantName);

  if (variantName === 'featured-card-dots') {
    const decor = buildDecoration('div', 'collage-extra-decor collage-dots-decor');
    [
      'dot-solid dot-solid-a',
      'dot-solid dot-solid-b',
      'dot-solid dot-solid-c',
      'dot-solid dot-solid-d',
      'dot-ring dot-ring-a',
      'dot-ring dot-ring-b',
      'dot-grid dot-grid-a',
      'dot-grid dot-grid-b',
      'dot-grid dot-grid-c'
    ].forEach(className => decor.appendChild(buildDecoration('span', className)));
    card.appendChild(decor);
    return;
  }

  if (variantName === 'featured-card-swag') {
    // 这张卡只保留顶部红色胶带；格子底由 CSS 处理，不再生成额外拼贴素材。
    return;
  }

  if (variantName === 'featured-card-stars') {
    const decor = buildDecoration('div', 'collage-extra-decor collage-stars-decor');
    ['star-a', 'star-b', 'star-c', 'star-d'].forEach(className => {
      decor.appendChild(buildDecoration('span', `edge-star ${className}`, '★'));
    });
    card.appendChild(decor);
  }
}

function createTimeline() {
  timelineList.innerHTML = "";

  // Phase 7.5：同一天可以写多条回忆。
  // 一个日期对应对象时保持旧写法；对应数组时，数组从上到下就是照片墙出现顺序。
  const memoryEntries = getMemoryEntriesInOrder();
  let currentWallRow = null;
  let standardCountInRow = 0;
  let wallRowIndex = 0;
  let tapeItemIndex = 0;
  let featuredItemIndex = 0;

  function closeCurrentWallRow() {
    currentWallRow = null;
    standardCountInRow = 0;
  }

  if (memoryEntries.length === 0) {
    timelineList.innerHTML = `
      <div class="empty-timeline">
        还没有添加回忆哦，之后可以在 script.js 的 memories 里面添加。
      </div>
    `;
    return;
  }

  memoryEntries.forEach((entry, index) => {
    const { dateKey, memory, sameDayIndex, sameDayCount } = entry;
    const dateText = formatDateText(dateKey);
    const imageList = getMemoryImages(memory);

    // 默认规则：featured=true → 拼贴挂画卡；只有 1 张图 → 胶带照片；其他 → 拍立得。
    // featured 可以可选写 collage: "cream" / "pink" / "blue"；不写时会按 featured 顺序自动循环。
    // 如果以后某张单图仍想强制做拍立得，可以在该条回忆里写 display: "polaroid"。
    // 也支持 display: "tape" 手动指定胶带照片。
    const useTapeStyle = !memory.featured && (
      memory.display === 'tape' ||
      (imageList.length === 1 && memory.display !== 'polaroid')
    );
    const collageSkin = memory.featured ? getCollageSkin(memory, featuredItemIndex) : '';
    const featuredVariantName = memory.featured ? (PHOTO_WALL_FEATURED_VARIANTS[dateKey] || '') : '';
    if (memory.featured) featuredItemIndex += 1;

    const item = document.createElement("div");
    const tiltClass = `wall-tilt-${index % 6}`;
    const layoutClass = memory.featured ? 'featured collage-item' : (useTapeStyle ? 'taped' : 'standard');
    item.className = `timeline-item photo-wall-item ${layoutClass} ${tiltClass}${collageSkin ? ` collage-${collageSkin}` : ''}`;
    item.dataset.date = dateText;
    item.dataset.memoryKey = dateKey;
    item.dataset.memoryIndex = String(index);
    item.dataset.sameDayIndex = String(sameDayIndex);

    if (sameDayCount > 1) {
      item.classList.add('same-day-memory');
    }

    const node = document.createElement("div");
    node.className = memory.featured
      ? "timeline-node collage-wall-anchor"
      : (useTapeStyle ? "timeline-node photo-tape-strip" : "timeline-node photo-frame-pin");

    const card = document.createElement("article");
    card.className = memory.featured
      ? `memory-card collage-card collage-${collageSkin}`
      : `memory-card photo-frame${useTapeStyle ? " taped-photo-card" : ""}`;

    const date = document.createElement("div");
    date.className = "memory-date";
    date.textContent = dateText;

    // featured 的重要程度直接由拼贴挂画卡本身表达，不再额外显示“特别的一天”徽章。

    const photo = document.createElement("div");
    photo.className = "memory-photo";
    let currentImageIndex = 0;
    let hasSwiped = false;

    if (imageList.length > 0) {
      photo.classList.add("has-image");

      const img = document.createElement("img");
      img.alt = memory.title || dateText;
      img.loading = "lazy";
      img.decoding = "async";
      img.setAttribute("fetchpriority", "low");
      photo.classList.add("is-loading");

      function syncWallItemToLoadedImage() {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const ratio = img.naturalWidth / img.naturalHeight;

        if (memory.featured) {
          item.classList.toggle('collage-landscape', ratio >= 1.18);
          item.classList.toggle('collage-portrait', ratio < 0.86);
          item.classList.toggle('collage-squareish', ratio >= 0.86 && ratio < 1.18);
        }

        if (!memory.featured && !useTapeStyle) {
          photo.style.setProperty('--polaroid-photo-ratio', String(ratio));
          item.classList.toggle("landscape-polaroid", ratio >= 1.16);
          item.classList.toggle("portrait-polaroid", ratio < 1.16);
        }

        if (useTapeStyle) {
          photo.style.setProperty('--taped-photo-ratio', String(ratio));
          item.classList.toggle('tape-landscape', ratio >= 1.18);
          item.classList.toggle('tape-portrait', ratio < 0.86);
          item.classList.toggle('tape-squareish', ratio >= 0.86 && ratio < 1.18);
        }
      }

      function loadTimelineMemoryImage(immediate = false) {
        const fullSrc = imageList[currentImageIndex] || '';
        const thumbSrc = getThumbnailPath(fullSrc);
        img.dataset.fullSrc = fullSrc;
        img.dataset.fallbackTried = '0';
        setTimelineImageSource(img, thumbSrc, immediate);
      }

      img.addEventListener("load", () => {
        photo.classList.remove("is-loading");
        syncWallItemToLoadedImage();
      });

      img.addEventListener("error", () => {
        const fullSrc = String(img.dataset.fullSrc || '');
        const tried = img.dataset.fallbackTried === '1';
        if (!tried && fullSrc) {
          img.dataset.fallbackTried = '1';
          setTimelineImageSource(img, fullSrc, true);
          return;
        }
        photo.classList.remove("is-loading");
      });

      photo.appendChild(img);
      loadTimelineMemoryImage();

      if (imageList.length > 1) {
        photo.classList.add("has-multiple");

        const dots = document.createElement("div");
        dots.className = "slide-dots";

        imageList.forEach((_, dotIndex) => {
          const dot = document.createElement("span");
          dot.className = dotIndex === 0 ? "dot active" : "dot";
          dots.appendChild(dot);
        });

        function updateSlide() {
          loadTimelineMemoryImage(true);
          dots.querySelectorAll(".dot").forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === currentImageIndex);
          });
        }

        function showPrev() {
          currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
          updateSlide();
        }

        function showNext() {
          currentImageIndex = (currentImageIndex + 1) % imageList.length;
          updateSlide();
        }

        dots.querySelectorAll(".dot").forEach((dot, dotIndex) => {
          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            hasSwiped = true;
            currentImageIndex = dotIndex;
            updateSlide();
          });
        });

        let startX = 0;
        let endX = 0;

        photo.addEventListener("touchstart", (e) => {
          startX = e.touches[0].clientX;
          endX = startX;
          hasSwiped = false;
        });

        photo.addEventListener("touchmove", (e) => {
          endX = e.touches[0].clientX;
        });

        photo.addEventListener("touchend", () => {
          const distance = endX - startX;

          if (Math.abs(distance) > 40) {
            hasSwiped = true;
            if (distance > 0) showPrev();
            else showNext();
          } else {
            hasSwiped = false;
          }

          startX = 0;
          endX = 0;
        });

        photo.appendChild(dots);
      }
    } else {
      const empty = document.createElement("div");
      empty.className = "empty-photo";
      empty.innerHTML = "♡<br>等待添加照片";
      photo.appendChild(empty);
    }

    const title = document.createElement("h3");
    title.className = "memory-title";
    title.textContent = memory.title || "这一天的回忆";

    photo.addEventListener("click", () => {
      if (hasSwiped) {
        hasSwiped = false;
        return;
      }

      const currentImage = imageList[currentImageIndex] || "";
      openMemoryModal(dateText, memory, currentImage);
    });

    card.appendChild(date);
    card.appendChild(photo);
    card.appendChild(title);

    if (memory.featured && featuredVariantName) {
      applyPhotoWallFeaturedVariant(card, item, featuredVariantName);
    }

    item.appendChild(node);
    item.appendChild(card);

    if (memory.featured) {
      closeCurrentWallRow();
      timelineList.appendChild(item);
      return;
    }

    if (useTapeStyle) {
      closeCurrentWallRow();
      item.classList.add(tapeItemIndex % 2 === 0 ? 'tape-left' : 'tape-right');
      tapeItemIndex += 1;
      timelineList.appendChild(item);
      return;
    }

    // 同一天有多条时，每一条都单独占自己的时间行，确保“数组上面的先出现、下面的后出现”。
    if (sameDayCount > 1) {
      closeCurrentWallRow();
    }

    if (!currentWallRow || standardCountInRow >= 2) {
      currentWallRow = document.createElement("div");
      currentWallRow.className = `photo-wall-row row-pattern-${wallRowIndex % 4}`;
      currentWallRow.dataset.rowIndex = String(wallRowIndex);
      timelineList.appendChild(currentWallRow);
      wallRowIndex += 1;
      standardCountInRow = 0;
    }

    item.classList.add(standardCountInRow === 0 ? "row-first" : "row-second");
    currentWallRow.appendChild(item);
    standardCountInRow += 1;

    if (standardCountInRow >= 2 || sameDayCount > 1) {
      closeCurrentWallRow();
    }
  });
}
createTimeline();


// ===============================
// 左侧标签跟随当前时间轴坐标变化
// ===============================

const currentMemoryDate = document.getElementById("currentMemoryDate");

function updateDateTag() {
  if (!memoryPage.classList.contains("active")) return;

  const items = document.querySelectorAll(".timeline-item");
  const checkY = window.innerHeight * 0.48;

  let nearestItem = null;
  let nearestDistance = Infinity;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - checkY);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestItem = item;
    }
  });

  if (nearestItem) {
    const currentDate = nearestItem.dataset.date;

    if (currentMemoryDate && currentMemoryDate.textContent !== currentDate) {
  currentMemoryDate.classList.remove("flip-up");

  // 强制刷新动画状态
  void currentMemoryDate.offsetWidth;

  currentMemoryDate.textContent = currentDate;
  currentMemoryDate.classList.add("flip-up");
}
  }
}

window.addEventListener("scroll", updateDateTag);
window.addEventListener("resize", updateDateTag);
updateDateTag()
if (currentMemoryDate) {
  currentMemoryDate.addEventListener("animationend", () => {
    currentMemoryDate.classList.remove("flip-up");
  });
};


// ===============================
// 弹窗逻辑
// ===============================

const memoryModal = document.getElementById("memoryModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalText = document.getElementById("modalText");
const modalMask = document.querySelector(".modal-mask");

function openMemoryModal(dateText, memory, currentImage = "") {
  modalDate.textContent = dateText;

  if (memory) {
    modalTitle.textContent = memory.modalTitle || memory.title || "这一天的回忆";
    modalText.textContent = memory.text || "这里还没有写下具体记录。";

    const imageList = getMemoryImages(memory);
    const imageToShow = currentImage || imageList[0] || "";

    if (imageToShow) {
      modalImg.src = imageToShow;
     modalImg.style.display = "block";
    } else {
      modalImg.removeAttribute("src");
      modalImg.style.display = "none";
    }
  } else {
    modalTitle.textContent = "这一天的回忆";
    modalText.textContent = "这里还没有添加内容。";
    modalImg.removeAttribute("src");
    modalImg.style.display = "none";
  }

  memoryModal.classList.add("show");
}

function closeMemoryModal() {
  memoryModal.classList.remove("show");
}

closeModalBtn.addEventListener("click", closeMemoryModal);
modalMask.addEventListener("click", closeMemoryModal);
// ===============================
// 音乐播放器
// ===============================

// 这里填写你的音乐和封面路径
// 建议你新建一个 music 文件夹，里面放音乐和封面
const musicList = [
  {
    title: "小狗侦探",
    cover: "music/小狗侦探.jpg",
    src: "music/小狗侦探.mp3"
  },
  {
    title: "你说话的声音好细",
    cover: "music/你说话的声音好细.jpg",
    src: "music/你说话的声音好细.mp3"
  },
  {
    title: "love you so much",
    cover: "music/loveyousomuch.jpg",
    src: "music/loveyousomuch.mp3"
  },
  {
    title: "玻璃",
    cover: "music/玻璃.jpg",
    src: "music/玻璃.mp3"
  }
];

const musicPlayerBtn = document.getElementById("musicPlayerBtn");
const playerDisc = document.getElementById("playerDisc");
const musicPanel = document.getElementById("musicPanel");
const closeMusicPanelBtn = document.getElementById("closeMusicPanelBtn");
const musicPanelMask = document.querySelector(".music-panel-mask");
const albumList = document.getElementById("albumList");
const bgMusic = document.getElementById("bgMusic");

let currentMusicIndex = -1;

function createAlbumList() {
  albumList.innerHTML = "";

  musicList.forEach((music, index) => {
    const item = document.createElement("button");
    item.className = "album-item";
    item.type = "button";

    item.innerHTML = `
      <div class="album-cover">
        <img src="${music.cover}" alt="${music.title}" loading="lazy" decoding="async">
      </div>
      <div class="album-title">${music.title}</div>
    `;

    item.addEventListener("click", () => {
      playMusic(index);
    });

    albumList.appendChild(item);
  });
}

function playMusic(index) {
  const music = musicList[index];
  const isCurrent = index === currentMusicIndex && Boolean(bgMusic.src);

  // 弹窗里正在旋转的同一张唱片：再点一次 = 暂停。
  // 弹窗保持打开，让“停止旋转”这个反馈能直接看到。
  if (isCurrent && !bgMusic.paused) {
    bgMusic.pause();
    updateActiveAlbum();
    return;
  }

  // 已暂停的同一张唱片：从当前位置继续。
  if (isCurrent && bgMusic.paused) {
    bgMusic.play().catch((error) => console.warn('[唱片机] 继续播放失败：', error));
    updateActiveAlbum();
    closeMusicPanel();
    return;
  }

  // 选择另一张唱片：切歌并从头播放。
  currentMusicIndex = index;
  bgMusic.src = music.src;
  bgMusic.loop = true;
  bgMusic.play().catch((error) => console.warn('[唱片机] 播放失败：', error));

  playerDisc.classList.remove("empty");
  playerDisc.innerHTML = `<img src="${music.cover}" alt="${music.title}">`;

  updateActiveAlbum();
  closeMusicPanel();
}

function updateActiveAlbum() {
  const albumItems = document.querySelectorAll(".album-item");
  const isPlaying = Boolean(bgMusic && !bgMusic.paused && !bgMusic.ended);

  albumItems.forEach((item, index) => {
    const isCurrent = index === currentMusicIndex;
    item.classList.toggle("active", isCurrent);
    item.classList.toggle("playing", isCurrent && isPlaying);
    item.setAttribute("aria-pressed", isCurrent && isPlaying ? "true" : "false");
  });
}

function openMusicPanel() {
  musicPanel.classList.add("show");
  updateActiveAlbum();
}

function closeMusicPanel() {
  musicPanel.classList.remove("show");
}

// 右上角“唱片机”只负责打开唱片选择弹窗，不承担暂停。
musicPlayerBtn.addEventListener("click", openMusicPanel);
closeMusicPanelBtn.addEventListener("click", closeMusicPanel);
musicPanelMask.addEventListener("click", closeMusicPanel);

bgMusic.addEventListener("pause", () => {
  musicPlayerBtn.classList.remove("playing");
  updateActiveAlbum();
});

bgMusic.addEventListener("play", () => {
  musicPlayerBtn.classList.add("playing");
  updateActiveAlbum();
});

bgMusic.addEventListener("ended", updateActiveAlbum);

createAlbumList();
// ===============================
// 🆕 新增：恋爱天数正数计时器
// ===============================
function updateLoveDays() {
  // 设置你们在一起的纪念日：2026年5月9日
  const START_DATE = new Date("2026-05-09T00:00:00");
  const today = new Date();
  
  // 统一把时间戳的小时、分钟、秒清零，确保按整天计算
  const start = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // 计算毫秒差并转换成天数
  const timeDiff = current.getTime() - start.getTime();
  // Math.floor 后 +1 代表在一起的当天算作第 1 天
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  
  // 将计算好的天数写入页面
  const loveDaysEl = document.getElementById("loveDays");
  if (loveDaysEl) {
    loveDaysEl.textContent = daysDiff;
  }
}

// 页面加载完成后立即自动执行一次
updateLoveDays();
// ===============================
// 🐶 小狗摇晃及弹出气泡逻辑（兼容手机与电脑）
// ===============================
document.querySelectorAll('.dog-container').forEach(dog => {
  let timer = null;

  // 编写一个统一的触发函数
  function triggerDogSticker(e) {
    e.preventDefault();  // 阻止手机端的300ms点击延迟和穿透
    e.stopPropagation(); // 阻止事件冒泡

    const bubble = dog.querySelector('.dog-bubble');
    const img = dog.querySelector('.sticker-img');

    // 1. 触发摇晃动画
    img.classList.remove('dog-shake');
    void img.offsetWidth; // 触发浏览器重绘
    img.classList.add('dog-shake');

    // 2. 显示气泡
    bubble.classList.add('show');

    // 3. 倒计时 2.5 秒后关闭气泡
    clearTimeout(timer);
    timer = setTimeout(() => {
      bubble.classList.remove('show');
    }, 2500);
  }

  // 📱 监听手机端手指触摸事件
  dog.addEventListener('touchstart', triggerDogSticker, { passive: false });
  
  // 💻 监听电脑端鼠标点击事件
  dog.addEventListener('click', triggerDogSticker);
});
// ==========================================
// 客厅 ↔ 卧室 / 厨房 页面切换
// ==========================================
const aboutPageEl = document.getElementById("aboutPage");
const kitchenPageEl = document.getElementById("kitchenPage");
const memoryPageEl = document.getElementById("memoryPage");
const enterBedroomBtn = document.getElementById("enterBedroomBtn");
const enterKitchenBtn = document.getElementById("enterKitchenBtn");
const backToMemoryBtnEl = document.getElementById("backToMemoryBtn");
const backToMemoryFromKitchenBtnEl = document.getElementById("backToMemoryFromKitchenBtn");
const livingRoomBottomTarget = document.querySelector(".kitchen-entry-wrap");

function openBedroomPage(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!aboutPageEl || !memoryPageEl) return;

  memoryPageEl.classList.remove("active");
  kitchenPageEl?.classList.remove("active");
  aboutPageEl.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });

  if (typeof refreshCloudTodos === "function") {
    refreshCloudTodos({ silent: true });
  }
}

function openKitchenPage(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!kitchenPageEl || !memoryPageEl) return;

  memoryPageEl.classList.remove("active");
  aboutPageEl?.classList.remove("active");
  kitchenPageEl.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });

  if (typeof refreshCloudEatenPlaces === "function") {
    refreshCloudEatenPlaces({ silent: true });
  }
}

function scrollLivingRoomToBottom() {
  if (livingRoomBottomTarget) {
    livingRoomBottomTarget.scrollIntoView({ behavior: "auto", block: "end" });
  } else {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "auto" });
  }
  if (typeof updateDateTag === "function") updateDateTag();
}

function returnToLivingRoom(pageEl) {
  pageEl?.classList.remove("active");
  memoryPageEl?.classList.add("active");

  // 从卧室 / 厨房返回时固定落到客厅最下面。
  // 首次切页后滚一次，毛毡板同步可能更新布局，再补一次保证 iPhone Safari / PWA 位置稳定。
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(scrollLivingRoomToBottom);
  });
  window.setTimeout(scrollLivingRoomToBottom, 180);

  if (typeof refreshCloudMessages === "function") {
    refreshCloudMessages({ silent: true });
  }
}

enterBedroomBtn?.addEventListener("click", openBedroomPage);
enterKitchenBtn?.addEventListener("click", openKitchenPage);
backToMemoryBtnEl?.addEventListener("click", () => returnToLivingRoom(aboutPageEl));
backToMemoryFromKitchenBtnEl?.addEventListener("click", () => returnToLivingRoom(kitchenPageEl));

// ==========================================
// 卧室 / 厨房页面交互逻辑
// ==========================================

// 1. 吃喝雷达：好吃 / 不好吃 / 已吃
const tabLike = document.getElementById("tabLike");
const tabDislike = document.getElementById("tabDislike");
const tabEaten = document.getElementById("tabEaten");
const likeContent = document.getElementById("likeContent");
const dislikeContent = document.getElementById("dislikeContent");
const eatenContent = document.getElementById("eatenContent");

function switchFoodTab(target) {
  const tabs = [
    [tabLike, likeContent, 'like'],
    [tabDislike, dislikeContent, 'dislike'],
    [tabEaten, eatenContent, 'eaten']
  ];

  tabs.forEach(([tab, content, name]) => {
    const active = name === target;
    tab?.classList.toggle('active', active);
    content?.classList.toggle('active', active);
  });

  if (target === 'eaten' && typeof refreshCloudEatenPlaces === 'function') {
    refreshCloudEatenPlaces({ silent: true });
  }
}

tabLike?.addEventListener('click', () => switchFoodTab('like'));
tabDislike?.addEventListener('click', () => switchFoodTab('dislike'));
tabEaten?.addEventListener('click', () => switchFoodTab('eaten'));

// 2. 宝藏私房榜卡片 3D 翻转
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// 3. 卧室：约定册默认直接展开。
// 约定本身的 PostgreSQL 同步 / 新建 / 勾选 / 删除逻辑继续沿用下方原实现。

// ==========================================
// 4. 两个人的小屋云同步：约定 + 客厅毛毡板（Phase 6）
// ==========================================
// CloudBase PostgreSQL 继续用轻量轮询保持两台设备同步：
// - 卧室：共同约定可以打勾、新建、删除；
// - 客厅：毛毡板支持文字 / 图片 / 语音便利贴，可查看详情和删除；
// - 文字与元数据保存在 PostgreSQL；图片 / 语音保存在 CloudBase PG 云存储；
// - “我 / TA”仍只用每台设备长期保存的 deviceId 区分，不改变访问提醒逻辑。

const homeMailboxBtn = document.getElementById('homeMailboxBtn');
const homeMailboxBadge = document.getElementById('homeMailboxBadge');
const homeMailboxHint = document.getElementById('homeMailboxHint');
const mailboxModal = document.getElementById('mailboxModal');
const closeMailboxBtn = document.getElementById('closeMailboxBtn');
const mailboxSyncBar = document.getElementById('mailboxSyncBar');
const mailboxSyncText = document.getElementById('mailboxSyncText');
const mailboxInbox = document.getElementById('mailboxInbox');
const mailboxTabs = [...document.querySelectorAll('[data-mailbox-tab]')];
const mailboxPanels = [...document.querySelectorAll('[data-mailbox-panel]')];
const letterForm = document.getElementById('letterForm');
const letterOccasion = document.getElementById('letterOccasion');
const letterBody = document.getElementById('letterBody');
const letterCounter = document.getElementById('letterCounter');
const letterSendBtn = document.getElementById('letterSendBtn');
const letterSendStatus = document.getElementById('letterSendStatus');
const letterReaderModal = document.getElementById('letterReaderModal');
const closeLetterReaderBtn = document.getElementById('closeLetterReaderBtn');
const letterReaderDoneBtn = document.getElementById('letterReaderDoneBtn');
const letterReaderOccasion = document.getElementById('letterReaderOccasion');
const letterReaderBody = document.getElementById('letterReaderBody');
const letterReaderMeta = document.getElementById('letterReaderMeta');

const todoList = document.getElementById('todoList');
const todoSyncBar = document.getElementById('todoSyncBar');
const todoSyncText = document.getElementById('todoSyncText');
const copyCloudUidBtn = document.getElementById('copyCloudUidBtn');
const todoCreateForm = document.getElementById('todoCreateForm');
const todoCreateInput = document.getElementById('todoCreateInput');
const todoCreateBtn = document.getElementById('todoCreateBtn');

const messageBoard = document.getElementById('messageBoard');
const messageList = document.getElementById('messageList');
const messageSyncBar = document.getElementById('messageSyncBar');
const messageSyncText = document.getElementById('messageSyncText');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messageSendBtn = document.getElementById('messageSendBtn');
const messageCounter = document.getElementById('messageCounter');
const messageModeButtons = [...document.querySelectorAll('[data-message-mode]')];
const messagePanels = [...document.querySelectorAll('[data-message-panel]')];
const messageImageInput = document.getElementById('messageImageInput');
const messageImagePreviewWrap = document.getElementById('messageImagePreviewWrap');
const messageImagePreview = document.getElementById('messageImagePreview');
const messageImageStatus = document.getElementById('messageImageStatus');
const messageImageSendBtn = document.getElementById('messageImageSendBtn');
const voiceRecordTitle = document.getElementById('voiceRecordTitle');
const voiceRecordStatus = document.getElementById('voiceRecordStatus');
const voiceRecordBtn = document.getElementById('voiceRecordBtn');
const voiceSendBtn = document.getElementById('voiceSendBtn');
const voicePreview = document.getElementById('voicePreview');

const stickyNoteModal = document.getElementById('stickyNoteModal');
const closeStickyNoteModalBtn = document.getElementById('closeStickyNoteModalBtn');
const stickyNoteModalMeta = document.getElementById('stickyNoteModalMeta');
const stickyNoteModalContent = document.getElementById('stickyNoteModalContent');
const stickyNoteDeleteBtn = document.getElementById('stickyNoteDeleteBtn');
const stickyNoteDeleteHint = document.getElementById('stickyNoteDeleteHint');

const todoDeleteModal = document.getElementById('todoDeleteModal');
const todoDeleteText = document.getElementById('todoDeleteText');
const todoDeleteCancelBtn = document.getElementById('todoDeleteCancelBtn');
const todoDeleteConfirmBtn = document.getElementById('todoDeleteConfirmBtn');

const eatenSyncBar = document.getElementById('eatenSyncBar');
const eatenSyncText = document.getElementById('eatenSyncText');
const eatenCreateForm = document.getElementById('eatenCreateForm');
const eatenTextInput = document.getElementById('eatenTextInput');
const eatenCounter = document.getElementById('eatenCounter');
const eatenImageInput = document.getElementById('eatenImageInput');
const eatenImagePreviewWrap = document.getElementById('eatenImagePreviewWrap');
const eatenImagePreview = document.getElementById('eatenImagePreview');
const eatenImageClearBtn = document.getElementById('eatenImageClearBtn');
const eatenUploadStatus = document.getElementById('eatenUploadStatus');
const eatenSaveBtn = document.getElementById('eatenSaveBtn');
const eatenPlacesList = document.getElementById('eatenPlacesList');

const eatenDetailModal = document.getElementById('eatenDetailModal');
const closeEatenDetailBtn = document.getElementById('closeEatenDetailBtn');
const eatenDetailPhotoWrap = document.getElementById('eatenDetailPhotoWrap');
const eatenDetailPhoto = document.getElementById('eatenDetailPhoto');
const eatenDetailTitle = document.getElementById('eatenDetailTitle');
const eatenDetailMeta = document.getElementById('eatenDetailMeta');
const eatenDetailText = document.getElementById('eatenDetailText');
const eatenDetailDeleteBtn = document.getElementById('eatenDetailDeleteBtn');
const eatenDetailDeleteHint = document.getElementById('eatenDetailDeleteHint');

let cloudTodoApp = null;
let cloudTodoDb = null;
let cloudTodoUid = '';
let cloudTodoReady = false;
let cloudHomePollingTimer = null;
let cloudTodoRefreshing = false;
let cloudMessageRefreshing = false;
let cloudTodoLastFingerprint = '';
let cloudMessageLastFingerprint = '';
let cloudTodoRowsCache = [];
let cloudMessageRowsCache = [];
let cloudMessageRowsById = new Map();
let messageMode = 'text';
let pendingImageFile = null;
let pendingImagePreviewUrl = '';
let pendingVoiceBlob = null;
let pendingVoicePreviewUrl = '';
let pendingVoiceDuration = 0;
let voiceMediaRecorder = null;
let voiceMediaStream = null;
let voiceChunks = [];
let voiceRecordStartedAt = 0;
let openedStickyMessageId = '';
let stickyDeleteArmed = false;
let pendingTodoDeleteId = '';
let cloudMessageSchemaReady = true;
const messageMediaUrlCache = new Map();

let cloudLetterRefreshing = false;
let cloudLetterLastFingerprint = '';
let cloudLetterRowsCache = [];
let cloudLetterRowsById = new Map();
let mailboxActiveTab = 'inbox';
let openedLetterId = '';

let cloudEatenRefreshing = false;
let cloudEatenTableReady = false;
let cloudEatenLastFingerprint = '';
let cloudEatenRowsCache = [];
let pendingEatenImageFile = null;
let pendingEatenImagePreviewUrl = '';
const eatenImageUrlCache = new Map();
let cloudEatenRowsById = new Map();
let openedEatenPlaceId = '';
let eatenDeleteArmed = false;

function setMailboxSyncStatus(state, text) {
  if (mailboxSyncBar) mailboxSyncBar.dataset.state = state;
  if (mailboxSyncText) mailboxSyncText.textContent = text;
}

function setMailboxComposerEnabled(enabled) {
  if (letterOccasion) letterOccasion.disabled = !enabled;
  if (letterBody) letterBody.disabled = !enabled;
  if (letterSendBtn) letterSendBtn.disabled = !enabled || !String(letterBody?.value || '').trim();
}

function formatLetterDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${d} ${hh}:${mm}`;
}

function fingerprintLetterRows(rows = []) {
  return rows
    .map((row) => `${row.id}:${row.created_by || ''}:${row.created_at || ''}:${row.opened_by || ''}:${row.opened_at || ''}:${row.occasion || ''}:${row.body || ''}`)
    .join('|');
}

function updateMailboxBadge(rows = cloudLetterRowsCache) {
  const incoming = rows.filter((row) => String(row.created_by || '') !== String(cloudTodoUid || ''));
  const unread = incoming.filter((row) => !row.opened_at).length;

  if (homeMailboxBadge) {
    homeMailboxBadge.hidden = unread <= 0;
    homeMailboxBadge.textContent = unread > 9 ? '9+' : String(unread || '');
    homeMailboxBadge.setAttribute('aria-label', unread > 0 ? `有 ${unread} 封新信` : '当前没有新信');
  }
  homeMailboxBtn?.classList.toggle('has-new-letter', unread > 0);

  if (homeMailboxHint) {
    homeMailboxHint.textContent = unread > 0
      ? `信箱举起了红旗，有 ${unread} 封新信 ♡`
      : '信箱安安静静的，等下一封信来';
  }
}

function switchMailboxTab(tab) {
  mailboxActiveTab = tab === 'write' ? 'write' : 'inbox';
  mailboxTabs.forEach((button) => {
    const active = button.dataset.mailboxTab === mailboxActiveTab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  mailboxPanels.forEach((panel) => {
    const active = panel.dataset.mailboxPanel === mailboxActiveTab;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

function createMailboxLetterItem(row) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `mailbox-letter-item${row.opened_at ? ' opened' : ' unread'}`;
  button.dataset.letterId = String(row.id || '');

  const envelope = document.createElement('span');
  envelope.className = 'mailbox-letter-envelope';
  envelope.textContent = row.opened_at ? '💌' : '✉️';

  const copy = document.createElement('span');
  copy.className = 'mailbox-letter-copy';

  const occasion = document.createElement('strong');
  occasion.textContent = String(row.occasion || '给你的一封信');

  const meta = document.createElement('small');
  meta.textContent = row.opened_at
    ? `${formatLetterDate(row.created_at)} · 已拆`
    : `${formatLetterDate(row.created_at)} · 等你拆开`;

  copy.append(occasion, meta);

  const seal = document.createElement('span');
  seal.className = 'mailbox-letter-seal';
  seal.textContent = row.opened_at ? '♡' : 'NEW';

  button.append(envelope, copy, seal);
  return button;
}

function renderMailboxLetters(rows = []) {
  if (!mailboxInbox) return;

  const incoming = rows
    .filter((row) => String(row.created_by || '') !== String(cloudTodoUid || ''))
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  mailboxInbox.innerHTML = '';
  if (!incoming.length) {
    const empty = document.createElement('div');
    empty.className = 'mailbox-empty';
    empty.innerHTML = '信箱现在空空的。<br><span>也许下一封会在某个普通日子突然出现 ♡</span>';
    mailboxInbox.appendChild(empty);
    return;
  }

  incoming.forEach((row) => mailboxInbox.appendChild(createMailboxLetterItem(row)));
}

function openMailboxModal() {
  if (!mailboxModal) return;
  mailboxModal.classList.add('show');
  mailboxModal.setAttribute('aria-hidden', 'false');
  switchMailboxTab('inbox');
  refreshCloudLetters({ silent: true });
}

function closeMailboxModal() {
  mailboxModal?.classList.remove('show');
  mailboxModal?.setAttribute('aria-hidden', 'true');
}

function closeLetterReader() {
  openedLetterId = '';
  letterReaderModal?.classList.remove('show');
  letterReaderModal?.setAttribute('aria-hidden', 'true');
}

async function markLetterOpened(row) {
  if (!row || row.opened_at || !cloudTodoReady || !cloudTodoDb || !cloudTodoUid) return;
  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.letterTable || 'couple_letters').trim();

  try {
    await updateLetterOpenedWithRestFallback(
      tableName,
      String(row.id || ''),
      {
        opened_by: String(cloudTodoUid),
        opened_at: new Date().toISOString()
      }
    );
    cloudLetterLastFingerprint = '';
    await refreshCloudLetters({ silent: true });
  } catch (error) {
    console.error('[大门信箱] 标记已读失败：', error);
    setMailboxSyncStatus('error', '信已经拆开了，但“已读”状态暂时没同步成功');
  }
}

async function openLetterReader(row) {
  if (!row || !letterReaderModal) return;
  if (String(row.created_by || '') === String(cloudTodoUid || '')) return;

  openedLetterId = String(row.id || '');
  if (letterReaderOccasion) letterReaderOccasion.textContent = String(row.occasion || '给你的一封信');
  if (letterReaderBody) letterReaderBody.textContent = String(row.body || '');
  if (letterReaderMeta) letterReaderMeta.textContent = `TA 写于 ${formatLetterDate(row.created_at)}`;

  letterReaderModal.classList.add('show');
  letterReaderModal.setAttribute('aria-hidden', 'false');

  if (!row.opened_at) await markLetterOpened(row);
}

async function refreshCloudLetters({ silent = false } = {}) {
  if (!cloudTodoReady || !cloudTodoDb || cloudLetterRefreshing || !homeMailboxBtn) return;

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.letterTable || 'couple_letters').trim();
  cloudLetterRefreshing = true;

  try {
    const { data, error } = await cloudTodoDb
      .from(tableName)
      .select('id,body,occasion,created_by,created_at,opened_by,opened_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const fingerprint = fingerprintLetterRows(rows);
    cloudLetterRowsCache = rows.slice();
    cloudLetterRowsById = new Map(rows.map((row) => [String(row.id || ''), row]));

    if (fingerprint !== cloudLetterLastFingerprint) {
      renderMailboxLetters(rows);
      updateMailboxBadge(rows);
      cloudLetterLastFingerprint = fingerprint;
    } else {
      updateMailboxBadge(rows);
    }

    if (!silent) {
      const unread = rows.filter((row) => String(row.created_by || '') !== String(cloudTodoUid || '') && !row.opened_at).length;
      setMailboxSyncStatus('online', unread > 0 ? `信箱里有 ${unread} 封新信 ♡` : '信箱已经看过啦，现在没有未拆的新信');
    } else if (mailboxSyncBar?.dataset.state !== 'online') {
      setMailboxSyncStatus('online', '信箱已同步');
    }
  } catch (error) {
    console.error('[大门信箱] 读取失败：', error);
    setMailboxSyncStatus('error', '信箱暂时没有连上，请先执行 Phase 7 信箱 SQL');
    if (mailboxInbox && !mailboxInbox.querySelector('.mailbox-letter-item')) {
      mailboxInbox.innerHTML = '<div class="mailbox-empty">信箱暂时打不开，先检查 Phase 7 SQL 是否执行成功。</div>';
    }
  } finally {
    cloudLetterRefreshing = false;
  }
}

async function callCloudRdbRest(tableName, { method = 'GET', body = null, query = '' } = {}) {
  const config = window.LOVE_HOUSE_CLOUD || {};
  const envId = String(config.envId || '').trim();
  const publishableKey = String(config.publishableKey || '').trim();

  if (!envId) throw new Error('缺少 CloudBase 环境 ID');
  if (!publishableKey) throw new Error('缺少 CloudBase Publishable Key');

  const safeTable = encodeURIComponent(String(tableName || '').trim());
  const suffix = query ? `?${query}` : '';
  const url = `https://${envId}.api.tcloudbasegateway.com/v1/rdb/rest/${safeTable}${suffix}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${publishableKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: body == null ? undefined : JSON.stringify(body),
    cache: 'no-store'
  });

  const raw = await response.text();
  let payload = null;
  if (raw) {
    try { payload = JSON.parse(raw); }
    catch (_) { payload = { message: raw }; }
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || payload?.hint || `${response.status} ${response.statusText}`.trim();
    const error = new Error(`CloudBase 数据库请求失败：${message}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function insertLetterWithRestFallback(tableName, row) {
  // iPhone PWA 上 CloudBase SDK insert() 偶发 TypeError: Load failed。
  // 信箱写入优先走官方 PostgREST HTTP API；Publishable Key / GRANT / RLS 仍完全相同。
  try {
    await callCloudRdbRest(tableName, { method: 'POST', body: row });
    return;
  } catch (restError) {
    console.warn('[大门信箱] REST 投递失败，尝试 SDK 回退：', restError);

    // 如果请求其实已经到达云端，只是 Safari 没拿到响应，不重复写同一个主键。
    try {
      const { data } = await cloudTodoDb
        .from(tableName)
        .select('id')
        .eq('id', String(row.id || ''))
        .limit(1);
      if (Array.isArray(data) && data.some((item) => String(item.id || '') === String(row.id || ''))) return;
    } catch (_) {}

    const result = await cloudTodoDb.from(tableName).insert(row);
    if (result?.error) throw result.error;
  }
}

async function updateLetterOpenedWithRestFallback(tableName, rowId, values) {
  const query = new URLSearchParams({ id: `eq.${String(rowId || '')}` }).toString();

  try {
    await callCloudRdbRest(tableName, { method: 'PATCH', query, body: values });
    return;
  } catch (restError) {
    console.warn('[大门信箱] REST 已读同步失败，尝试 SDK 回退：', restError);
    const result = await cloudTodoDb
      .from(tableName)
      .update(values)
      .eq('id', String(rowId || ''));
    if (result?.error) throw result.error;
  }
}

async function sendCloudLetter(body, occasion) {
  const cleanBody = String(body || '').trim();
  const cleanOccasion = String(occasion || '平常的一天').trim().slice(0, 30) || '平常的一天';
  if (!cleanBody) return;

  if (!cloudTodoReady || !cloudTodoDb || !cloudTodoUid) {
    if (letterSendStatus) letterSendStatus.textContent = '信箱还没连上云端，等一下再试。';
    return;
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.letterTable || 'couple_letters').trim();
  if (letterSendBtn) letterSendBtn.disabled = true;
  if (letterSendStatus) letterSendStatus.textContent = '正在把信塞进大门信箱…';

  try {
    const row = {
      id: makeCloudId('letter').slice(0, 80),
      body: cleanBody.slice(0, 1200),
      occasion: cleanOccasion,
      created_by: String(cloudTodoUid)
    };

    await insertLetterWithRestFallback(tableName, row);

    if (letterBody) letterBody.value = '';
    if (letterCounter) letterCounter.textContent = '0 / 1200';
    if (letterSendStatus) letterSendStatus.textContent = '已经投递 ♡ 这台设备不会在收信页显示正文，等 TA 来拆。';
    cloudLetterLastFingerprint = '';
    await refreshCloudLetters({ silent: true });
  } catch (error) {
    console.error('[大门信箱] 投递失败：', error);
    if (letterSendStatus) letterSendStatus.textContent = `没有投递成功：${String(error?.message || error || '未知错误')}`;
  } finally {
    if (letterSendBtn) letterSendBtn.disabled = !String(letterBody?.value || '').trim();
  }
}

function setTodoSyncStatus(state, text) {
  if (todoSyncBar) todoSyncBar.dataset.state = state;
  if (todoSyncText) todoSyncText.textContent = text;
}

function setMessageSyncStatus(state, text) {
  if (messageSyncBar) messageSyncBar.dataset.state = state;
  if (messageSyncText) messageSyncText.textContent = text;
}

function setEatenSyncStatus(state, text) {
  if (eatenSyncBar) eatenSyncBar.dataset.state = state;
  if (eatenSyncText) eatenSyncText.textContent = text;
}

function updateEatenSaveState() {
  const hasText = Boolean(String(eatenTextInput?.value || '').trim());
  if (eatenSaveBtn) eatenSaveBtn.disabled = !cloudTodoReady || !cloudEatenTableReady || !hasText;
}

function setEatenComposerEnabled(enabled) {
  if (eatenTextInput) eatenTextInput.disabled = !enabled;
  if (eatenImageInput) eatenImageInput.disabled = !enabled;
  if (!enabled && eatenSaveBtn) eatenSaveBtn.disabled = true;
  if (enabled) updateEatenSaveState();
}

function setCloudComposerEnabled(enabled) {
  setMailboxComposerEnabled(Boolean(enabled));
  if (todoCreateInput) todoCreateInput.disabled = !enabled;
  if (todoCreateBtn) todoCreateBtn.disabled = !enabled;
  if (messageInput) messageInput.disabled = !enabled;
  if (messageSendBtn) messageSendBtn.disabled = !enabled;
  messageModeButtons.forEach((button) => { button.disabled = !enabled; });
  if (messageImageInput) messageImageInput.disabled = !enabled;
  if (messageImageSendBtn) messageImageSendBtn.disabled = !enabled || !pendingImageFile;
  if (voiceRecordBtn) voiceRecordBtn.disabled = !enabled;
  if (voiceSendBtn) voiceSendBtn.disabled = !enabled || !pendingVoiceBlob;
  setEatenComposerEnabled(Boolean(enabled && cloudEatenTableReady));
}

function makeCloudId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
}

function setTodoVisual(item, done) {
  if (!item) return;

  const checkbox = item.querySelector('.checkbox');
  item.classList.toggle('done', Boolean(done));
  item.setAttribute('aria-pressed', done ? 'true' : 'false');

  if (checkbox) {
    checkbox.innerHTML = done ? '✔' : '';
    checkbox.classList.toggle('checked', Boolean(done));
  }
}

function createTodoElement(row) {
  const item = document.createElement('div');
  item.className = `todo-item${row.done ? ' done' : ''}`;
  item.dataset.todoId = String(row.id || '');
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.setAttribute('aria-pressed', row.done ? 'true' : 'false');

  const checkbox = document.createElement('span');
  checkbox.className = `checkbox${row.done ? ' checked' : ''}`;
  checkbox.textContent = row.done ? '✔' : '';

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = String(row.title || '新的约定');

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo-delete-btn';
  deleteBtn.type = 'button';
  deleteBtn.dataset.todoDelete = String(row.id || '');
  deleteBtn.setAttribute('aria-label', `删除约定：${String(row.title || '新的约定')}`);
  deleteBtn.textContent = '';

  item.append(checkbox, text, deleteBtn);
  return item;
}

function renderCloudTodos(rows = []) {
  if (!todoList) return;

  cloudTodoRowsCache = rows.slice();
  todoList.innerHTML = '';

  if (rows.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'todo-empty';
    empty.textContent = '还没有约定，写下第一件想一起完成的事吧 ♡';
    todoList.appendChild(empty);
    return;
  }

  rows.forEach((row) => todoList.appendChild(createTodoElement(row)));
}

function fingerprintTodoRows(rows = []) {
  return rows
    .map((row) => `${row.id}:${row.title || ''}:${row.done ? 1 : 0}:${row.updated_at || ''}`)
    .join('|');
}

function formatMessageTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  if (sameDay) return `${hh}:${mm}`;
  return `${date.getMonth() + 1}.${date.getDate()} ${hh}:${mm}`;
}

function formatVoiceDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const mm = Math.floor(total / 60);
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function getMessageContentType(row) {
  const type = String(row?.content_type || 'text').toLowerCase();
  return ['text', 'image', 'audio'].includes(type) ? type : 'text';
}

function getBoardStorageConfig() {
  const config = window.LOVE_HOUSE_CLOUD || {};
  return {
    bucket: String(config.messageStorageBucket || 'love-house-board').trim() || 'love-house-board'
  };
}

function getBoardStorageClient() {
  const storage = cloudTodoApp?.storage;

  if (!storage || typeof storage.from !== 'function') {
    throw new Error('当前 CloudBase SDK 没有可用的 PG 云存储模块');
  }

  // Phase 6.2：毛毡板使用的是 PostgreSQL 原生 Bucket。
  // 这套 app.storage.from(bucketId) / listBuckets() 能力属于 CloudBase JS SDK v3。
  // 如果用户只替换了 script.js、仍加载旧 v2 SDK，就直接给出明确提示，
  // 不再让旧 SDK 把 Publishable Key 当成 legacy access token 后报 INVALID_ACCESS_TOKEN。
  if (typeof storage.listBuckets !== 'function') {
    throw new Error('CloudBase SDK 版本过旧，请同时部署 Phase 6.2 的 index.html');
  }

  return storage.from(getBoardStorageConfig().bucket);
}

function formatBoardStorageError(error, fallback = '云存储暂时不可用') {
  const raw = String(error?.message || error || '').trim();

  if (/INVALID_ACCESS_TOKEN|JsonWebTokenError|signing key|Unable to find a signing key/i.test(raw)) {
    return '云存储连接使用了旧版 SDK，请刷新到最新小屋版本后再试';
  }

  if (/SDK 版本过旧/i.test(raw)) return raw;
  if (/permission|denied|unauthorized|rls|403/i.test(raw)) {
    return '云存储权限暂时没有通过，请检查毛毡板 Storage Policy';
  }

  return raw || fallback;
}

async function getMessageMediaUrl(row) {
  const path = String(row?.media_path || '').trim();
  const fileId = String(row?.media_file_id || '').trim();
  if (!path && !fileId) return '';

  const cacheKey = `${getBoardStorageConfig().bucket}:${fileId || path}`;
  const cached = messageMediaUrlCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const bucket = getBoardStorageClient();
  const candidates = [...new Set([path, fileId].filter(Boolean))];
  let lastError = null;

  for (const target of candidates) {
    try {
      const { data, error } = await bucket.createSignedUrl(target, 3600);
      if (error) throw error;
      const url = data?.signedUrl || data?.fullSignedURL || data?.fullSignedUrl || '';
      if (!url) throw new Error('云存储没有返回可访问链接');
      messageMediaUrlCache.set(cacheKey, {
        url,
        expiresAt: Date.now() + 50 * 60 * 1000
      });
      return url;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('云存储链接获取失败');
}

function chooseStickyColor(row, index) {
  const source = String(row?.id || index || '');
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  return `note-color-${hash % 4}`;
}

function buildStickyTextPreview(body) {
  const text = String(body || '').trim();
  if (!text) return '一张空白便利贴 ♡';
  return text.length > 58 ? `${text.slice(0, 58)}…` : text;
}

async function createStickyNoteElement(row, index) {
  const mine = Boolean(cloudTodoUid && String(row.created_by || '') === String(cloudTodoUid));
  const type = getMessageContentType(row);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `felt-note ${chooseStickyColor(row, index)} ${mine ? 'mine' : 'other'} note-type-${type}`;
  button.dataset.messageId = String(row.id || '');

  // Phase 6.3：便利贴不再固定成同一个尺寸。
  // 文字按内容长度微调宽度；图片等加载后再按原始宽高比决定横/方/竖贴。
  if (type === 'text') {
    const textLength = Array.from(String(row.body || '').trim()).length;
    if (textLength <= 10) button.classList.add('note-text-short');
    else if (textLength <= 30) button.classList.add('note-text-medium');
    else button.classList.add('note-text-long');
  }
  button.setAttribute('aria-label', `打开${mine ? '我' : 'TA'}的${type === 'text' ? '文字' : type === 'image' ? '图片' : '语音'}便利贴`);

  const pin = document.createElement('span');
  pin.className = 'felt-note-pin';
  pin.setAttribute('aria-hidden', 'true');

  const content = document.createElement('div');
  content.className = 'felt-note-preview';

  if (type === 'image') {
    const image = document.createElement('img');
    image.alt = '图片便利贴';
    image.loading = 'lazy';
    image.decoding = 'async';

    const applyImageNoteRatio = () => {
      const width = Number(image.naturalWidth || 0);
      const height = Number(image.naturalHeight || 0);
      if (!width || !height) return;

      button.classList.remove('note-image-landscape', 'note-image-square', 'note-image-portrait');
      const ratio = width / height;
      if (ratio >= 1.28) button.classList.add('note-image-landscape');
      else if (ratio <= 0.78) button.classList.add('note-image-portrait');
      else button.classList.add('note-image-square');
    };

    image.addEventListener('load', applyImageNoteRatio, { once: true });
    content.appendChild(image);
    try {
      image.src = await getMessageMediaUrl(row);
      if (image.complete) applyImageNoteRatio();
    } catch (error) {
      console.warn('[毛毡板] 图片预览链接获取失败：', error);
      content.classList.add('media-preview-failed');
      content.textContent = '🖼️\n图片便利贴';
    }
  } else if (type === 'audio') {
    const audioPreview = document.createElement('div');
    audioPreview.className = 'felt-note-audio-preview';
    audioPreview.innerHTML = `
      <span class="felt-note-audio-icon">🎙️</span>
      <strong>语音便利贴</strong>
      <small>${formatVoiceDuration(row.media_duration)}</small>
    `;
    content.appendChild(audioPreview);
  } else {
    const text = document.createElement('div');
    text.className = 'felt-note-text-preview';
    text.textContent = buildStickyTextPreview(row.body);
    content.appendChild(text);
  }

  const meta = document.createElement('div');
  meta.className = 'felt-note-meta';
  meta.textContent = `${mine ? '我' : 'TA'} · ${formatMessageTime(row.created_at)}`;

  button.append(pin, content, meta);
  return button;
}

async function renderCloudMessages(rows = []) {
  if (!messageList) return;

  cloudMessageRowsCache = rows.slice();
  cloudMessageRowsById = new Map(rows.map((row) => [String(row.id || ''), row]));
  messageList.innerHTML = '';

  if (rows.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'message-empty';
    empty.textContent = '毛毡板还是空的，先贴上第一张便利贴吧 ♡';
    messageList.appendChild(empty);
    return;
  }

  for (let index = 0; index < rows.length; index += 1) {
    const note = await createStickyNoteElement(rows[index], index);
    messageList.appendChild(note);
  }

  window.requestAnimationFrame(() => {
    messageList.scrollTop = messageList.scrollHeight;
  });
}

function fingerprintMessageRows(rows = []) {
  return rows
    .map((row) => [
      row.id,
      row.created_at || '',
      row.created_by || '',
      row.body || '',
      row.content_type || 'text',
      row.media_path || '',
      row.media_file_id || '',
      row.media_name || '',
      row.media_mime || '',
      row.media_duration || ''
    ].join(':'))
    .join('|');
}

function setMessageMode(nextMode) {
  messageMode = ['text', 'image', 'audio'].includes(nextMode) ? nextMode : 'text';

  messageModeButtons.forEach((button) => {
    const active = button.dataset.messageMode === messageMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  messagePanels.forEach((panel) => {
    const active = panel.dataset.messagePanel === messageMode;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}

function clearPendingImage() {
  pendingImageFile = null;
  if (pendingImagePreviewUrl) URL.revokeObjectURL(pendingImagePreviewUrl);
  pendingImagePreviewUrl = '';
  if (messageImageInput) messageImageInput.value = '';
  if (messageImagePreview) messageImagePreview.removeAttribute('src');
  if (messageImagePreviewWrap) messageImagePreviewWrap.hidden = true;
  if (messageImageStatus) messageImageStatus.textContent = '选好图片后，再把它贴到毛毡板上。';
  if (messageImageSendBtn) messageImageSendBtn.disabled = true;
}

function stopVoiceStream() {
  if (!voiceMediaStream) return;
  voiceMediaStream.getTracks().forEach((track) => track.stop());
  voiceMediaStream = null;
}

function clearPendingVoice() {
  pendingVoiceBlob = null;
  pendingVoiceDuration = 0;
  if (pendingVoicePreviewUrl) URL.revokeObjectURL(pendingVoicePreviewUrl);
  pendingVoicePreviewUrl = '';
  if (voicePreview) {
    voicePreview.pause();
    voicePreview.removeAttribute('src');
    voicePreview.hidden = true;
  }
  if (voiceSendBtn) voiceSendBtn.disabled = true;
  if (voiceRecordTitle) voiceRecordTitle.textContent = '录一段语音';
  if (voiceRecordStatus) voiceRecordStatus.textContent = '点击开始后，说完再点击停止。';
  if (voiceRecordBtn) {
    voiceRecordBtn.textContent = '● 开始录音';
    voiceRecordBtn.classList.remove('recording');
  }
}

function pickRecorderMimeType() {
  if (!window.MediaRecorder) return '';
  const candidates = [
    'audio/mp4',
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus'
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported?.(type)) || '';
}

async function startVoiceRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    setMessageSyncStatus('error', '当前浏览器不支持网页录音，请换 Safari / Chrome 后再试');
    return;
  }

  try {
    clearPendingVoice();
    voiceMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = pickRecorderMimeType();
    voiceChunks = [];
    voiceRecordStartedAt = Date.now();
    voiceMediaRecorder = mimeType
      ? new MediaRecorder(voiceMediaStream, { mimeType })
      : new MediaRecorder(voiceMediaStream);

    voiceMediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data?.size) voiceChunks.push(event.data);
    });

    voiceMediaRecorder.addEventListener('stop', () => {
      const finalMime = voiceMediaRecorder?.mimeType || mimeType || 'audio/webm';
      pendingVoiceBlob = new Blob(voiceChunks, { type: finalMime });
      pendingVoiceDuration = Math.max(1, Math.round((Date.now() - voiceRecordStartedAt) / 1000));
      stopVoiceStream();

      pendingVoicePreviewUrl = URL.createObjectURL(pendingVoiceBlob);
      if (voicePreview) {
        voicePreview.src = pendingVoicePreviewUrl;
        voicePreview.hidden = false;
      }
      if (voiceSendBtn) voiceSendBtn.disabled = !cloudTodoReady;
      if (voiceRecordTitle) voiceRecordTitle.textContent = '录音完成';
      if (voiceRecordStatus) voiceRecordStatus.textContent = `时长 ${formatVoiceDuration(pendingVoiceDuration)}，可以试听后贴上。`;
      if (voiceRecordBtn) {
        voiceRecordBtn.textContent = '↻ 重新录音';
        voiceRecordBtn.classList.remove('recording');
      }
      voiceMediaRecorder = null;
    });

    voiceMediaRecorder.start(250);
    if (voiceRecordTitle) voiceRecordTitle.textContent = '正在录音…';
    if (voiceRecordStatus) voiceRecordStatus.textContent = '说完后点击“停止录音”。';
    if (voiceRecordBtn) {
      voiceRecordBtn.textContent = '■ 停止录音';
      voiceRecordBtn.classList.add('recording');
    }
  } catch (error) {
    console.error('[毛毡板] 录音失败：', error);
    stopVoiceStream();
    setMessageSyncStatus('error', '没有拿到麦克风权限，暂时不能录语音');
  }
}

function stopVoiceRecording() {
  if (voiceMediaRecorder && voiceMediaRecorder.state !== 'inactive') {
    voiceMediaRecorder.stop();
  }
}

function getMediaExtension(name, mime, type) {
  const fromName = String(name || '').toLowerCase().match(/\.([a-z0-9]{1,8})$/)?.[1];
  if (fromName) return fromName === 'jpeg' ? 'jpg' : fromName;

  const normalized = String(mime || '').toLowerCase();
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/aac': 'aac'
  };
  return map[normalized.split(';')[0]] || (type === 'image' ? 'jpg' : 'webm');
}

async function uploadMessageMedia(fileOrBlob, type, originalName = '') {
  if (!cloudTodoReady || !cloudTodoApp || !cloudTodoUid) {
    throw new Error('毛毡板还没连上云端');
  }

  const maxBytes = type === 'image' ? 10 * 1024 * 1024 : 12 * 1024 * 1024;
  if (fileOrBlob.size > maxBytes) {
    throw new Error(type === 'image' ? '这张图片超过 10MB，请换一张小一点的图片' : '这段语音超过 12MB，请录短一点');
  }

  const mime = fileOrBlob.type || (type === 'image' ? 'image/jpeg' : 'audio/webm');
  const extension = getMediaExtension(originalName, mime, type);
  const date = new Date();
  const month = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const objectId = makeCloudId(type === 'image' ? 'img' : 'voice').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 70);
  const path = `board/${type}/${month}/${cloudTodoUid}/${objectId}.${extension}`;
  const bucket = getBoardStorageClient();
  const { data, error } = await bucket.upload(path, fileOrBlob, {
    contentType: mime,
    upsert: false,
    metadata: {
      usage: 'love-house-feltboard',
      deviceId: cloudTodoUid
    }
  });

  if (error) throw error;
  return {
    path: data?.path || path,
    fileId: data?.id || data?.fileID || data?.fileId || '',
    mime,
    name: originalName || `${type}.${extension}`
  };
}

async function removeMessageMedia(row) {
  const path = String(row?.media_path || '').trim();
  const fileId = String(row?.media_file_id || '').trim();
  if (!path && !fileId) return;

  try {
    const bucket = getBoardStorageClient();
    const candidates = [...new Set([path, fileId].filter(Boolean))];
    let removed = false;
    let lastError = null;

    for (const target of candidates) {
      try {
        const { error } = await bucket.remove([target]);
        if (error) throw error;
        removed = true;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!removed && lastError) throw lastError;
    messageMediaUrlCache.delete(`${getBoardStorageConfig().bucket}:${fileId || path}`);
  } catch (error) {
    // 便利贴数据库删除优先；存储清理失败只记录，不让用户看到“删不掉”的假象。
    console.warn('[毛毡板] 便利贴已删除，但附件清理失败：', error);
  }
}

function clearPendingEatenImage() {
  pendingEatenImageFile = null;
  if (pendingEatenImagePreviewUrl) URL.revokeObjectURL(pendingEatenImagePreviewUrl);
  pendingEatenImagePreviewUrl = '';
  if (eatenImageInput) eatenImageInput.value = '';
  if (eatenImagePreview) eatenImagePreview.removeAttribute('src');
  if (eatenImagePreviewWrap) eatenImagePreviewWrap.hidden = true;
  if (eatenUploadStatus) eatenUploadStatus.textContent = '照片可以不选，文字至少写一句。';
}

async function getEatenImageUrl(row) {
  const path = String(row?.image_path || '').trim();
  const fileId = String(row?.image_file_id || '').trim();
  if (!path && !fileId) return '';

  const cacheKey = `${getBoardStorageConfig().bucket}:eaten:${fileId || path}`;
  const cached = eatenImageUrlCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const bucket = getBoardStorageClient();
  const candidates = [...new Set([path, fileId].filter(Boolean))];
  let lastError = null;

  for (const target of candidates) {
    try {
      const { data, error } = await bucket.createSignedUrl(target, 3600);
      if (error) throw error;
      const url = data?.signedUrl || data?.fullSignedURL || data?.fullSignedUrl || '';
      if (!url) throw new Error('云存储没有返回可访问链接');
      eatenImageUrlCache.set(cacheKey, { url, expiresAt: Date.now() + 50 * 60 * 1000 });
      return url;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('已吃照片链接获取失败');
}

async function uploadEatenImage(file) {
  if (!file) return null;
  if (!cloudTodoReady || !cloudTodoApp || !cloudTodoUid) throw new Error('已吃记录还没连上云端');
  if (file.size > 10 * 1024 * 1024) throw new Error('这张图片超过 10MB，请换一张小一点的图片');

  const mime = file.type || 'image/jpeg';
  const extension = getMediaExtension(file.name || 'eaten.jpg', mime, 'image');
  const date = new Date();
  const month = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const objectId = makeCloudId('eaten').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 70);
  const path = `board/eaten/${month}/${cloudTodoUid}/${objectId}.${extension}`;
  const bucket = getBoardStorageClient();
  const { data, error } = await bucket.upload(path, file, {
    contentType: mime,
    upsert: false,
    metadata: {
      usage: 'love-house-eaten-place',
      deviceId: cloudTodoUid
    }
  });

  if (error) throw error;
  return {
    path: data?.path || path,
    fileId: data?.id || data?.fileID || data?.fileId || '',
    mime,
    name: file.name || `eaten.${extension}`
  };
}

function fingerprintEatenRows(rows = []) {
  return rows.map((row) => [
    row.id || '', row.body || '', row.image_path || '', row.image_file_id || '',
    row.created_at || '', row.created_by || ''
  ].join(':')).join('|');
}

async function createEatenPlaceCard(row) {
  const mine = Boolean(cloudTodoUid && String(row.created_by || '') === String(cloudTodoUid));
  const article = document.createElement('article');
  article.className = 'eaten-place-card';
  article.dataset.eatenId = String(row.id || '');
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `查看已吃记录：${String(row.body || '一起吃过的一顿饭')}`);

  const photoWrap = document.createElement('div');
  photoWrap.className = 'eaten-place-photo';

  if (row.image_path || row.image_file_id) {
    const img = document.createElement('img');
    img.alt = String(row.body || '已吃记录');
    img.loading = 'lazy';
    img.decoding = 'async';
    photoWrap.appendChild(img);
    try {
      img.src = await getEatenImageUrl(row);
    } catch (error) {
      console.warn('[已吃记录] 图片链接获取失败：', error);
      photoWrap.classList.add('is-empty');
      photoWrap.textContent = '🍽️';
    }
  } else {
    photoWrap.classList.add('is-empty');
    photoWrap.textContent = '🍽️';
  }

  const body = document.createElement('div');
  body.className = 'eaten-place-body';

  const text = document.createElement('div');
  text.className = 'eaten-place-text';
  text.textContent = String(row.body || '一起吃过的一顿饭');

  const meta = document.createElement('div');
  meta.className = 'eaten-place-meta';
  meta.textContent = `${mine ? '我' : 'TA'} · ${formatMessageTime(row.created_at)}`;

  body.append(text, meta);
  article.append(photoWrap, body);
  return article;
}

async function renderCloudEatenPlaces(rows = []) {
  if (!eatenPlacesList) return;
  cloudEatenRowsCache = rows.slice();
  cloudEatenRowsById = new Map(rows.map((row) => [String(row.id || ''), row]));
  eatenPlacesList.innerHTML = '';

  if (rows.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'eaten-empty';
    empty.textContent = '还没有记录，下一顿吃完就来留一张吧 ♡';
    eatenPlacesList.appendChild(empty);
    return;
  }

  for (const row of rows) {
    eatenPlacesList.appendChild(await createEatenPlaceCard(row));
  }
}

async function refreshCloudEatenPlaces({ silent = false } = {}) {
  if (!eatenContent || !cloudTodoReady || !cloudTodoDb || cloudEatenRefreshing) return;

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.eatenTable || 'couple_eaten_places').trim();
  cloudEatenRefreshing = true;

  try {
    const { data, error } = await cloudTodoDb
      .from(tableName)
      .select('id,body,image_path,image_file_id,image_name,image_mime,created_at,created_by')
      .order('created_at', { ascending: false })
      .limit(60);

    if (error) throw error;

    cloudEatenTableReady = true;
    setEatenComposerEnabled(true);
    const rows = Array.isArray(data) ? data : [];
    const nextFingerprint = fingerprintEatenRows(rows);
    if (nextFingerprint !== cloudEatenLastFingerprint) {
      await renderCloudEatenPlaces(rows);
      cloudEatenLastFingerprint = nextFingerprint;
    } else {
      cloudEatenRowsCache = rows.slice();
    }

    if (!silent) {
      const seconds = Math.max(1, Math.round(Number(config.pollMs || 4000) / 1000));
      setEatenSyncStatus('online', `已吃记录已同步 · 约 ${seconds} 秒自动更新一次 ♡`);
    } else if (eatenSyncBar?.dataset.state !== 'online') {
      setEatenSyncStatus('online', '已吃记录已连上云端 ♡');
    }
  } catch (error) {
    console.error('[已吃记录] SQL 读取失败：', error);
    cloudEatenTableReady = false;
    setEatenComposerEnabled(false);
    setEatenSyncStatus('error', '已吃记录还没准备好，请先执行 Phase 6.1 SQL');
  } finally {
    cloudEatenRefreshing = false;
  }
}

async function createCloudEatenPlace(body) {
  const cleanBody = String(body || '').trim();
  if (!cleanBody) return;
  if (!cloudTodoReady || !cloudTodoDb || !cloudEatenTableReady) {
    setEatenSyncStatus('error', '已吃记录还没连上云端');
    return;
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.eatenTable || 'couple_eaten_places').trim();
  let uploaded = null;

  if (eatenSaveBtn) eatenSaveBtn.disabled = true;
  setEatenSyncStatus('syncing', pendingEatenImageFile ? '正在上传照片并记下这顿饭…' : '正在记下这顿饭…');

  try {
    if (pendingEatenImageFile) uploaded = await uploadEatenImage(pendingEatenImageFile);

    const row = {
      id: makeCloudId('eaten').slice(0, 80),
      body: cleanBody.slice(0, 300),
      created_by: String(cloudTodoUid),
      image_path: uploaded?.path || null,
      image_file_id: uploaded?.fileId || null,
      image_name: uploaded?.name ? String(uploaded.name).slice(0, 180) : null,
      image_mime: uploaded?.mime ? String(uploaded.mime).slice(0, 100) : null
    };

    const { error } = await cloudTodoDb.from(tableName).insert(row);
    if (error) throw error;

    if (eatenTextInput) eatenTextInput.value = '';
    if (eatenCounter) eatenCounter.textContent = '0 / 300';
    clearPendingEatenImage();
    cloudEatenLastFingerprint = '';
    await refreshCloudEatenPlaces({ silent: true });
    setEatenSyncStatus('online', '这顿饭已经记下来啦 ♡');
  } catch (error) {
    console.error('[已吃记录] 保存失败：', error);
    if (uploaded?.path || uploaded?.fileId) {
      await removeMessageMedia({ media_path: uploaded?.path, media_file_id: uploaded?.fileId });
    }
    setEatenSyncStatus('error', `没有保存成功：${formatBoardStorageError(error, '未知错误')}`);
  } finally {
    updateEatenSaveState();
  }
}


async function removeEatenImage(row) {
  const path = String(row?.image_path || '').trim();
  const fileId = String(row?.image_file_id || '').trim();
  if (!path && !fileId) return;

  try {
    const bucket = getBoardStorageClient();
    const candidates = [...new Set([path, fileId].filter(Boolean))];
    let removed = false;
    let lastError = null;

    for (const target of candidates) {
      try {
        const { error } = await bucket.remove([target]);
        if (error) throw error;
        removed = true;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!removed && lastError) throw lastError;
    eatenImageUrlCache.delete(`${getBoardStorageConfig().bucket}:eaten:${fileId || path}`);
  } catch (error) {
    // 数据库记录删除优先；附件清理失败只留日志，避免给用户造成“记录没删掉”的错觉。
    console.warn('[已吃记录] 记录已删除，但照片附件清理失败：', error);
  }
}

async function openEatenDetail(row) {
  if (!row || !eatenDetailModal) return;
  openedEatenPlaceId = String(row.id || '');
  eatenDeleteArmed = false;
  eatenDetailDeleteBtn?.classList.remove('confirm');
  if (eatenDetailDeleteBtn) eatenDetailDeleteBtn.textContent = '删除这条记录';
  if (eatenDetailDeleteHint) eatenDetailDeleteHint.textContent = '';

  const mine = Boolean(cloudTodoUid && String(row.created_by || '') === String(cloudTodoUid));
  if (eatenDetailTitle) eatenDetailTitle.textContent = '🍽️ 已吃记录';
  if (eatenDetailMeta) eatenDetailMeta.textContent = `${mine ? '我' : 'TA'} · ${formatMessageTime(row.created_at)}`;
  if (eatenDetailText) eatenDetailText.textContent = String(row.body || '');

  if (eatenDetailPhotoWrap) eatenDetailPhotoWrap.hidden = true;
  if (eatenDetailPhoto) eatenDetailPhoto.removeAttribute('src');
  if (row.image_path || row.image_file_id) {
    try {
      const url = await getEatenImageUrl(row);
      if (eatenDetailPhoto) eatenDetailPhoto.src = url;
      if (eatenDetailPhotoWrap) eatenDetailPhotoWrap.hidden = false;
    } catch (error) {
      console.warn('[已吃记录] 详情照片链接获取失败：', error);
    }
  }

  eatenDetailModal.classList.add('show');
  eatenDetailModal.setAttribute('aria-hidden', 'false');
}

function closeEatenDetail() {
  openedEatenPlaceId = '';
  eatenDeleteArmed = false;
  eatenDetailModal?.classList.remove('show');
  eatenDetailModal?.setAttribute('aria-hidden', 'true');
  eatenDetailDeleteBtn?.classList.remove('confirm');
  if (eatenDetailDeleteBtn) eatenDetailDeleteBtn.textContent = '删除这条记录';
  if (eatenDetailDeleteHint) eatenDetailDeleteHint.textContent = '';
  if (eatenDetailPhoto) eatenDetailPhoto.removeAttribute('src');
  if (eatenDetailPhotoWrap) eatenDetailPhotoWrap.hidden = true;
}

async function deleteOpenedEatenPlace() {
  const id = openedEatenPlaceId;
  const row = cloudEatenRowsById.get(String(id || ''));
  if (!id || !row || !cloudTodoReady || !cloudTodoDb) return;

  if (!eatenDeleteArmed) {
    eatenDeleteArmed = true;
    eatenDetailDeleteBtn?.classList.add('confirm');
    if (eatenDetailDeleteBtn) eatenDetailDeleteBtn.textContent = '确认删除';
    if (eatenDetailDeleteHint) eatenDetailDeleteHint.textContent = '再点一次“确认删除”，这条吃饭记录就会从两个人的小屋里消失。';
    return;
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.eatenTable || 'couple_eaten_places').trim();
  if (eatenDetailDeleteBtn) eatenDetailDeleteBtn.disabled = true;
  setEatenSyncStatus('syncing', '正在删掉这条吃饭记录…');

  try {
    const { error } = await cloudTodoDb.from(tableName).delete().eq('id', id);
    if (error) throw error;

    closeEatenDetail();
    await removeEatenImage(row);
    cloudEatenLastFingerprint = '';
    await refreshCloudEatenPlaces({ silent: true });
    setEatenSyncStatus('online', '这条吃饭记录已经删掉了');
  } catch (error) {
    console.error('[已吃记录] 删除失败：', error);
    if (eatenDetailDeleteHint) eatenDetailDeleteHint.textContent = `删除失败：${String(error?.message || error || '未知错误')}`;
    setEatenSyncStatus('error', '这条吃饭记录暂时没删掉');
  } finally {
    if (eatenDetailDeleteBtn) eatenDetailDeleteBtn.disabled = false;
  }
}

async function refreshCloudTodos({ silent = false } = {}) {
  if (!cloudTodoReady || !cloudTodoDb || cloudTodoRefreshing) return;

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.table || 'couple_todos').trim();
  cloudTodoRefreshing = true;

  try {
    const { data, error } = await cloudTodoDb
      .from(tableName)
      .select('id,title,done,sort_order,updated_at,updated_by')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const nextFingerprint = fingerprintTodoRows(rows);

    if (nextFingerprint !== cloudTodoLastFingerprint) {
      renderCloudTodos(rows);
      cloudTodoLastFingerprint = nextFingerprint;
    } else {
      cloudTodoRowsCache = rows.slice();
    }

    if (!silent) {
      const seconds = Math.max(1, Math.round(Number(config.pollMs || 4000) / 1000));
      setTodoSyncStatus('online', `已连上云端 · 约 ${seconds} 秒自动同步一次 ♡`);
    }
  } catch (error) {
    console.error('[约定同步] SQL 读取失败：', error);
    setTodoSyncStatus('error', `约定读取失败：${String(error?.message || error || '未知错误')}`);
  } finally {
    cloudTodoRefreshing = false;
  }
}

async function fetchMessageRowsExtended(tableName) {
  return cloudTodoDb
    .from(tableName)
    .select('id,body,created_at,created_by,content_type,media_path,media_file_id,media_name,media_mime,media_duration')
    .order('created_at', { ascending: true })
    .limit(60);
}

async function fetchMessageRowsLegacy(tableName) {
  return cloudTodoDb
    .from(tableName)
    .select('id,body,created_at,created_by')
    .order('created_at', { ascending: true })
    .limit(60);
}

async function refreshCloudMessages({ silent = false } = {}) {
  if (!cloudTodoReady || !cloudTodoDb || cloudMessageRefreshing || !messageBoard) return;

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.messageTable || 'couple_messages').trim();
  cloudMessageRefreshing = true;

  try {
    let result = await fetchMessageRowsExtended(tableName);
    cloudMessageSchemaReady = !result.error;

    // 代码先部署、SQL 后执行时，也尽量继续显示旧文字留言，不让整个毛毡板空掉。
    if (result.error) {
      console.warn('[毛毡板] Phase 6 字段尚不可用，回退读取旧留言：', result.error);
      result = await fetchMessageRowsLegacy(tableName);
      if (!result.error && !silent) {
        setMessageSyncStatus('setup', '文字留言可读 · 图片/语音/删除需要先执行 Phase 6 SQL');
      }
    }

    if (result.error) throw result.error;

    const rows = (Array.isArray(result.data) ? result.data : []).map((row) => ({
      content_type: 'text',
      media_path: null,
      media_file_id: null,
      media_name: null,
      media_mime: null,
      media_duration: null,
      ...row
    }));
    const nextFingerprint = fingerprintMessageRows(rows);

    if (nextFingerprint !== cloudMessageLastFingerprint) {
      await renderCloudMessages(rows);
      cloudMessageLastFingerprint = nextFingerprint;
    } else {
      cloudMessageRowsCache = rows.slice();
      cloudMessageRowsById = new Map(rows.map((row) => [String(row.id || ''), row]));
    }

    if (!silent && cloudMessageSchemaReady) {
      const seconds = Math.max(1, Math.round(Number(config.pollMs || 4000) / 1000));
      setMessageSyncStatus('online', `毛毡板已同步 · 约 ${seconds} 秒看看有没有新便利贴 ♡`);
    }
  } catch (error) {
    console.error('[毛毡板] SQL 读取失败：', error);
    setMessageSyncStatus('error', `毛毡板暂时没连上：${String(error?.message || error || '未知错误')}`);
  } finally {
    cloudMessageRefreshing = false;
  }
}

function shouldPollCloudTodos() {
  return document.visibilityState === 'visible' && aboutPageEl?.classList.contains('active');
}

function shouldPollCloudMessages() {
  return document.visibilityState === 'visible' && memoryPageEl?.classList.contains('active');
}

function shouldPollCloudEatenPlaces() {
  return document.visibilityState === 'visible' && kitchenPageEl?.classList.contains('active');
}

function shouldPollCloudLetters() {
  return document.visibilityState === 'visible' && homePage?.classList.contains('active');
}

function startCloudHomePolling() {
  if (cloudHomePollingTimer) window.clearInterval(cloudHomePollingTimer);

  const config = window.LOVE_HOUSE_CLOUD || {};
  const pollMs = Math.max(2500, Number(config.pollMs || 4000));

  cloudHomePollingTimer = window.setInterval(() => {
    if (shouldPollCloudTodos()) refreshCloudTodos({ silent: true });
    if (shouldPollCloudMessages()) refreshCloudMessages({ silent: true });
    if (shouldPollCloudEatenPlaces()) refreshCloudEatenPlaces({ silent: true });
    if (shouldPollCloudLetters()) refreshCloudLetters({ silent: true });
  }, pollMs);
}

async function initCloudHomeSync() {
  if (!todoList && !messageBoard && !eatenContent && !homeMailboxBtn) return;

  const config = window.LOVE_HOUSE_CLOUD || {};
  const envId = String(config.envId || '').trim();

  if (!envId || envId === 'YOUR_CLOUDBASE_ENV_ID') {
    setTodoSyncStatus('setup', '还差一步：请在 cloudbase-config.js 填入环境 ID');
    setMessageSyncStatus('setup', '毛毡板等待 CloudBase 环境 ID');
    setEatenSyncStatus('setup', '已吃记录等待 CloudBase 环境 ID');
    setMailboxSyncStatus('setup', '信箱等待 CloudBase 环境 ID');
    return;
  }

  if (!window.cloudbase || typeof window.cloudbase.init !== 'function') {
    setTodoSyncStatus('error', 'CloudBase SDK 加载失败，请检查网络');
    setMessageSyncStatus('error', 'CloudBase SDK 加载失败，请检查网络');
    setEatenSyncStatus('error', 'CloudBase SDK 加载失败，请检查网络');
    setMailboxSyncStatus('error', 'CloudBase SDK 加载失败，请检查网络');
    return;
  }

  setCloudComposerEnabled(false);
  setEatenComposerEnabled(false);
  setMailboxComposerEnabled(false);
  setTodoSyncStatus('connecting', '正在连接两个人的小屋…');
  setMessageSyncStatus('connecting', '正在连接毛毡板…');
  setEatenSyncStatus('connecting', '正在连接已吃记录…');
  setMailboxSyncStatus('connecting', '正在看看大门信箱…');

  try {
    const publishableKey = String(config.publishableKey || '').trim();
    if (!publishableKey) throw new Error('缺少 CloudBase Publishable Key');

    // 继续沿用已经实测成功的 Phase 5.1 初始化方式。
    cloudTodoApp = window.cloudbase.init({
      env: envId,
      accessKey: publishableKey
    });

    cloudTodoUid = getLoveHouseDeviceId();

    if (cloudTodoUid && copyCloudUidBtn) {
      copyCloudUidBtn.hidden = false;
      copyCloudUidBtn.dataset.uid = cloudTodoUid;
      console.log('[小屋 CloudBase] 本设备 ID:', cloudTodoUid);
    }

    if (typeof cloudTodoApp.rdb !== 'function') {
      throw new Error('当前 CloudBase SDK 没有 rdb()，请确认 SDK 已正确加载');
    }

    cloudTodoDb = cloudTodoApp.rdb();
    cloudTodoReady = true;
    setCloudComposerEnabled(true);

    await Promise.all([
      refreshCloudTodos(),
      refreshCloudMessages(),
      refreshCloudEatenPlaces(),
      refreshCloudLetters()
    ]);
    startCloudHomePolling();
  } catch (error) {
    console.error('[小屋云同步] 初始化失败：', error);
    cloudTodoReady = false;
    cloudEatenTableReady = false;
    setCloudComposerEnabled(false);
    setEatenComposerEnabled(false);
    setMailboxComposerEnabled(false);

    const message = String(error?.message || error || '');
    if (/publishable|access.?key|api.?key/i.test(message)) {
      setTodoSyncStatus('error', 'CloudBase Publishable Key 配置有误');
      setMessageSyncStatus('error', 'CloudBase Publishable Key 配置有误');
      setEatenSyncStatus('error', 'CloudBase Publishable Key 配置有误');
      setMailboxSyncStatus('error', 'CloudBase Publishable Key 配置有误');
    } else if (/permission|denied|unauthorized|rls|403/i.test(message)) {
      setTodoSyncStatus('error', 'CloudBase 写权限不足，请检查对应 GRANT / RLS');
      setMessageSyncStatus('error', 'CloudBase 写权限不足，请检查 Phase 6 SQL');
      setEatenSyncStatus('error', 'CloudBase 写权限不足，请检查 Phase 6.1 SQL');
      setMailboxSyncStatus('error', '信箱写权限不足，请检查 Phase 7 SQL');
    } else {
      setTodoSyncStatus('error', '云同步连接失败，请稍后再试');
      setMessageSyncStatus('error', '毛毡板连接失败，请稍后再试');
      setEatenSyncStatus('error', '已吃记录连接失败，请稍后再试');
      setMailboxSyncStatus('error', '大门信箱连接失败，请稍后再试');
    }
  }
}

async function toggleCloudTodo(item) {
  if (!item || item.classList.contains('syncing')) return;

  if (!cloudTodoReady || !cloudTodoDb) {
    setTodoSyncStatus('error', '现在还没连上云端，暂时不能保存这个勾');
    return;
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.table || 'couple_todos').trim();
  const id = String(item.dataset.todoId || '');
  if (!id) return;

  const oldDone = item.classList.contains('done');
  const nextDone = !oldDone;

  item.classList.add('syncing');
  setTodoVisual(item, nextDone);
  setTodoSyncStatus('syncing', '正在保存这个小约定…');

  try {
    const { error } = await cloudTodoDb
      .from(tableName)
      .update({ done: nextDone })
      .eq('id', id);

    if (error) throw error;

    cloudTodoLastFingerprint = '';
    await refreshCloudTodos({ silent: true });
    setTodoSyncStatus('online', '已保存 · 另一台设备会自动同步 ♡');
  } catch (error) {
    console.error(`[约定同步] ${id} 保存失败：`, error);
    setTodoVisual(item, oldDone);
    item.classList.add('sync-error');
    window.setTimeout(() => item.classList.remove('sync-error'), 700);
    setTodoSyncStatus('error', `这次没有保存成功：${String(error?.message || error || '未知错误')}`);
  } finally {
    item.classList.remove('syncing');
  }
}

async function createCloudTodo(title) {
  const cleanTitle = String(title || '').trim().replace(/\s+/g, ' ');
  if (!cleanTitle) return;

  if (!cloudTodoReady || !cloudTodoDb) {
    setTodoSyncStatus('error', '现在还没连上云端，暂时不能创建新约定');
    return;
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.table || 'couple_todos').trim();
  const maxSort = cloudTodoRowsCache.reduce((max, row) => Math.max(max, Number(row.sort_order) || 0), 0);
  const row = {
    id: makeCloudId('todo').slice(0, 64),
    title: cleanTitle.slice(0, 80),
    done: false,
    sort_order: maxSort + 1
  };

  if (todoCreateBtn) todoCreateBtn.disabled = true;
  setTodoSyncStatus('syncing', '正在把新约定写进小屋…');

  try {
    const { error } = await cloudTodoDb.from(tableName).insert(row);
    if (error) throw error;

    if (todoCreateInput) todoCreateInput.value = '';
    cloudTodoLastFingerprint = '';
    await refreshCloudTodos({ silent: true });
    setTodoSyncStatus('online', '新约定已经放进卧室啦 ♡');
  } catch (error) {
    console.error('[新建约定] 保存失败：', error);
    setTodoSyncStatus('error', `新约定没保存成功：${String(error?.message || error || '未知错误')}`);
  } finally {
    if (todoCreateBtn) todoCreateBtn.disabled = !cloudTodoReady;
  }
}

function openTodoDeleteConfirm(row) {
  if (!todoDeleteModal || !row) return;
  pendingTodoDeleteId = String(row.id || '');
  if (todoDeleteText) todoDeleteText.textContent = `“${String(row.title || '这条约定')}”`;
  todoDeleteModal.classList.add('show');
  todoDeleteModal.setAttribute('aria-hidden', 'false');
}

function closeTodoDeleteConfirm() {
  pendingTodoDeleteId = '';
  todoDeleteModal?.classList.remove('show');
  todoDeleteModal?.setAttribute('aria-hidden', 'true');
}

async function deleteCloudTodo(id) {
  if (!id || !cloudTodoReady || !cloudTodoDb) return;
  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.table || 'couple_todos').trim();

  if (todoDeleteConfirmBtn) todoDeleteConfirmBtn.disabled = true;
  setTodoSyncStatus('syncing', '正在删掉这条约定…');

  try {
    const { error } = await cloudTodoDb.from(tableName).delete().eq('id', id);
    if (error) throw error;
    closeTodoDeleteConfirm();
    cloudTodoLastFingerprint = '';
    await refreshCloudTodos({ silent: true });
    setTodoSyncStatus('online', '这条约定已经删掉了');
  } catch (error) {
    console.error('[删除约定] 失败：', error);
    setTodoSyncStatus('error', `删除失败：${String(error?.message || error || '未知错误')}`);
  } finally {
    if (todoDeleteConfirmBtn) todoDeleteConfirmBtn.disabled = false;
  }
}

async function insertCloudMessage(row) {
  if (!cloudTodoReady || !cloudTodoDb || !cloudTodoUid) {
    throw new Error('毛毡板还没连上云端');
  }
  if (!cloudMessageSchemaReady && row.content_type !== 'text') {
    throw new Error('请先执行 Phase 6 SQL，再使用图片和语音便利贴');
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.messageTable || 'couple_messages').trim();
  const { error } = await cloudTodoDb.from(tableName).insert(row);
  if (error) throw error;
}

async function sendCloudTextMessage(body) {
  const cleanBody = String(body || '').trim();
  if (!cleanBody) return;

  const row = {
    id: makeCloudId('msg').slice(0, 80),
    body: cleanBody.slice(0, 300),
    created_by: String(cloudTodoUid),
    content_type: 'text'
  };

  if (messageSendBtn) messageSendBtn.disabled = true;
  setMessageSyncStatus('syncing', '正在把文字便利贴贴上去…');

  try {
    if (cloudMessageSchemaReady) {
      await insertCloudMessage(row);
    } else {
      // 兼容“代码先上线、SQL 还没执行”的短暂阶段。
      const config = window.LOVE_HOUSE_CLOUD || {};
      const tableName = String(config.messageTable || 'couple_messages').trim();
      const legacyRow = { id: row.id, body: row.body, created_by: row.created_by };
      const { error } = await cloudTodoDb.from(tableName).insert(legacyRow);
      if (error) throw error;
    }

    if (messageInput) messageInput.value = '';
    if (messageCounter) messageCounter.textContent = '0 / 300';
    cloudMessageLastFingerprint = '';
    await refreshCloudMessages({ silent: true });
    setMessageSyncStatus('online', '文字便利贴已经贴好啦 ♡');
  } catch (error) {
    console.error('[毛毡板] 文字便利贴发送失败：', error);
    setMessageSyncStatus('error', `便利贴没有贴成功：${String(error?.message || error || '未知错误')}`);
  } finally {
    if (messageSendBtn) messageSendBtn.disabled = !cloudTodoReady;
  }
}

async function sendCloudImageMessage() {
  if (!pendingImageFile) return;
  if (!cloudMessageSchemaReady) {
    setMessageSyncStatus('error', '图片便利贴需要先执行 Phase 6 SQL');
    return;
  }

  if (messageImageSendBtn) messageImageSendBtn.disabled = true;
  setMessageSyncStatus('syncing', '正在上传图片并贴到毛毡板…');
  let uploaded = null;

  try {
    uploaded = await uploadMessageMedia(pendingImageFile, 'image', pendingImageFile.name || 'image');
    const row = {
      id: makeCloudId('msg').slice(0, 80),
      body: '[图片]',
      created_by: String(cloudTodoUid),
      content_type: 'image',
      media_path: uploaded.path,
      media_file_id: uploaded.fileId || null,
      media_name: String(uploaded.name || '').slice(0, 180),
      media_mime: String(uploaded.mime || '').slice(0, 100),
      media_duration: null
    };
    await insertCloudMessage(row);

    clearPendingImage();
    cloudMessageLastFingerprint = '';
    await refreshCloudMessages({ silent: true });
    setMessageSyncStatus('online', '图片便利贴已经贴好啦 ♡');
  } catch (error) {
    console.error('[毛毡板] 图片便利贴失败：', error);
    if (uploaded?.path || uploaded?.fileId) await removeMessageMedia({ media_path: uploaded?.path, media_file_id: uploaded?.fileId });
    setMessageSyncStatus('error', `图片没有贴成功：${formatBoardStorageError(error, '未知错误')}`);
  } finally {
    if (messageImageSendBtn) messageImageSendBtn.disabled = !cloudTodoReady || !pendingImageFile;
  }
}

async function sendCloudVoiceMessage() {
  if (!pendingVoiceBlob) return;
  if (!cloudMessageSchemaReady) {
    setMessageSyncStatus('error', '语音便利贴需要先执行 Phase 6 SQL');
    return;
  }

  if (voiceSendBtn) voiceSendBtn.disabled = true;
  setMessageSyncStatus('syncing', '正在上传语音并贴到毛毡板…');
  let uploaded = null;

  try {
    uploaded = await uploadMessageMedia(pendingVoiceBlob, 'audio', 'voice');
    const row = {
      id: makeCloudId('msg').slice(0, 80),
      body: '[语音]',
      created_by: String(cloudTodoUid),
      content_type: 'audio',
      media_path: uploaded.path,
      media_file_id: uploaded.fileId || null,
      media_name: String(uploaded.name || 'voice').slice(0, 180),
      media_mime: String(uploaded.mime || '').slice(0, 100),
      media_duration: Math.max(1, Math.round(pendingVoiceDuration || 1))
    };
    await insertCloudMessage(row);

    clearPendingVoice();
    cloudMessageLastFingerprint = '';
    await refreshCloudMessages({ silent: true });
    setMessageSyncStatus('online', '语音便利贴已经贴好啦 ♡');
  } catch (error) {
    console.error('[毛毡板] 语音便利贴失败：', error);
    if (uploaded?.path || uploaded?.fileId) await removeMessageMedia({ media_path: uploaded?.path, media_file_id: uploaded?.fileId });
    setMessageSyncStatus('error', `语音没有贴成功：${formatBoardStorageError(error, '未知错误')}`);
  } finally {
    if (voiceSendBtn) voiceSendBtn.disabled = !cloudTodoReady || !pendingVoiceBlob;
  }
}

async function renderStickyModalContent(row) {
  if (!stickyNoteModalContent) return;
  stickyNoteModalContent.innerHTML = '<div class="sticky-modal-loading">正在展开便利贴…</div>';
  const type = getMessageContentType(row);

  if (type === 'image') {
    try {
      const url = await getMessageMediaUrl(row);
      const image = document.createElement('img');
      image.className = 'sticky-modal-image';
      image.src = url;
      image.alt = row.media_name || '图片便利贴';
      stickyNoteModalContent.innerHTML = '';
      stickyNoteModalContent.appendChild(image);
    } catch (error) {
      stickyNoteModalContent.textContent = `图片暂时打不开：${String(error?.message || error || '')}`;
    }
    return;
  }

  if (type === 'audio') {
    try {
      const url = await getMessageMediaUrl(row);
      const wrap = document.createElement('div');
      wrap.className = 'sticky-modal-audio-wrap';
      const title = document.createElement('div');
      title.className = 'sticky-modal-audio-title';
      title.textContent = `🎙️ 语音 · ${formatVoiceDuration(row.media_duration)}`;
      const audio = document.createElement('audio');
      audio.className = 'sticky-modal-audio';
      audio.src = url;
      audio.controls = true;
      audio.preload = 'metadata';
      wrap.append(title, audio);
      stickyNoteModalContent.innerHTML = '';
      stickyNoteModalContent.appendChild(wrap);
    } catch (error) {
      stickyNoteModalContent.textContent = `语音暂时打不开：${String(error?.message || error || '')}`;
    }
    return;
  }

  const text = document.createElement('div');
  text.className = 'sticky-modal-text';
  text.textContent = String(row.body || '');
  stickyNoteModalContent.innerHTML = '';
  stickyNoteModalContent.appendChild(text);
}

async function openStickyNoteModal(row) {
  if (!row || !stickyNoteModal) return;
  openedStickyMessageId = String(row.id || '');
  stickyDeleteArmed = false;
  stickyNoteDeleteBtn?.classList.remove('confirm');
  if (stickyNoteDeleteBtn) stickyNoteDeleteBtn.textContent = '删除便利贴';
  if (stickyNoteDeleteHint) stickyNoteDeleteHint.textContent = '';

  const mine = Boolean(cloudTodoUid && String(row.created_by || '') === String(cloudTodoUid));
  if (stickyNoteModalMeta) stickyNoteModalMeta.textContent = `${mine ? '我' : 'TA'} · ${formatMessageTime(row.created_at)}`;
  stickyNoteModal.classList.add('show');
  stickyNoteModal.setAttribute('aria-hidden', 'false');
  await renderStickyModalContent(row);
}

function closeStickyNoteModal() {
  openedStickyMessageId = '';
  stickyDeleteArmed = false;
  stickyNoteModal?.classList.remove('show');
  stickyNoteModal?.setAttribute('aria-hidden', 'true');
  stickyNoteDeleteBtn?.classList.remove('confirm');
  if (stickyNoteDeleteBtn) stickyNoteDeleteBtn.textContent = '删除便利贴';
  if (stickyNoteDeleteHint) stickyNoteDeleteHint.textContent = '';
  const audio = stickyNoteModalContent?.querySelector('audio');
  audio?.pause();
}

async function deleteOpenedStickyNote() {
  const id = openedStickyMessageId;
  const row = cloudMessageRowsById.get(id);
  if (!id || !row || !cloudTodoReady || !cloudTodoDb) return;

  if (!stickyDeleteArmed) {
    stickyDeleteArmed = true;
    stickyNoteDeleteBtn?.classList.add('confirm');
    if (stickyNoteDeleteBtn) stickyNoteDeleteBtn.textContent = '确认删除';
    if (stickyNoteDeleteHint) stickyNoteDeleteHint.textContent = '再点一次“确认删除”，这张便利贴就会从两个人的毛毡板上消失。';
    return;
  }

  const config = window.LOVE_HOUSE_CLOUD || {};
  const tableName = String(config.messageTable || 'couple_messages').trim();
  if (stickyNoteDeleteBtn) stickyNoteDeleteBtn.disabled = true;
  setMessageSyncStatus('syncing', '正在取下这张便利贴…');

  try {
    const { error } = await cloudTodoDb.from(tableName).delete().eq('id', id);
    if (error) throw error;

    closeStickyNoteModal();
    await removeMessageMedia(row);
    cloudMessageLastFingerprint = '';
    await refreshCloudMessages({ silent: true });
    setMessageSyncStatus('online', '便利贴已经取下来了');
  } catch (error) {
    console.error('[毛毡板] 删除便利贴失败：', error);
    if (stickyNoteDeleteHint) stickyNoteDeleteHint.textContent = `删除失败：${String(error?.message || error || '未知错误')}`;
    setMessageSyncStatus('error', '这张便利贴暂时没删掉');
  } finally {
    if (stickyNoteDeleteBtn) stickyNoteDeleteBtn.disabled = false;
  }
}

// ---------- 约定事件 ----------
todoList?.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('[data-todo-delete]');
  if (deleteBtn && todoList.contains(deleteBtn)) {
    event.preventDefault();
    event.stopPropagation();
    const id = String(deleteBtn.dataset.todoDelete || '');
    const row = cloudTodoRowsCache.find((item) => String(item.id || '') === id);
    if (row) openTodoDeleteConfirm(row);
    return;
  }

  const item = event.target.closest('.todo-item[data-todo-id]');
  if (item && todoList.contains(item)) toggleCloudTodo(item);
});

todoList?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  if (event.target.closest('[data-todo-delete]')) return;
  const item = event.target.closest('.todo-item[data-todo-id]');
  if (!item || !todoList.contains(item)) return;
  event.preventDefault();
  toggleCloudTodo(item);
});

todoCreateForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  createCloudTodo(todoCreateInput?.value || '');
});

todoDeleteCancelBtn?.addEventListener('click', closeTodoDeleteConfirm);
todoDeleteConfirmBtn?.addEventListener('click', () => deleteCloudTodo(pendingTodoDeleteId));
todoDeleteModal?.querySelector('[data-close-todo-delete]')?.addEventListener('click', closeTodoDeleteConfirm);

// ---------- “已吃！”记录事件 ----------
eatenTextInput?.addEventListener('input', () => {
  if (eatenCounter) eatenCounter.textContent = `${eatenTextInput.value.length} / 300`;
  updateEatenSaveState();
});

eatenImageInput?.addEventListener('change', () => {
  const file = eatenImageInput.files?.[0];
  clearPendingEatenImage();
  if (!file) return;
  if (!String(file.type || '').startsWith('image/')) {
    setEatenSyncStatus('error', '请选择图片文件');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    setEatenSyncStatus('error', '图片不能超过 10MB');
    return;
  }

  pendingEatenImageFile = file;
  pendingEatenImagePreviewUrl = URL.createObjectURL(file);
  if (eatenImagePreview) eatenImagePreview.src = pendingEatenImagePreviewUrl;
  if (eatenImagePreviewWrap) eatenImagePreviewWrap.hidden = false;
  if (eatenUploadStatus) eatenUploadStatus.textContent = `${file.name || '这张照片'} · ${(file.size / 1024 / 1024).toFixed(1)}MB`;
  updateEatenSaveState();
});

eatenImageClearBtn?.addEventListener('click', () => {
  clearPendingEatenImage();
  updateEatenSaveState();
});

eatenCreateForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  createCloudEatenPlace(eatenTextInput?.value || '');
});


eatenPlacesList?.addEventListener('click', (event) => {
  const card = event.target.closest('.eaten-place-card[data-eaten-id]');
  if (!card || !eatenPlacesList.contains(card)) return;
  const row = cloudEatenRowsById.get(String(card.dataset.eatenId || ''));
  if (row) openEatenDetail(row);
});

eatenPlacesList?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.eaten-place-card[data-eaten-id]');
  if (!card || !eatenPlacesList.contains(card)) return;
  event.preventDefault();
  const row = cloudEatenRowsById.get(String(card.dataset.eatenId || ''));
  if (row) openEatenDetail(row);
});

closeEatenDetailBtn?.addEventListener('click', closeEatenDetail);
eatenDetailModal?.querySelector('[data-close-eaten-detail]')?.addEventListener('click', closeEatenDetail);
eatenDetailDeleteBtn?.addEventListener('click', deleteOpenedEatenPlace);

// ---------- 毛毡板编辑器事件 ----------
messageModeButtons.forEach((button) => {
  button.addEventListener('click', () => setMessageMode(button.dataset.messageMode || 'text'));
});

messageInput?.addEventListener('input', () => {
  if (messageCounter) messageCounter.textContent = `${messageInput.value.length} / 300`;
});

messageForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (messageMode === 'text') sendCloudTextMessage(messageInput?.value || '');
});

messageImageInput?.addEventListener('change', () => {
  const file = messageImageInput.files?.[0];
  clearPendingImage();
  if (!file) return;
  if (!String(file.type || '').startsWith('image/')) {
    setMessageSyncStatus('error', '请选择图片文件');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    setMessageSyncStatus('error', '图片不能超过 10MB');
    return;
  }

  pendingImageFile = file;
  pendingImagePreviewUrl = URL.createObjectURL(file);
  if (messageImagePreview) messageImagePreview.src = pendingImagePreviewUrl;
  if (messageImagePreviewWrap) messageImagePreviewWrap.hidden = false;
  if (messageImageStatus) messageImageStatus.textContent = `${file.name || '这张图片'} · ${(file.size / 1024 / 1024).toFixed(1)}MB`;
  if (messageImageSendBtn) messageImageSendBtn.disabled = !cloudTodoReady;
});

messageImageSendBtn?.addEventListener('click', sendCloudImageMessage);

voiceRecordBtn?.addEventListener('click', () => {
  if (voiceMediaRecorder && voiceMediaRecorder.state !== 'inactive') {
    stopVoiceRecording();
  } else {
    startVoiceRecording();
  }
});
voiceSendBtn?.addEventListener('click', sendCloudVoiceMessage);

// ---------- 毛毡板便利贴事件 ----------
messageList?.addEventListener('click', (event) => {
  const note = event.target.closest('.felt-note[data-message-id]');
  if (!note || !messageList.contains(note)) return;
  const row = cloudMessageRowsById.get(String(note.dataset.messageId || ''));
  if (row) openStickyNoteModal(row);
});

closeStickyNoteModalBtn?.addEventListener('click', closeStickyNoteModal);
stickyNoteModal?.querySelector('[data-close-sticky-modal]')?.addEventListener('click', closeStickyNoteModal);
stickyNoteDeleteBtn?.addEventListener('click', deleteOpenedStickyNote);

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (stickyNoteModal?.classList.contains('show')) closeStickyNoteModal();
  if (todoDeleteModal?.classList.contains('show')) closeTodoDeleteConfirm();
  if (eatenDetailModal?.classList.contains('show')) closeEatenDetail();
  if (letterReaderModal?.classList.contains('show')) closeLetterReader();
  else if (mailboxModal?.classList.contains('show')) closeMailboxModal();
});

// ---------- 大门信箱事件 ----------
homeMailboxBtn?.addEventListener('click', openMailboxModal);
closeMailboxBtn?.addEventListener('click', closeMailboxModal);
mailboxModal?.querySelector('[data-close-mailbox]')?.addEventListener('click', closeMailboxModal);
mailboxTabs.forEach((button) => {
  button.addEventListener('click', () => switchMailboxTab(button.dataset.mailboxTab || 'inbox'));
});

letterBody?.addEventListener('input', () => {
  if (letterCounter) letterCounter.textContent = `${letterBody.value.length} / 1200`;
  if (letterSendBtn) letterSendBtn.disabled = !cloudTodoReady || !String(letterBody.value || '').trim();
});

letterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  sendCloudLetter(letterBody?.value || '', letterOccasion?.value || '平常的一天');
});

mailboxInbox?.addEventListener('click', (event) => {
  const item = event.target.closest('.mailbox-letter-item[data-letter-id]');
  if (!item || !mailboxInbox.contains(item)) return;
  const row = cloudLetterRowsById.get(String(item.dataset.letterId || ''));
  if (row) openLetterReader(row);
});

closeLetterReaderBtn?.addEventListener('click', closeLetterReader);
letterReaderDoneBtn?.addEventListener('click', closeLetterReader);
letterReaderModal?.querySelector('[data-close-letter-reader]')?.addEventListener('click', closeLetterReader);

copyCloudUidBtn?.addEventListener('click', async () => {
  const uid = copyCloudUidBtn.dataset.uid || cloudTodoUid;
  if (!uid) return;

  try {
    await navigator.clipboard.writeText(uid);
    const oldText = copyCloudUidBtn.textContent;
    copyCloudUidBtn.textContent = '已复制';
    window.setTimeout(() => {
      copyCloudUidBtn.textContent = oldText;
    }, 1200);
  } catch (_) {
    window.prompt('复制这个设备 ID：', uid);
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (shouldPollCloudTodos()) refreshCloudTodos({ silent: true });
  if (shouldPollCloudMessages()) refreshCloudMessages({ silent: true });
  if (shouldPollCloudEatenPlaces()) refreshCloudEatenPlaces({ silent: true });
  if (shouldPollCloudLetters()) refreshCloudLetters({ silent: true });
});

window.addEventListener('focus', () => {
  if (shouldPollCloudTodos()) refreshCloudTodos({ silent: true });
  if (shouldPollCloudMessages()) refreshCloudMessages({ silent: true });
  if (shouldPollCloudEatenPlaces()) refreshCloudEatenPlaces({ silent: true });
  if (shouldPollCloudLetters()) refreshCloudLetters({ silent: true });
});

window.addEventListener('pagehide', () => {
  stopVoiceStream();
  if (pendingImagePreviewUrl) URL.revokeObjectURL(pendingImagePreviewUrl);
  if (pendingVoicePreviewUrl) URL.revokeObjectURL(pendingVoicePreviewUrl);
  if (pendingEatenImagePreviewUrl) URL.revokeObjectURL(pendingEatenImagePreviewUrl);
});

setMessageMode('text');
// 网站加载后连接一次；访客提醒仍然保持独立，不受这里的 SQL / 云存储同步影响。
initCloudHomeSync();
window.setTimeout(() => {
  initVisitTracking();
  initNotificationSetup();
  initStandaloneNotifyShortcut();
}, 0);

// ===============================
// 第四步：访客记录 + 免费 Web Push 提醒（Publishable Key HTTP 调用版）
// ===============================
// 普通访客不会看到任何新增 UI。
// 只有你自己用 ?notify=setup 打开网站时，才会出现“访问提醒设置”。
// Server酱 SendKey 已从前端彻底移除。

const VISIT_CLIENT_COOLDOWN_MS = 5 * 60 * 1000;

function getLoveHouseDeviceId() {
  const key = 'love_house_device_id_v1';
  try {
    let id = localStorage.getItem(key) || '';
    if (!id) {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        id = window.crypto.randomUUID();
      } else {
        const bytes = new Uint8Array(16);
        if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
          window.crypto.getRandomValues(bytes);
          id = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        } else {
          id = `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        }
      }
      localStorage.setItem(key, id);
    }
    return id;
  } catch (_) {
    return `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

async function callLoveHouseNotify(action, data = {}) {
  const config = window.LOVE_HOUSE_CLOUD || {};
  const envId = String(config.envId || '').trim();
  const name = String(config.visitFunction || 'love-house-notify').trim();
  const publishableKey = String(config.publishableKey || '').trim();

  if (!envId) throw new Error('缺少 CloudBase 环境 ID');
  if (!name) throw new Error('缺少通知云函数名称');
  if (!publishableKey) throw new Error('缺少 CloudBase Publishable Key，请检查 cloudbase-config.js');

  // 通知云函数使用 Publishable Key 调 HTTP API。
  // Publishable Key 是 CloudBase 专门允许放在浏览器中的客户端 Key；
  // 数据库与通知都使用 Publishable Key，但数据库通过 RLS 限制可读写内容。
  const url = `https://${envId}.api.tcloudbasegateway.com/v1/functions/${encodeURIComponent(name)}`;
  const requestBody = {
    action,
    deviceId: getLoveHouseDeviceId(),
    ...data
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publishableKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
    keepalive: true
  });

  let payload = null;
  const raw = await response.text();
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch (_) {
      payload = { message: raw };
    }
  } else {
    payload = {};
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || `HTTP ${response.status}`;
    const error = new Error(`云函数请求失败：${message}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  let result = payload?.result ?? payload;
  if (typeof result === 'string') {
    try { result = JSON.parse(result); } catch (_) {}
  }
  return result || {};
}

async function initVisitTracking() {
  try {
    // 通知设置页是“主人设备”的配置入口，不应该算作一次访客访问。
    const params = new URLSearchParams(window.location.search || '');
    if (params.get('notify') === 'setup') return;

    // 已绑定 Push 的设备就是接收提醒的主人设备。主人自己逛小屋时不记录为访客，
    // 也避免刚刚配置通知后污染服务器的访问冷却/去重判断。
    try {
      if (localStorage.getItem('love_house_push_bound_v1') === '1') return;
    } catch (_) {}

    // v2 使用新的本地冷却 key，绕过之前测试阶段留下的 20 分钟旧冷却。
    // 真实访客的重复控制放在本机：同一设备 5 分钟内刷新不会重复提醒。
    const key = 'love_house_visit_ping_at_v2';
    const last = Number(localStorage.getItem(key) || 0);
    const now = Date.now();
    if (last && now - last < VISIT_CLIENT_COOLDOWN_MS) return;

    const result = await callLoveHouseNotify('visit', {
      path: window.location.pathname || '/',
      title: document.title || '我们的恋爱小屋',
      origin: window.location.origin || '',
      userAgent: navigator.userAgent || ''
    });

    if (!result?.ok) {
      throw new Error(result?.message || '访问记录没有被云端接收');
    }

    localStorage.setItem(key, String(now));
    console.log('[访客记录] 云端已接收：', result);
  } catch (error) {
    // 访问提醒失败绝不能影响网站本身。
    console.warn('[访客记录] 云函数暂时不可用：', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandaloneWebApp() {
  return window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

function ensureNotifySetupPanel() {
  let panel = document.getElementById('notifySetupPanel');
  if (panel) return panel;

  panel = document.createElement('div');
  panel.id = 'notifySetupPanel';
  panel.className = 'notify-setup-panel';
  panel.innerHTML = `
    <div class="notify-setup-card">
      <button id="closeNotifySetupBtn" class="notify-setup-close" type="button" aria-label="关闭">×</button>
      <div class="notify-setup-heart">♡</div>
      <h3>小屋访问提醒</h3>
      <p id="notifySetupText">正在检查这台设备是否支持通知…</p>
      <button id="enableNotifyBtn" class="notify-setup-main-btn" type="button">开启访问提醒</button>
      <button id="testNotifyBtn" class="notify-setup-test-btn" type="button" hidden>发送一条测试提醒</button>
      <div id="notifySetupStatus" class="notify-setup-status" aria-live="polite"></div>
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelector('#closeNotifySetupBtn')?.addEventListener('click', () => panel.remove());
  return panel;
}

function withTimeout(promise, timeoutMs, message, code = 'TIMEOUT') {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = window.setTimeout(() => {
      const error = new Error(message);
      error.code = code;
      reject(error);
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) window.clearTimeout(timer);
  });
}

function isEmbeddedBrowser() {
  const ua = navigator.userAgent || '';
  return /MicroMessenger|QQ\//i.test(ua);
}

function isCrossOriginIframe() {
  if (window.top === window.self) return false;
  try {
    return window.top.location.origin !== window.location.origin;
  } catch (_) {
    return true;
  }
}

async function waitForActiveServiceWorker(registration, timeoutMs = 12000) {
  if (!registration) {
    throw new Error('Service Worker 注册结果为空');
  }

  if (registration.active?.state === 'activated') return registration;

  let worker = registration.active || registration.waiting || registration.installing;

  if (!worker) {
    try {
      await registration.update();
    } catch (_) {}
    worker = registration.active || registration.waiting || registration.installing;
  }

  // 已经有一个可工作的 active worker 时直接使用。
  if (registration.active && ['activating', 'activated'].includes(registration.active.state)) {
    if (registration.active.state === 'activated') return registration;
    worker = registration.active;
  }

  if (!worker) {
    throw new Error('Service Worker 已注册，但浏览器没有返回可激活的 worker');
  }

  await withTimeout(
    new Promise((resolve, reject) => {
      if (worker.state === 'activated') return resolve();
      const onStateChange = () => {
        if (worker.state === 'activated') {
          worker.removeEventListener('statechange', onStateChange);
          resolve();
        } else if (worker.state === 'redundant') {
          worker.removeEventListener('statechange', onStateChange);
          reject(new Error('Service Worker 激活失败，请重试'));
        }
      };
      worker.addEventListener('statechange', onStateChange);
    }),
    timeoutMs,
    'Service Worker 激活超时，请点击重试。',
    'SW_ACTIVATE_TIMEOUT'
  );

  return registration;
}

async function clearBrokenLoveHouseServiceWorkers() {
  if (!('serviceWorker' in navigator) || typeof navigator.serviceWorker.getRegistrations !== 'function') return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister().catch(() => false)));
  } catch (_) {}
}

async function registerLoveHouseServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('当前浏览器不支持 Service Worker');
  }

  // 禁止使用旧 HTTP 缓存检查 sw.js，避免 Git 自动部署后浏览器仍拿到旧 worker。
  const registration = await navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none'
  });

  // ready 按规范应返回一个已激活 registration。上一版在 ready 失败时直接回退到
  // registration，可能把尚未激活的对象交给 PushManager，部分浏览器会因此报 scope=null。
  const readyRegistration = await withTimeout(
    navigator.serviceWorker.ready,
    12000,
    'Service Worker 尚未激活，请点击重试。',
    'SW_READY_TIMEOUT'
  );

  const usableRegistration = readyRegistration || registration;
  await waitForActiveServiceWorker(usableRegistration, 12000);

  if (!usableRegistration.scope) {
    throw new Error('Service Worker scope 尚未就绪');
  }
  if (!usableRegistration.pushManager) {
    throw new Error('浏览器没有为当前 Service Worker 提供 PushManager');
  }

  return usableRegistration;
}

async function savePushSubscription(subscription) {
  const json = subscription.toJSON();
  return callLoveHouseNotify('subscribe', {
    subscription: {
      endpoint: json.endpoint,
      expirationTime: json.expirationTime || null,
      keys: json.keys || {}
    },
    userAgent: navigator.userAgent || ''
  });
}

async function enableLoveHousePush(panel) {
  const config = window.LOVE_HOUSE_CLOUD || {};
  const publicKey = String(config.vapidPublicKey || '').trim();
  const status = panel.querySelector('#notifySetupStatus');
  const enableBtn = panel.querySelector('#enableNotifyBtn');
  const testBtn = panel.querySelector('#testNotifyBtn');

  if (!publicKey) {
    status.textContent = '缺少 VAPID 公钥，请检查 cloudbase-config.js。';
    return;
  }

  if (!window.isSecureContext) {
    status.textContent = '开启失败：网页必须通过 HTTPS 打开。';
    return;
  }

  if (isCrossOriginIframe()) {
    status.textContent = '开启失败：通知不能在嵌入式预览窗口中申请。请复制网址，在浏览器新标签页直接打开。';
    return;
  }

  if (isEmbeddedBrowser()) {
    status.textContent = '当前是微信/QQ内置浏览器，请复制网址到系统 Safari、Edge 或 Chrome 后再开启。';
    return;
  }

  let currentStage = '准备阶段';

  try {
    enableBtn.disabled = true;

    if (Notification.permission === 'denied') {
      const error = new Error('浏览器已经禁止这个网站发送通知，请先在地址栏的网站权限里改为“允许”。');
      error.code = 'PERMISSION_DENIED';
      throw error;
    }

    currentStage = '第 1/4 步';
    status.textContent = '第 1/4 步：正在申请系统通知权限…';
    const permission = Notification.permission === 'granted'
      ? 'granted'
      : await withTimeout(
          Notification.requestPermission(),
          15000,
          '通知权限请求没有返回。请检查浏览器地址栏是否出现了通知权限提示，或到“网站设置 → 通知”中手动允许。',
          'PERMISSION_TIMEOUT'
        );

    if (permission !== 'granted') {
      const error = new Error('你没有允许通知权限');
      error.code = 'PERMISSION_NOT_GRANTED';
      throw error;
    }

    currentStage = '第 2/4 步';
    status.textContent = '第 2/4 步：通知权限已允许，正在启动通知服务…';
    const registration = await withTimeout(
      registerLoveHouseServiceWorker(),
      12000,
      'Service Worker 注册超时，请刷新网页后重试。',
      'SW_REGISTER_TIMEOUT'
    );

    currentStage = '第 3/4 步';
    status.textContent = '第 3/4 步：正在连接浏览器推送服务…';
    let subscription = await withTimeout(
      registration.pushManager.getSubscription(),
      8000,
      '读取现有推送订阅超时。',
      'PUSH_GET_TIMEOUT'
    );

    if (!subscription) {
      subscription = await withTimeout(
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        }),
        20000,
        '浏览器推送服务连接超时。系统通知权限已经成功，但当前网络或浏览器无法完成 Push 订阅。',
        'PUSH_SUBSCRIBE_TIMEOUT'
      );
    }

    currentStage = '第 4/4 步';
    status.textContent = '第 4/4 步：正在把这台设备保存到小屋…';
    const result = await withTimeout(
      savePushSubscription(subscription),
      15000,
      'CloudBase 保存订阅超时，请检查云函数 love-house-notify 是否部署成功。',
      'SAVE_SUBSCRIPTION_TIMEOUT'
    );
    if (result?.ok === false) throw new Error(result.message || '云端保存失败');

    try { localStorage.setItem('love_house_push_bound_v1', '1'); } catch (_) {}
    document.getElementById('standaloneNotifyShortcut')?.remove();
    status.textContent = '已开启 ♡ 以后别人打开小屋，你这台设备会收到提醒。';
    enableBtn.textContent = '访问提醒已开启';
    testBtn.hidden = false;
  } catch (error) {
    console.error('[访问提醒设置]', error);

    const message = String(error?.message || error || '未知错误');

    if (/reading ['"]scope['"]|scope.*null|null.*scope/i.test(message) && currentStage !== '第 4/4 步') {
      // 只有在 Service Worker / Push 阶段出现 scope 异常时才清理注册记录。
      // 第 4 步已经取得 PushSubscription，再清理只会造成“无限重来”。
      await clearBrokenLoveHouseServiceWorkers();
      status.textContent = `${currentStage}：检测到浏览器里的通知服务记录异常，已自动清理。请再点一次“重新开启访问提醒”。`;
      enableBtn.textContent = '重新开启访问提醒';
    } else if (currentStage === '第 4/4 步') {
      status.textContent = `第 4/4 步失败：浏览器通知订阅已经成功，但保存到 CloudBase 云函数失败。${message}`;
    } else if (error?.code === 'PUSH_SUBSCRIBE_TIMEOUT') {
      status.textContent = `${currentStage}：系统通知权限已成功，但浏览器推送服务连接超时。若你现在用 Chrome，可先换 Edge 测试；iPhone 请使用“添加到主屏幕”后的 Safari Web App。`;
    } else {
      status.textContent = `开启失败（${currentStage}）：${message}`;
    }
    enableBtn.disabled = false;
  }
}

async function testLoveHousePush(panel) {
  const status = panel.querySelector('#notifySetupStatus');
  const testBtn = panel.querySelector('#testNotifyBtn');
  try {
    testBtn.disabled = true;
    status.textContent = '正在发送测试提醒…';
    const result = await withTimeout(
      callLoveHouseNotify('test', { origin: window.location.origin || '' }),
      20000,
      '测试请求超时，请检查 love-house-notify 云函数日志。',
      'TEST_PUSH_TIMEOUT'
    );
    if (result?.ok === false) throw new Error(result.message || '测试发送失败');

    const sent = Number(result?.sent || 0);
    const failed = Number(result?.failed || 0);
    if (sent <= 0) {
      const detail = Array.isArray(result?.failures) && result.failures.length
        ? `：${result.failures.map(item => `${item.statusCode || ''} ${item.message || ''}`.trim()).join('；')}`
        : '';
      throw new Error(`云端没有成功投递任何通知（失败 ${failed} 条）${detail}`);
    }

    status.textContent = `云端已接受 ${sent} 条推送${failed ? `，另有 ${failed} 条失败` : ''}。iPhone 请先回到桌面或锁屏，再下拉通知中心查看 ♡`;
  } catch (error) {
    status.textContent = `测试失败：${error?.message || error}`;
  } finally {
    testBtn.disabled = false;
  }
}

async function initNotificationSetup() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('notify') !== 'setup') return;

  const panel = ensureNotifySetupPanel();
  const text = panel.querySelector('#notifySetupText');
  const status = panel.querySelector('#notifySetupStatus');
  const enableBtn = panel.querySelector('#enableNotifyBtn');
  const testBtn = panel.querySelector('#testNotifyBtn');

  if (!window.isSecureContext) {
    text.textContent = '这个通知设置页必须通过 HTTPS 直接打开。';
    enableBtn.disabled = true;
    status.textContent = '当前页面不是安全上下文（HTTPS）';
    return;
  }

  if (isCrossOriginIframe()) {
    text.textContent = '当前页面似乎处于嵌入式预览窗口中。通知权限不能在跨域 iframe 里申请。';
    enableBtn.disabled = true;
    status.textContent = '请复制网站正式网址，在浏览器新标签页直接打开 ?notify=setup';
    return;
  }

  if (isEmbeddedBrowser()) {
    text.textContent = '微信/QQ 内置浏览器不适合作为这台设备的访问提醒接收端。';
    enableBtn.disabled = true;
    status.textContent = '请复制网址到系统 Safari、Edge 或 Chrome';
    return;
  }

  if (!('Notification' in window) || !('PushManager' in window) || !('serviceWorker' in navigator)) {
    text.textContent = '这台浏览器暂时不支持网页推送。可以换 Edge / Chrome，或在 iPhone 上添加到主屏幕后再试。';
    enableBtn.disabled = true;
    return;
  }

  if (isIOSDevice() && !isStandaloneWebApp()) {
    text.innerHTML = 'iPhone 需要先把这个页面 <b>添加到主屏幕</b>，再从主屏幕图标打开后开启通知。地址里的 <code>?notify=setup</code> 请保留。';
    enableBtn.disabled = true;
    status.textContent = 'Safari：分享 → 添加到主屏幕 → 从主屏幕打开';
    return;
  }

  text.textContent = '这个设置页只给你自己使用。开启后，普通访客不会看到它。';

  if (Notification.permission === 'denied') {
    status.textContent = '浏览器当前已禁止通知。请先在地址栏“网站设置 → 通知”中改为允许。';
  }

  // 不在页面初始化时自动注册/读取 Push。Push 订阅尽量只放在明确的用户点击手势里，
  // 可以避开部分浏览器首次安装 Service Worker 时的生命周期竞态。
  if (Notification.permission === 'granted') {
    status.textContent = '系统通知权限已经允许，点击下方按钮完成这台设备的绑定。';
  } else if (!status.textContent) {
    status.textContent = '准备就绪，点击下方按钮开始。';
  }

  enableBtn.addEventListener('click', () => enableLoveHousePush(panel));
  testBtn.addEventListener('click', () => testLoveHousePush(panel));
}


// iPhone 主屏幕 Web App 没有地址栏；manifest 的 start_url 是 ./，
// 所以从桌面图标启动时不会保留 Safari 里的 ?notify=setup。
// 仅在 iOS 主屏幕 Web App、且尚未完成绑定时显示一个很小的“通知设置”入口。
function initStandaloneNotifyShortcut() {
  if (!isIOSDevice() || !isStandaloneWebApp()) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get('notify') === 'setup') return;

  try {
    if (localStorage.getItem('love_house_push_bound_v1') === '1') return;
  } catch (_) {}

  if (document.getElementById('standaloneNotifyShortcut')) return;

  const button = document.createElement('button');
  button.id = 'standaloneNotifyShortcut';
  button.type = 'button';
  button.textContent = '♡ 通知设置';
  button.setAttribute('aria-label', '打开小屋访问提醒设置');
  Object.assign(button.style, {
    position: 'fixed',
    right: '14px',
    bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
    zIndex: '480',
    border: '1.5px solid rgba(255, 174, 205, .95)',
    borderRadius: '999px',
    padding: '9px 13px',
    color: '#ff6f9f',
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: '800',
    background: 'rgba(255,255,255,.90)',
    boxShadow: '0 8px 22px rgba(104, 74, 92, .16)',
    WebkitBackdropFilter: 'blur(12px)',
    backdropFilter: 'blur(12px)',
    WebkitTapHighlightColor: 'transparent'
  });

  button.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('notify', 'setup');
    window.history.pushState({}, '', url);
    button.remove();
    initNotificationSetup();
  });

  document.body.appendChild(button);
}

// ===============================
// Git -> CloudBase 新版本自动发现
// 页面一直开着也会知道网站已经重新部署。
// ===============================
const SITE_VERSION_CHECK_MS = 60 * 1000;
let currentSiteBuildVersion = '';
let siteVersionTimer = null;
let siteUpdateAlreadyFound = false;

function ensureSiteUpdateToast() {
  let toast = document.getElementById('siteUpdateToast');
  if (toast) return toast;

  toast = document.createElement('div');
  toast.id = 'siteUpdateToast';
  toast.className = 'site-update-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div class="site-update-copy">
      <div class="site-update-title">♡ 小屋有新变化啦</div>
      <div class="site-update-desc">新版本已经上线，点一下就能看到最新内容。</div>
    </div>
    <button id="siteUpdateBtn" class="site-update-btn" type="button">点击更新</button>
  `;
  document.body.appendChild(toast);

  toast.querySelector('#siteUpdateBtn')?.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('_refresh', Date.now().toString());
    window.location.href = url.toString();
  });

  return toast;
}

async function readSiteBuildVersion() {
  try {
    const response = await fetch(`site-version.json?_=${Date.now()}`, {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!response.ok) return '';
    const data = await response.json();
    return data && data.version ? String(data.version) : '';
  } catch (_) {
    return '';
  }
}

async function checkForSiteUpdate({ initial = false } = {}) {
  if (siteUpdateAlreadyFound) return;
  const latestVersion = await readSiteBuildVersion();
  if (!latestVersion) return;

  if (initial || !currentSiteBuildVersion) {
    currentSiteBuildVersion = latestVersion;
    return;
  }

  if (latestVersion !== currentSiteBuildVersion) {
    siteUpdateAlreadyFound = true;
    ensureSiteUpdateToast().classList.add('show');
  }
}

async function initSiteVersionWatcher() {
  await checkForSiteUpdate({ initial: true });
  siteVersionTimer = window.setInterval(() => {
    if (document.visibilityState === 'visible') checkForSiteUpdate();
  }, SITE_VERSION_CHECK_MS);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkForSiteUpdate();
});
window.addEventListener('focus', () => checkForSiteUpdate());

initSiteVersionWatcher();
