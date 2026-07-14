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
  window.scrollTo({ top: 0, behavior: "smooth" });
});

backBtn.addEventListener("click", () => {
  memoryPage.classList.remove("active");
  homePage.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ===============================
// 回忆数据区
// 之后你主要改这里就可以
// 日期格式必须是：YYYY-MM-DD
// image 写你的图片路径，例如：images/2026-04-01.jpg
// ===============================

const memories = {
  "2026-03-31": {
    title: "那一天你走进了我的生命",
    image: "images/20260331.jpg",
    text: "小众姓联盟成立！"
  },


 "2026-04-14": {
    title: "第一次见面",
    images: ["images/20260414-1.jpg",
	"images/20260414-2.jpg",
	"images/20260414-3.jpg",
	"images/20260414-4.jpg",
    ],
    text: "暴走西湖🚶"
  },

 "2026-04-25": {
    title: "边总莅临和山，意欲收购工大",
    images: ["images/20260425-1.jpg",
	"images/20260425-2.jpg",
	"images/20260425-3.jpg",
	"images/20260425-4.jpg",
    ],
    text: "可惜没有多拍几张照片"
  },


 "2026-04-28": {
    title: "小狗假意收伞，趁机智取小手",
    images: ["images/20260428-1.jpg",
	"images/20260428-2.jpg",
	"images/20260428-3.jpg",
	"images/20260428-4.jpg",
    ],
    text: "你的伞小，打你的伞"
  },

 "2026-05-04": {
    title: "🌄 💐 ✉️ ",
    images: ["images/20260504-1.jpg",
	"images/20260504-2.jpg",
	"images/20260504-3.jpg",
	"images/20260504-4.jpg",
	"images/20260504-5.jpg",
	"images/20260504-6.jpg",
    ],
    text: "谈很久很久的恋爱"
  },

 "2026-05-07": {
    title: "给我庆生🎂",
    images: ["images/20260507-1.jpg",
	"images/20260507-2.jpg",
	"images/20260507-3.jpg",
	"images/20260507-4.jpg",
	"images/20260507-5.jpg",
	    ],
    text: "谢谢宝宝，过得很开心的一个生日"
  },

  "2026-05-09": {
    title: "在一起",
    images: ["images/20260509-1.jpg",
	 "images/20260509-2.jpg",
	 "images/20260509-3.jpg",
	 "images/20260509-4.jpg",
	    ],

    text: "城市阳台的风缓缓的，我们坐在长椅上聊着有的没的，贴在一起的时候，感到无比安心和放松"
  },

"2026-05-17": {
    title: "提前过520",
    images: ["images/20260517-1.jpg",
	 "images/20260517-2.jpg",
	 "images/20260517-3.jpg",
	 "images/20260517-4.jpg",
	 "images/20260517-5.jpg",
	    ],

    text: "拍立得万岁！"
  },

"2026-05-22": {
    title: "拼豆＆牛肉火锅",
    images: ["images/20260522-1.jpg",
	 "images/20260522-2.jpg",
	 "images/20260522-3.jpg",
	 "images/20260522-4.jpg",
	 "images/20260522-5.jpg",
	 "images/20260522-6.jpg",
	 "images/20260522-7.jpg",
	    ],

    text: "拼豆超级放松，很好吃的一顿牛肉"
  },

  "2026-06-01": {
    title: "儿童节特辑",
    images: ["images/20260601-1.jpg",
	 "images/20260601-2.jpg",
	 "images/20260601-3.jpg",
	 "images/20260601-4.jpg",
	 "images/20260601-5.jpg",
	 "images/20260601-6.jpg",
	 "images/20260601-7.jpg",
	    ],
    text: "不要放过这个小年糕小豆腐小大福"
 },


  "2026-06-06": {
    title: "穿上我买的睡衣了",
    image: "images/20260606-1.jpg",
    text: "超级适配、轻松驾驭、美衣配美人"
 },


"2026-06-09": {
    title: "小蛋糕屏保生成中...",
    images: ["images/20260609-1.jpg",
	 "images/20260609-2.jpg",
	 "images/20260609-3.jpg",
	    ],

    text: "超多口味的小蛋糕供我选择，最喜欢的三张"
  },

"2026-06-10": {
    title: "被宝宝投喂杨梅了",
    images: ["images/20260610-1.jpg",
	 "images/20260610-2.jpg",
	 "images/20260610-3.jpg",
	    ],

    text: "乒乓球一样大的杨梅，没吃过这么大的，而且很甜很新鲜"
  },

"2026-06-14": {
    title: "爱上泉市果切♥",
    images: ["images/20260614-1.jpg",
	 "images/20260614-2.jpg",
	 "images/20260614-3.jpg",
	 "images/20260614-4.jpg",
	 "images/20260614-5.jpg",
	    ],
    text: "超鲜的牛肉，意外爱上的果切，美味的蛋糕"
  },

"2026-06-20": {
    title: "一个臭美的女子",
    images: ["images/20260620-1.jpg",
	 "images/20260620-2.jpg",
	 "images/20260620-3.jpg",
	 "images/20260620-4.jpg",
	 "images/20260620-5.jpg",
	    ],
    text: "臭美？绝美！退可萌得钥匙，进可姐得勾人"
  },



};

// ===============================
// 生成从 2026-03-31 到今天的每日时间轴
// ===============================

const START_DATE = new Date("2026-03-31T00:00:00");
const today = new Date();
today.setHours(0, 0, 0, 0);

const timelineList = document.getElementById("timelineList");
const dateTag = document.getElementById("dateTag");

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

function createTimeline() {
  timelineList.innerHTML = "";

  // 只获取 memories 里面已经填写的日期，并按照日期从早到晚排序
  const memoryDates = Object.keys(memories).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  // 如果还没有任何回忆，就显示一个提示
  if (memoryDates.length === 0) {
    timelineList.innerHTML = `
      <div class="empty-timeline">
        还没有添加回忆哦，之后可以在 script.js 的 memories 里面添加。
      </div>
    `;
    return;
  }

  memoryDates.forEach((dateKey, index) => {
    const dateText = formatDateText(dateKey);
    const memory = memories[dateKey];

    const item = document.createElement("div");

    // 按照日期顺序左右交错排列
    item.className = `timeline-item ${index % 2 === 0 ? "left" : "right"}`;
    item.dataset.date = dateText;

    const node = document.createElement("div");
    node.className = "timeline-node";

    const card = document.createElement("article");
    card.className = "memory-card";

    const date = document.createElement("div");
    date.className = "memory-date";
    date.textContent = dateText;

const photo = document.createElement("div");
photo.className = "memory-photo";

const imageList = getMemoryImages(memory);
let currentImageIndex = 0;
let hasSwiped = false;

if (imageList.length > 0) {
  photo.classList.add("has-image");

  const img = document.createElement("img");
  img.src = imageList[currentImageIndex];
  img.alt = memory.title || dateText;
  photo.appendChild(img);

  if (imageList.length > 1) {
    photo.classList.add("has-multiple");

    const prevBtn = document.createElement("button");
    prevBtn.className = "slide-btn slide-prev";
    prevBtn.textContent = "‹";

    const nextBtn = document.createElement("button");
    nextBtn.className = "slide-btn slide-next";
    nextBtn.textContent = "›";

    const dots = document.createElement("div");
    dots.className = "slide-dots";

    imageList.forEach((_, dotIndex) => {
      const dot = document.createElement("span");
      dot.className = dotIndex === 0 ? "dot active" : "dot";
      dots.appendChild(dot);
    });

    function updateSlide() {
      img.src = imageList[currentImageIndex];

      const dotList = dots.querySelectorAll(".dot");
      dotList.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentImageIndex);
      });
    }

    function showPrev() {
      currentImageIndex =
        (currentImageIndex - 1 + imageList.length) % imageList.length;
      updateSlide();
    }

    function showNext() {
      currentImageIndex =
        (currentImageIndex + 1) % imageList.length;
      updateSlide();
    }

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hasSwiped = true;
      showPrev();
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hasSwiped = true;
      showNext();
    });

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
  endX = startX; // 关键：单击时 endX 和 startX 保持一致
  hasSwiped = false;
});

photo.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

photo.addEventListener("touchend", () => {
  const distance = endX - startX;

  // 只有真正滑动超过 40px，才切换图片
  if (Math.abs(distance) > 40) {
    hasSwiped = true;

    if (distance > 0) {
      showPrev();
    } else {
      showNext();
    }
  } else {
    hasSwiped = false; // 单击时允许打开描述弹窗
  }

  startX = 0;
  endX = 0;
});

    photo.appendChild(prevBtn);
    photo.appendChild(nextBtn);
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

    const desc = document.createElement("p");
    desc.className = "memory-desc";
    desc.textContent = "点击查看这一天的具体记录";

   photo.addEventListener("click", () => {
  if (hasSwiped) {
    hasSwiped = false;
    return;
  }

  const imageList = getMemoryImages(memory);
  const currentImage = imageList[currentImageIndex] || "";

  openMemoryModal(dateText, memory, currentImage);
});

    card.appendChild(date);
    card.appendChild(photo);
    card.appendChild(title);
    card.appendChild(desc);

    item.appendChild(node);
    item.appendChild(card);

    timelineList.appendChild(item);
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
      modalImg.src = "";
      modalImg.style.display = "none";
    }
  } else {
    modalTitle.textContent = "这一天的回忆";
    modalText.textContent = "这里还没有添加内容。";
    modalImg.src = "";
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
        <img src="${music.cover}" alt="${music.title}">
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
  currentMusicIndex = index;

  bgMusic.src = music.src;
  bgMusic.loop = true;
  bgMusic.play();

  musicPlayerBtn.classList.add("playing");
  playerDisc.classList.remove("empty");
  playerDisc.innerHTML = `<img src="${music.cover}" alt="${music.title}">`;

  updateActiveAlbum();
  closeMusicPanel();
}

function updateActiveAlbum() {
  const albumItems = document.querySelectorAll(".album-item");

  albumItems.forEach((item, index) => {
    item.classList.toggle("active", index === currentMusicIndex);
  });
}

function openMusicPanel() {
  musicPanel.classList.add("show");
  updateActiveAlbum();
}

function closeMusicPanel() {
  musicPanel.classList.remove("show");
}

musicPlayerBtn.addEventListener("click", openMusicPanel);
closeMusicPanelBtn.addEventListener("click", closeMusicPanel);
musicPanelMask.addEventListener("click", closeMusicPanel);

bgMusic.addEventListener("pause", () => {
  musicPlayerBtn.classList.remove("playing");
});

bgMusic.addEventListener("play", () => {
  musicPlayerBtn.classList.add("playing");
});

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
// 🆕 新增：访客开门暗中提醒功能
// ===============================
function sendVisitNotification() {
  // 替换成你在Server酱复制的专属 SendKey
  const SEND_KEY = "这里填你复制的SCT开头的Key"; 
  
  // 组装推送的内容
  const title = encodeURIComponent("有人敲开鱼鱼和獭獭的小屋门啦！");
  const desp = encodeURIComponent(`访问时间：${new Date().toLocaleString()}\n快去看看是不是宝宝来看回忆了~`);
  
  // 利用浏览器自带的 fetch 暗中发送请求，不影响网页本身的正常加载
  fetch(`https://sctapi.ftqq.com/${SEND_KEY}.send?title=${title}&desp=${desp}`, {
    method: "POST",
    mode: "no-cors" // 采用no-cors模式防止跨域报错阻碍网页运行
  })
  .then(() => console.log("欢迎回家~"))
  .catch((err) => console.log("网络开小差啦"));
}

// 只要网页一加载，立刻触发提醒
sendVisitNotification();