const KEY = "zhoumo-dazi-v1";
const ROLE_KEY = "zhoumo-dazi-role";
const AVAIL = ["周六上午", "周六下午", "周六晚上", "周日上午", "周日下午", "周日晚上"];
const TYPES = ["餐饮", "零售", "活动", "其他"];
const SETTLES = ["日结", "完工结算", "周结"];

const ui = {
  role: localStorage.getItem(ROLE_KEY) || "student",
  q: "",
  date: "all",
  type: "all",
  pay: 0,
  dist: 0,
  mineTab: "all",
  jobFilter: "all",
  workTab: "hired",
  flash: null,
  keepFlash: false,
  confirm: null,
  formError: [],
  draftJob: null,
  lastRoute: "",
  composing: false,
};

let state = load();

function seed() {
  return {
    profile: {
      name: "林夏",
      school: "城市大学 · 大三",
      skills: ["沟通", "收银"],
      availability: ["周六上午", "周六下午", "周日下午"],
      commute: 5,
      expected: 25,
      intro: "周末可以稳定出勤，希望找距离近、结算清楚的班次。",
    },
    shop: {
      name: "白日集市",
      contact: "王店长",
      phone: "13800001111",
      address: "滨河公园南门",
      intro: "校园周边的市集和快闪活动。",
    },
    jobs: [
      job("j1", "咖啡店周末帮班", "餐饮", 28, "日结", "2026-10-24", "10:00", "14:00", "校园东门", 1.2, 2, "负责点单、出杯和简单清洁。开班前会有 15 分钟带教。", "守时，沟通清楚。不需要咖啡经验。", "山野咖啡", "林店员", "13800001001", 4.8),
      job("j2", "市集活动引导", "活动", 35, "完工结算", "2026-10-25", "13:00", "18:00", "文化广场 2 号口", 2.4, 3, "引导入场、回答路线，并提醒观众有序排队。", "表达清楚，能站立约 4 小时。", "城南市集", "周主管", "13800001002", 4.7),
      job("j3", "书店整理与收银协助", "零售", 30, "日结", "2026-10-24", "14:00", "18:00", "大学路", 0.8, 2, "上架、整理台面，忙时协助收银和打包。", "细心。熟悉移动支付即可。", "页间书店", "苏店长", "13800001003", 4.9),
      job("j4", "花店周末打包", "零售", 26, "日结", "2026-10-25", "09:00", "13:00", "南门花市 12 号", 1.6, 1, "按订单包花、贴卡片，并帮忙接待到店顾客。", "动手仔细。花艺经验不是必须。", "南风花店", "马老板", "13800001004", 4.6),
      job("j5", "展会扫码协助", "活动", 40, "完工结算", "2026-10-24", "09:00", "17:00", "国际会展中心 A 馆", 4.5, 4, "协助观众扫码入场，解答基础路线问题。", "周六可以上全天，沟通耐心。", "青年创意周", "何经理", "13800001005", 4.5),
      job("j6", "奶茶店晚班出杯", "餐饮", 27, "日结", "2026-10-25", "17:00", "21:00", "生活区底商", 0.6, 2, "按配方出杯、封口，并保持操作台整洁。", "能接受晚班。无需饮品经验。", "半糖奶茶", "陈店长", "13800001006", 4.7),
      job("j7", "便利店理货", "零售", 25, "周结", "2026-10-24", "08:00", "12:00", "西门", 1.1, 2, "补货、核对效期，并把促销商品摆到指定位置。", "早上能到。会按清单核对即可。", "全日便利", "赵店长", "13800001007", 4.4),
      job("j8", "品牌快闪导购", "活动", 38, "完工结算", "2026-10-25", "11:00", "16:00", "滨河公园南门", 3.2, 2, "介绍产品、引导体验，并记录到访人数。", "表达自然。不需要硬性销售指标。", "白日快闪", "王店长", "13800001111", 4.8),
    ],
    applications: [
      app("a6", "j6", true, "pending", "2026-10-21T09:20:00", { name: "林夏", school: "城市大学 · 大三", skills: ["沟通", "收银"], availability: ["周六上午", "周六下午", "周日下午"], commute: 5, note: "周日晚上可以到，出杯我可以现学。" }),
      app("a1", "j2", false, "pending", "2026-10-21T08:10:00", { name: "周予安", school: "城市大学 · 大二", skills: ["活动引导", "沟通"], availability: ["周日下午"], commute: 3, note: "做过校园开放日志愿者。" }),
      app("a2", "j1", false, "hired", "2026-10-20T11:00:00", { name: "陈可", school: "城市大学 · 大一", skills: ["餐饮服务"], availability: ["周六上午"], commute: 5, note: "" }, { studentConfirmed: true }),
      app("a5", "j5", false, "rejected", "2026-10-20T09:30:00", { name: "何舟", school: "城市大学 · 大四", skills: ["展会执行"], availability: ["周六上午"], commute: 8, note: "只能上到中午。" }),
      app("a4", "j4", false, "cancelled", "2026-10-19T15:00:00", { name: "马一楠", school: "城市大学 · 大二", skills: ["打包"], availability: ["周日上午"], commute: 2, note: "" }, { cancelBy: "student" }),
      app("a3", "j3", false, "done", "2026-10-18T10:00:00", { name: "苏晚", school: "城市大学 · 大三", skills: ["收银", "整理"], availability: ["周六下午"], commute: 2, note: "" }, { studentConfirmed: true, arrived: true, review: { score: 5, text: "交代清楚，下班后当时就结了。", at: "2026-10-18T18:30:00" } }),
    ],
  };
}

function job(id, title, type, pay, settle, date, start, end, address, distance, slots, duties, requirements, merchant, contact, phone, rating) {
  return {
    id, title, type, pay, settle, date, start, end, address, distance, slots, duties, requirements, closed: false,
    merchant: { name: merchant, verified: true, category: type, contact, phone, rating },
  };
}

function app(id, jobId, owner, status, createdAt, student, extra) {
  return Object.assign({
    id, jobId, owner, status, createdAt, student,
    arrived: false, studentConfirmed: false, cancelBy: "", review: null,
  }, extra || {});
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && Array.isArray(raw.jobs) && Array.isArray(raw.applications) && raw.profile && raw.shop) return raw;
  } catch (error) { /* use seed */ }
  const fresh = seed();
  try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch (error) { /* ignore */ }
  return fresh;
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (error) { toast("浏览器阻止了本地保存，这次修改只留在当前页面。"); }
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

function routeParts() {
  return (location.hash || "#/").replace(/^#/, "").split("?")[0].split("/").filter(Boolean);
}

function jobById(id) { return state.jobs.find((item) => item.id === id); }
function appById(id) { return state.applications.find((item) => item.id === id); }

function remaining(item) {
  const used = state.applications.filter((row) => row.jobId === item.id && (row.status === "hired" || row.status === "done")).length;
  return Math.max(0, item.slots - used);
}

function phaseOf(item) {
  if (item.closed) return "ended";
  if (remaining(item) <= 0) return "full";
  return "recruiting";
}

function phaseLabel(phase) {
  return { recruiting: "招聘中", full: "已招满", ended: "已结束" }[phase] || "招聘中";
}

function parseDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function weekday(iso) {
  return "周" + "日一二三四五六"[parseDate(iso).getDay()];
}

function shortDate(iso) {
  const date = parseDate(iso);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function when(item) {
  return `${weekday(item.date)} ${shortDate(item.date)} ${item.start}–${item.end}`;
}

function distText(value) {
  return String(Math.round(Number(value) * 10) / 10).replace(/\.0$/, "");
}

function fmtTime(iso) {
  const date = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function byTime(a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); }

function statusOf(row) {
  if (row.status === "hired" && row.arrived) return ["已到岗", "good"];
  return {
    pending: ["待确认", "warn"],
    hired: ["待到岗", "good"],
    done: ["已完成", "info"],
    rejected: ["已拒绝", "bad"],
    cancelled: ["已取消", "muted"],
  }[row.status] || ["未知", "muted"];
}

function statusPill(row) {
  const [label, kind] = statusOf(row);
  return `<span class="status ${kind}">${label}</span>`;
}

function toast(text) {
  const node = document.getElementById("toast");
  node.textContent = text;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 2600);
}

function go(hash, flash) {
  ui.flash = flash || null;
  ui.keepFlash = !!flash;
  ui.confirm = null;
  if ((location.hash || "#/") === hash) render();
  else location.hash = hash;
}

function canApply(item) {
  if (!item) return { ok: false, reason: "这个岗位不存在。" };
  if (item.closed) return { ok: false, reason: "这个岗位已经结束招聘。" };
  if (remaining(item) <= 0) return { ok: false, reason: "这个班次的名额已经满了。" };
  const mine = state.applications.find((row) => row.owner && row.jobId === item.id && !["rejected", "cancelled"].includes(row.status));
  if (mine) return { ok: false, reason: "你已经申请过这个岗位。", row: mine };
  return { ok: true };
}

function filteredJobs() {
  const query = ui.q.trim().toLowerCase();
  return state.jobs.filter((item) => {
    if (ui.date !== "all" && item.date !== ui.date) return false;
    if (ui.type !== "all" && item.type !== ui.type) return false;
    if (ui.pay && item.pay < ui.pay) return false;
    if (ui.dist && item.distance > ui.dist) return false;
    if (!query) return true;
    const blob = `${item.title} ${item.type} ${item.address} ${item.merchant.name} ${item.duties}`.toLowerCase();
    return blob.includes(query);
  }).sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
}

function filtersOn() {
  return ui.q || ui.date !== "all" || ui.type !== "all" || ui.pay > 0 || ui.dist > 0;
}

function mineApps() {
  return state.applications.filter((row) => row.owner).sort(byTime);
}

function snapshotStudent(note) {
  const profile = state.profile;
  return {
    name: profile.name,
    school: profile.school,
    skills: profile.skills.slice(),
    availability: profile.availability.slice(),
    commute: profile.commute,
    note: note || "",
  };
}

function shell(content) {
  return `
    <header class="top">
      <div class="bar">
        <div class="bar-row">
          <a class="brand" href="#/"><span class="mark">搭</span>周末搭子</a>
          <div class="role" role="group" aria-label="切换身份">
            <button type="button" data-act="role" data-role="student" aria-pressed="${ui.role === "student"}">学生端</button>
            <button type="button" data-act="role" data-role="merchant" aria-pressed="${ui.role === "merchant"}">商家端</button>
          </div>
        </div>
        <nav class="nav">${nav()}</nav>
      </div>
    </header>
    <div class="notice"><p>这是前端演示。岗位和申请保存在这台浏览器里，刷新后还在，但不是真实招聘或支付服务。</p></div>
    <main class="wrap">${content}</main>
    <footer class="foot"><p>周末搭子 · 大学生周末兼职撮合</p></footer>`;
}

function nav() {
  const parts = routeParts();
  const current = parts[0] || "discover";
  const items = ui.role === "merchant"
    ? [["#/merchant", "工作台", "merchant"], ["#/merchant/new", "发布兼职", "post"]]
    : [["#/", "发现兼职", "discover"], ["#/mine", "我的兼职", "mine"], ["#/profile", "个人中心", "profile"]];
  return items.map(([href, label, key]) => {
    const on = key === "post" ? parts[1] === "new" : key === "merchant" ? current === "merchant" && parts[1] !== "new" : current === key || (key === "discover" && !parts.length);
    return `<a class="${on ? "on" : ""}" href="${href}">${label}</a>`;
  }).join("");
}

function merchantSub(active) {
  const pending = state.applications.filter((row) => row.status === "pending").length;
  const items = [["#/merchant", "概况", "home"], ["#/merchant/jobs", "岗位", "jobs"], ["#/merchant/apps", `申请 ${pending}`, "apps"], ["#/merchant/work", "用工", "work"]];
  return `<div class="subnav">${items.map(([href, label, key]) => `<a class="${active === key ? "on" : ""}" href="${href}">${label}</a>`).join("")}</div>`;
}

function flash() {
  if (!ui.flash) return "";
  return `<div class="flash ${ui.flash.type === "bad" ? "bad" : "ok"}">${esc(ui.flash.text)}</div>`;
}

function empty(title, text, action) {
  return `<div class="empty"><h2>${esc(title)}</h2><p>${esc(text)}</p>${action || ""}</div>`;
}

function notFound(text, href, label) {
  return empty(text, "这个链接没有对应的内容。", `<a class="btn" href="${href}">${esc(label)}</a>`);
}

function confirmBox(id, next, label, by) {
  const open = ui.confirm && ui.confirm.id === id && ui.confirm.act === next;
  if (open) {
    return `<span class="confirm">确认要${esc(label)}？
      <button type="button" class="btn small danger" data-act="${esc(next)}" data-id="${esc(id)}" data-by="${esc(by || "")}">确认</button>
      <button type="button" class="btn small ghost" data-act="cancel-ask">返回</button>
    </span>`;
  }
  return `<button type="button" class="btn small ghost" data-act="ask" data-next="${esc(next)}" data-id="${esc(id)}" data-by="${esc(by || "")}">${esc(label)}</button>`;
}

function studentLine(person) {
  const skills = (person.skills || []).join("、") || "未填";
  const times = (person.availability || []).join("、") || "未填";
  return `<p><strong>${esc(person.name)}</strong> · ${esc(person.school || "未填学校")}</p>
    <p class="muted">技能 ${esc(skills)} · 可工作 ${esc(times)} · 通勤 ${esc(person.commute || "—")} 公里内</p>
    ${person.note ? `<p>留言：${esc(person.note)}</p>` : ""}`;
}

function jobCard(item) {
  const phase = phaseOf(item);
  const hints = [];
  if (item.distance > Number(state.profile.commute)) hints.push("超出你的通勤范围");
  if (item.pay < Number(state.profile.expected)) hints.push("时薪低于你的期望");
  const foot = phase === "ended" ? "已结束" : phase === "full" ? "已招满" : `还招 ${remaining(item)} 人`;
  return `<article class="card">
    <div class="card-top"><div class="pay"><strong>${esc(item.pay)}</strong><span>元/小时</span></div><span class="pill">${esc(item.type)}</span></div>
    <h3>${esc(item.title)}</h3>
    <p class="muted">${esc(when(item))} · ${esc(distText(item.distance))} 公里</p>
    <p class="muted">${esc(item.merchant.name)} · ${esc(item.address)}</p>
    <div class="card-foot"><span class="muted">${foot} · ${esc(item.settle)}</span><a class="btn small" href="#/job/${esc(item.id)}">查看</a></div>
    ${hints.length ? `<p class="hint">${esc(hints.join(" · "))}</p>` : ""}
  </article>`;
}

function progress(row) {
  if (row.status === "rejected") return `<p class="callout bad">商家没有录用这次申请。</p>`;
  if (row.status === "cancelled") {
    const who = row.cancelBy === "merchant" ? "商家取消了这次安排。" : "这次申请已取消。";
    return `<p class="callout">${who}</p>`;
  }
  const flags = [
    true,
    row.status === "hired" || row.status === "done",
    !!row.studentConfirmed || row.status === "done",
    !!row.arrived || row.status === "done",
    row.status === "done",
    !!row.review,
  ];
  const names = ["提交申请", "商家录用", "确认安排", "到岗", "完成", "评价"];
  const now = flags.findIndex((flag) => !flag);
  return `<ol class="steps">${names.map((name, index) => `<li class="${flags[index] ? "done" : ""} ${index === now ? "now" : ""}">${name}</li>`).join("")}</ol>`;
}

function selectBox(id, label, value, choices) {
  const options = choices.map(([key, text]) => `<option value="${esc(key)}" ${String(value) === String(key) ? "selected" : ""}>${esc(text)}</option>`).join("");
  return `<label class="field"><span>${esc(label)}</span><select id="${esc(id)}">${options}</select></label>`;
}

function viewDiscover() {
  const jobs = filteredJobs();
  const dates = [["all", "全部日期"]].concat([...new Set(state.jobs.map((item) => item.date))].sort().map((date) => [date, `${weekday(date)} ${shortDate(date)}`]));
  const types = [["all", "全部类型"]].concat(TYPES.map((type) => [type, type]));
  const list = jobs.length ? `<div class="grid">${jobs.map(jobCard).join("")}</div>` : empty("没有符合条件的班次", "放宽日期、距离或时薪后再看看。", `<button type="button" class="btn" data-act="clear-filters">清除筛选</button>`);
  return `${flash()}
    <div class="page-head"><div><h1>本周末的班次</h1><p class="lead">时薪、时间、地点和结算方式都写在卡片上。筛完再决定要不要申请。</p></div></div>
    <div class="filters">
      <label class="field"><span>搜索</span><input id="q" value="${esc(ui.q)}" placeholder="岗位、商家或地点" /></label>
      ${selectBox("f-date", "工作日期", ui.date, dates)}
      ${selectBox("f-type", "工作类型", ui.type, types)}
      ${selectBox("f-pay", "薪资范围", ui.pay, [["0", "不限时薪"], ["25", "25 元以上"], ["30", "30 元以上"], ["35", "35 元以上"]])}
      ${selectBox("f-dist", "通勤距离", ui.dist, [["0", "不限距离"], ["1", "1 公里内"], ["3", "3 公里内"], ["5", "5 公里内"]])}
    </div>
    <div class="split"><p class="muted">共 ${jobs.length} 个班次</p>${filtersOn() ? `<button type="button" class="btn small ghost" data-act="clear-filters">清除筛选</button>` : ""}</div>
    <div class="section">${list}</div>`;
}

function viewJob(id) {
  const item = jobById(id);
  if (!item) return notFound("找不到这个岗位", "#/", "回兼职列表");
  const phase = phaseOf(item);
  const check = canApply(item);
  let action = "";
  if (check.ok) {
    action = `<form id="apply-form" data-id="${esc(item.id)}">
      <label class="field"><span>给商家的留言，可选</span><textarea name="note" placeholder="例如：可以提前 10 分钟到。"></textarea></label>
      <button class="btn block" type="submit">提交申请</button>
    </form>`;
  } else if (check.row) {
    action = `<p class="callout">${esc(check.reason)}</p><a class="btn block" href="#/mine/${esc(check.row.id)}">查看申请进度</a>`;
  } else {
    action = `<p class="callout">${esc(check.reason)}</p><a class="btn ghost block" href="#/">看看其他班次</a>`;
  }
  return `${flash()}
    <p class="muted"><a href="#/">返回列表</a></p>
    <div class="detail section">
      <div>
        <div class="card-top"><span class="pill">${esc(item.type)}</span><span class="status ${phase === "recruiting" ? "good" : phase === "full" ? "warn" : "muted"}">${phaseLabel(phase)}</span><span class="pill verified">${item.merchant.verified ? "商家已核验" : "商家未核验"}</span></div>
        <h1>${esc(item.title)}</h1>
        <p class="lead">${esc(item.merchant.name)} · 评分 ${esc(item.merchant.rating)}</p>
        <div class="facts">
          <div class="fact"><span>时薪</span><strong>${esc(item.pay)} 元/小时</strong></div>
          <div class="fact"><span>结算</span><strong>${esc(item.settle)}</strong></div>
          <div class="fact"><span>时间</span><strong>${esc(when(item))}</strong></div>
          <div class="fact"><span>距离</span><strong>${esc(distText(item.distance))} 公里</strong></div>
        </div>
        <section class="section prose">
          <h2>工作内容</h2><p>${esc(item.duties)}</p>
          <h2 class="section">岗位要求</h2><p>${esc(item.requirements)}</p>
        </section>
        <section class="section">
          <h2>地点与商家</h2>
          <div class="card" style="margin-top:12px">
            <p><strong>${esc(item.address)}</strong></p>
            <p class="muted">联系人 ${esc(item.merchant.contact)} · ${esc(item.merchant.phone)}</p>
            <p class="muted">演示数据中的商家默认标记为已核验，方便查看信任信息怎么呈现。</p>
          </div>
        </section>
      </div>
      <aside class="card sticky">
        <div class="pay"><strong>${esc(item.pay)}</strong><span>元/小时 · ${esc(item.settle)}</span></div>
        <p class="muted" style="margin:8px 0 14px">${phaseLabel(phase)} · ${phase === "recruiting" ? `还招 ${remaining(item)} 人` : `计划 ${item.slots} 人`}</p>
        ${action}
      </aside>
    </div>`;
}

function viewMine() {
  const rows = mineApps();
  const tabs = [
    ["all", `全部 ${rows.length}`],
    ["pending", `待确认 ${rows.filter((row) => row.status === "pending").length}`],
    ["hired", `待到岗 ${rows.filter((row) => row.status === "hired").length}`],
    ["done", `已完成 ${rows.filter((row) => row.status === "done").length}`],
    ["closed", `拒绝/取消 ${rows.filter((row) => row.status === "rejected" || row.status === "cancelled").length}`],
  ];
  const shown = rows.filter((row) => {
    if (ui.mineTab === "pending") return row.status === "pending";
    if (ui.mineTab === "hired") return row.status === "hired";
    if (ui.mineTab === "done") return row.status === "done";
    if (ui.mineTab === "closed") return row.status === "rejected" || row.status === "cancelled";
    return true;
  });
  const list = shown.length ? `<div class="stack">${shown.map(mineCard).join("")}</div>` : empty("这里还没有记录", "去看看本周末还在招的班次。", `<a class="btn" href="#/">发现兼职</a>`);
  return `${flash()}
    <div class="page-head"><div><h1>我的兼职</h1><p class="lead">申请、录用、到岗和完成都记在这里。右上角可以切到商家端处理申请。</p></div></div>
    <div class="tabs">${tabs.map(([id, label]) => `<button type="button" class="${ui.mineTab === id ? "on" : ""}" data-act="mine-tab" data-tab="${id}">${label}</button>`).join("")}</div>
    ${list}`;
}

function mineCard(row) {
  const item = jobById(row.jobId);
  if (!item) return `<article class="card"><h3>岗位已删除</h3>${statusPill(row)}</article>`;
  return `<article class="card">
    <div class="card-top"><h3>${esc(item.title)}</h3>${statusPill(row)}</div>
    <p class="muted">${esc(when(item))} · ${esc(item.pay)} 元/小时 · ${esc(item.merchant.name)}</p>
    <p class="muted">申请于 ${esc(fmtTime(row.createdAt))}</p>
    <div class="card-foot"><span class="muted">${esc(item.address)}</span><a class="btn small" href="#/mine/${esc(row.id)}">查看安排</a></div>
  </article>`;
}

function viewMineDetail(id) {
  const row = appById(id);
  if (!row || !row.owner) return notFound("找不到这条申请", "#/mine", "回我的兼职");
  const item = jobById(row.jobId);
  if (!item) return notFound("岗位已经不在了", "#/mine", "回我的兼职");
  let actions = "";
  if (row.status === "pending" || (row.status === "hired" && !row.arrived)) {
    actions += confirmBox(row.id, "cancel", row.status === "hired" ? "取消这次兼职" : "取消申请", "student");
  }
  if (row.status === "hired" && !row.studentConfirmed) {
    actions += `<button type="button" class="btn small" data-act="confirm-plan" data-id="${esc(row.id)}">确认工作安排</button>`;
  }
  const review = row.review
    ? `<section class="card section"><h2>我的评价</h2><p>${esc(row.review.score)} 分</p><p>${esc(row.review.text || "没有写文字评价。")}</p></section>`
    : row.status === "done"
      ? `<form id="review-form" class="card section" data-id="${esc(row.id)}">
          <h2>结算确认与评价</h2>
          <p class="muted" style="margin-bottom:10px">演示里不发生真实转账。确认完成后给这次班次留个评价。</p>
          <fieldset class="score"><legend>评分</legend>${[5, 4, 3, 2, 1].map((score) => `<label><input type="radio" name="score" value="${score}" /> ${score} 分</label>`).join("")}</fieldset>
          <label class="field"><span>一句反馈，可选</span><textarea name="text" placeholder="时间准不准、交代清不清楚"></textarea></label>
          <button class="btn" type="submit">提交评价</button>
        </form>`
      : "";
  return `${flash()}
    <p class="muted"><a href="#/mine">返回我的兼职</a></p>
    <div class="page-head section"><div><h1>${esc(item.title)}</h1><p class="lead">${esc(item.merchant.name)} · ${esc(when(item))}</p></div>${statusPill(row)}</div>
    ${progress(row)}
    <section class="card">
      <h2>工作安排</h2>
      <div class="facts" style="margin-top:12px">
        <div class="fact"><span>时间</span><strong>${esc(when(item))}</strong></div>
        <div class="fact"><span>地点</span><strong>${esc(item.address)}</strong></div>
        <div class="fact"><span>联系人</span><strong>${esc(item.merchant.contact)} · ${esc(item.merchant.phone)}</strong></div>
        <div class="fact"><span>薪资</span><strong>${esc(item.pay)} 元/小时 · ${esc(item.settle)}</strong></div>
      </div>
      <p class="muted" style="margin-top:12px">${row.studentConfirmed ? "你已经确认这次安排。" : row.status === "hired" ? "商家已录用，请确认这次工作安排。" : "商家录用后，才能确认这次工作安排。"}到店时说明来自周末搭子。</p>
      ${actions ? `<div class="actions" style="margin-top:12px">${actions}</div>` : ""}
    </section>
    ${review}`;
}

function stat(href, num, label) {
  return `<a class="stat" href="${href}"><strong>${num}</strong><span>${label}</span></a>`;
}

function viewMerchantHome() {
  const recruiting = state.jobs.filter((item) => phaseOf(item) === "recruiting").length;
  const pending = state.applications.filter((row) => row.status === "pending");
  const hired = state.applications.filter((row) => row.status === "hired").length;
  const done = state.applications.filter((row) => row.status === "done").length;
  const preview = pending.slice().sort(byTime).slice(0, 3);
  return `${flash()}${merchantSub("home")}
    <div class="page-head"><div><h1>商家工作台</h1><p class="lead">${esc(state.shop.name)} · ${state.shop.contact}。学生端和这里看的是同一份岗位与申请。</p></div><a class="btn" href="#/merchant/new">发布兼职</a></div>
    <div class="stats">
      ${stat("#/merchant/jobs", recruiting, "招聘中的岗位")}
      ${stat("#/merchant/apps", pending.length, "待处理申请")}
      ${stat("#/merchant/work", hired, "待到岗")}
      ${stat("#/merchant/work", done, "已完成")}
    </div>
    <section class="section"><h2>待处理申请</h2>
      ${preview.length ? `<div class="stack" style="margin-top:12px">${preview.map(applicantCard).join("")}</div>` : empty("没有待处理申请", "学生提交申请后，会出现在这里。", `<a class="btn ghost" href="#/merchant/jobs">查看我的岗位</a>`)}
    </section>
    <section class="section card">
      <h2>商家资料</h2>
      <p class="muted">发布新岗位时会带上这里的名称和联系人。</p>
      <form id="shop-form" class="section">
        <div class="form-grid">
          <label class="field"><span>商家名称</span><input name="name" value="${esc(state.shop.name)}" /></label>
          <label class="field"><span>联系人</span><input name="contact" value="${esc(state.shop.contact)}" /></label>
          <label class="field"><span>电话</span><input name="phone" value="${esc(state.shop.phone)}" /></label>
          <label class="field"><span>常用地点</span><input name="address" value="${esc(state.shop.address)}" /></label>
        </div>
        <label class="field"><span>简介</span><textarea name="intro">${esc(state.shop.intro)}</textarea></label>
        <button class="btn" type="submit">保存商家资料</button>
      </form>
    </section>`;
}

function applicantCard(row) {
  const item = jobById(row.jobId);
  return `<article class="card">
    <div class="card-top"><div><h3>${esc(row.student.name)} ${row.owner ? '<span class="pill">当前学生</span>' : ""}</h3><p class="muted">${item ? esc(item.title) : "岗位已删除"} · ${esc(fmtTime(row.createdAt))}</p></div>${statusPill(row)}</div>
    ${studentLine(row.student)}
    <div class="actions" style="margin-top:12px">${merchantActions(row)}${item ? `<a class="btn small ghost" href="#/merchant/job/${esc(item.id)}">查看岗位</a>` : ""}</div>
  </article>`;
}

function merchantActions(row) {
  if (row.status === "pending") {
    return `<button type="button" class="btn small" data-act="hire" data-id="${esc(row.id)}">确认录用</button>${confirmBox(row.id, "reject", "拒绝申请")}`;
  }
  if (row.status === "hired") {
    const main = row.arrived
      ? `<button type="button" class="btn small" data-act="complete" data-id="${esc(row.id)}">确认完成</button>`
      : `<button type="button" class="btn small" data-act="arrive" data-id="${esc(row.id)}">确认到岗</button>`;
    return `${main}${confirmBox(row.id, "cancel", "取消录用", "merchant")}`;
  }
  return "";
}

function viewMerchantJobs() {
  const tabs = [["all", "全部"], ["recruiting", "招聘中"], ["full", "已招满"], ["ended", "已结束"]];
  const jobs = state.jobs.filter((item) => ui.jobFilter === "all" || phaseOf(item) === ui.jobFilter);
  const list = jobs.length ? `<div class="stack">${jobs.map(merchantJobCard).join("")}</div>` : empty("这个状态下没有岗位", "换一个筛选，或者发布一个新班次。", `<a class="btn" href="#/merchant/new">发布兼职</a>`);
  return `${flash()}${merchantSub("jobs")}
    <div class="page-head"><div><h1>我发布的岗位</h1></div><a class="btn" href="#/merchant/new">发布兼职</a></div>
    <div class="tabs">${tabs.map(([id, label]) => `<button type="button" class="${ui.jobFilter === id ? "on" : ""}" data-act="job-filter" data-tab="${id}">${label}</button>`).join("")}</div>
    ${list}`;
}

function merchantJobCard(item) {
  const rows = state.applications.filter((row) => row.jobId === item.id);
  const pending = rows.filter((row) => row.status === "pending").length;
  return `<article class="card">
    <div class="card-top"><h3>${esc(item.title)}</h3><span class="status ${phaseOf(item) === "recruiting" ? "good" : phaseOf(item) === "full" ? "warn" : "muted"}">${phaseLabel(phaseOf(item))}</span></div>
    <p class="muted">${esc(when(item))} · ${esc(item.pay)} 元/小时 · 还招 ${remaining(item)} / ${item.slots} 人</p>
    <p class="muted">${rows.length} 份申请 · ${pending} 份待处理</p>
    <div class="card-foot"><span class="muted">${esc(item.address)}</span><a class="btn small" href="#/merchant/job/${esc(item.id)}">管理</a></div>
  </article>`;
}

function viewMerchantApps() {
  const pending = state.applications.filter((row) => row.status === "pending").sort(byTime);
  const handled = state.applications.filter((row) => row.status !== "pending").sort(byTime);
  return `${flash()}${merchantSub("apps")}
    <h1>申请者</h1>
    <p class="lead">先处理待确认的申请。录用后，学生端会变成待到岗。</p>
    <h2>待处理</h2>
    ${pending.length ? `<div class="stack" style="margin-top:12px">${pending.map(applicantCard).join("")}</div>` : empty("没有待处理申请", "新的学生申请会列在这里。", "")}
    <h2 class="section">已处理</h2>
    ${handled.length ? `<div class="stack" style="margin-top:12px">${handled.map(applicantCard).join("")}</div>` : `<p class="muted section">还没有处理过的申请。</p>`}`;
}

function viewMerchantWork() {
  const tabs = [["hired", "待到岗"], ["done", "已完成"], ["cancelled", "取消记录"]];
  const rows = state.applications.filter((row) => row.status === ui.workTab).sort(byTime);
  const text = { hired: ["没有待到岗的同学", "录用之后会出现在这里。"], done: ["还没有完成记录", "确认到岗并完成工作后会记在这里。"], cancelled: ["没有取消记录", "学生或商家取消后会留在这里。"] }[ui.workTab];
  return `${flash()}${merchantSub("work")}
    <h1>用工管理</h1>
    <div class="tabs">${tabs.map(([id, label]) => `<button type="button" class="${ui.workTab === id ? "on" : ""}" data-act="work-tab" data-tab="${id}">${label}</button>`).join("")}</div>
    ${rows.length ? `<div class="stack">${rows.map(workCard).join("")}</div>` : empty(text[0], text[1], `<a class="btn ghost" href="#/merchant/apps">去处理申请</a>`)}`;
}

function workCard(row) {
  const item = jobById(row.jobId);
  const review = row.review ? `<p>学生评价 ${esc(row.review.score)} 分${row.review.text ? `：${esc(row.review.text)}` : ""}</p>` : "";
  return `<article class="card">
    <div class="card-top"><h3>${esc(row.student.name)}</h3>${statusPill(row)}</div>
    <p>${item ? esc(item.title) : "岗位已删除"}</p>
    <p class="muted">${item ? esc(when(item)) : ""} ${row.studentConfirmed ? "· 学生已确认安排" : ""}</p>
    ${review}
    <div class="actions" style="margin-top:12px">${merchantActions(row)}</div>
  </article>`;
}

function viewMerchantJob(id) {
  const item = jobById(id);
  if (!item) return notFound("找不到这个岗位", "#/merchant/jobs", "回岗位列表");
  const rows = state.applications.filter((row) => row.jobId === item.id).sort(byTime);
  const phase = phaseOf(item);
  const close = item.closed
    ? `<button type="button" class="btn small ghost" data-act="reopen-job" data-id="${esc(item.id)}">重新开放</button>`
    : confirmBox(item.id, "close-job", "结束招聘");
  return `${flash()}
    <p class="muted"><a href="#/merchant/jobs">返回岗位列表</a></p>
    <div class="page-head section"><div><h1>${esc(item.title)}</h1><p class="lead">${esc(when(item))} · ${esc(item.pay)} 元/小时 · ${phaseLabel(phase)} · 还招 ${remaining(item)} 人</p></div>${close}</div>
    <div class="facts">
      <div class="fact"><span>地点</span><strong>${esc(item.address)}</strong></div>
      <div class="fact"><span>结算</span><strong>${esc(item.settle)}</strong></div>
      <div class="fact"><span>工作内容</span><strong>${esc(item.duties)}</strong></div>
      <div class="fact"><span>要求</span><strong>${esc(item.requirements)}</strong></div>
    </div>
    <h2 class="section">申请者</h2>
    ${rows.length ? `<div class="stack" style="margin-top:12px">${rows.map(applicantCard).join("")}</div>` : empty("还没有人申请", "学生在发现页提交后，会出现在这里。", `<button type="button" class="btn ghost" data-act="role" data-role="student">打开学生端看看</button>`)}`;
}

function viewPost() {
  const draft = ui.draftJob || {
    title: "", type: "餐饮", date: "2026-10-24", start: "10:00", end: "14:00", pay: "30", settle: "日结",
    slots: "1", address: state.shop.address, distance: "1", duties: "", requirements: "", merchantName: state.shop.name,
  };
  const errors = ui.formError.length ? `<div class="error-box">${ui.formError.map(esc).join("<br>")}</div>` : "";
  const typeOptions = TYPES.map((type) => `<option ${draft.type === type ? "selected" : ""}>${esc(type)}</option>`).join("");
  const settleOptions = SETTLES.map((settle) => `<option ${draft.settle === settle ? "selected" : ""}>${esc(settle)}</option>`).join("");
  return `${flash()}${merchantSub("jobs")}
    <h1>发布兼职</h1>
    <p class="lead">写清人数、时间、时薪、地点和结算方式。发布后学生端马上能看到。</p>
    ${errors}
    <form id="post-form" class="card">
      <label class="field"><span>岗位名称</span><input name="title" value="${esc(draft.title)}" placeholder="例如：咖啡店周末帮班" /></label>
      <div class="form-grid">
        <label class="field"><span>工作类型</span><select name="type">${typeOptions}</select></label>
        <label class="field"><span>商家名称</span><input name="merchantName" value="${esc(draft.merchantName)}" /></label>
        <label class="field"><span>工作日期</span><input type="date" name="date" value="${esc(draft.date)}" /></label>
        <label class="field"><span>招聘人数</span><input type="number" min="1" step="1" name="slots" value="${esc(draft.slots)}" /></label>
        <label class="field"><span>开始时间</span><input type="time" name="start" value="${esc(draft.start)}" /></label>
        <label class="field"><span>结束时间</span><input type="time" name="end" value="${esc(draft.end)}" /></label>
        <label class="field"><span>时薪（元）</span><input type="number" min="1" step="1" name="pay" value="${esc(draft.pay)}" /></label>
        <label class="field"><span>结算方式</span><select name="settle">${settleOptions}</select></label>
        <label class="field"><span>工作地点</span><input name="address" value="${esc(draft.address)}" /></label>
        <label class="field"><span>距校园（公里）</span><input type="number" min="0" step="0.1" name="distance" value="${esc(draft.distance)}" /></label>
      </div>
      <label class="field"><span>工作内容</span><textarea name="duties">${esc(draft.duties)}</textarea></label>
      <label class="field"><span>岗位要求</span><textarea name="requirements">${esc(draft.requirements)}</textarea></label>
      <button class="btn" type="submit">发布这个班次</button>
    </form>`;
}

function viewProfile() {
  const profile = state.profile;
  const done = mineApps().filter((row) => row.status === "done");
  const history = done.length ? `<div class="stack">${done.map((row) => {
    const item = jobById(row.jobId);
    const review = row.review ? `${row.review.score} 分${row.review.text ? ` · ${esc(row.review.text)}` : ""}` : "还没有评价";
    return `<article class="card"><h3>${item ? esc(item.title) : "岗位已删除"}</h3><p class="muted">${item ? esc(when(item)) : ""}</p><p>${review}</p></article>`;
  }).join("")}</div>` : `<p class="muted">完成后，历史班次和评价会留在这里。</p>`;
  return `${flash()}
    <div class="page-head"><div><h1>个人中心</h1><p class="lead">这些偏好只影响提示和你下次申请时带给商家的资料。</p></div></div>
    <form id="profile-form" class="card">
      <div class="form-grid">
        <label class="field"><span>姓名</span><input name="name" value="${esc(profile.name)}" /></label>
        <label class="field"><span>学校</span><input name="school" value="${esc(profile.school)}" /></label>
        <label class="field"><span>期望时薪（元）</span><input type="number" min="1" name="expected" value="${esc(profile.expected)}" /></label>
        <label class="field"><span>可接受通勤（公里）</span><input type="number" min="0.1" step="0.1" name="commute" value="${esc(profile.commute)}" /></label>
      </div>
      <label class="field"><span>技能，用顿号或逗号分开</span><input name="skills" value="${esc(profile.skills.join("、"))}" /></label>
      <div class="field"><span>可工作时间</span><div class="checks">${AVAIL.map((item) => `<label><input type="checkbox" name="availability" value="${esc(item)}" ${profile.availability.includes(item) ? "checked" : ""} />${esc(item)}</label>`).join("")}</div></div>
      <label class="field"><span>一句自我介绍</span><textarea name="intro">${esc(profile.intro)}</textarea></label>
      <div class="actions"><button class="btn" type="submit">保存资料</button>${confirmBox("reset", "reset", "恢复示例数据")}</div>
    </form>
    <section class="section"><h2>评价与历史兼职</h2><div style="margin-top:12px">${history}</div></section>`;
}

function view() {
  const parts = routeParts();
  if (!parts.length) return viewDiscover();
  if (parts[0] === "job" && parts[1]) return viewJob(parts[1]);
  if (parts[0] === "mine" && parts[1]) return viewMineDetail(parts[1]);
  if (parts[0] === "mine") return viewMine();
  if (parts[0] === "profile") return viewProfile();
  if (parts[0] === "merchant" && parts[1] === "new") return viewPost();
  if (parts[0] === "merchant" && parts[1] === "job" && parts[2]) return viewMerchantJob(parts[2]);
  if (parts[0] === "merchant" && parts[1] === "jobs") return viewMerchantJobs();
  if (parts[0] === "merchant" && parts[1] === "apps") return viewMerchantApps();
  if (parts[0] === "merchant" && parts[1] === "work") return viewMerchantWork();
  if (parts[0] === "merchant") return viewMerchantHome();
  return notFound("页面不存在", "#/", "回首页");
}

function render() {
  const routeKey = location.hash || "#/";
  const changed = routeKey !== ui.lastRoute;
  const active = document.activeElement;
  const focus = active && active.id === "q" ? { start: active.selectionStart, end: active.selectionEnd } : null;
  document.getElementById("app").innerHTML = shell(view());
  const titles = { job: "岗位详情", mine: "我的兼职", profile: "个人中心", merchant: "商家工作台" };
  document.title = `${titles[routeParts()[0]] || "发现兼职"} · 周末搭子`;
  if (focus) {
    const input = document.getElementById("q");
    if (input) {
      input.focus();
      input.setSelectionRange(focus.start, focus.end);
    }
  }
  if (changed) {
    ui.lastRoute = routeKey;
    window.scrollTo(0, 0);
  }
}

function submitApply(form) {
  const item = jobById(form.dataset.id);
  const check = canApply(item);
  if (!check.ok) return toast(check.reason);
  const note = String(new FormData(form).get("note") || "").trim();
  const row = {
    id: "a" + Date.now(),
    jobId: item.id,
    owner: true,
    status: "pending",
    createdAt: new Date().toISOString(),
    arrived: false,
    studentConfirmed: false,
    cancelBy: "",
    review: null,
    student: snapshotStudent(note),
  };
  state.applications.unshift(row);
  save();
  go(`#/mine/${row.id}`, { type: "ok", text: "申请已提交，等待商家确认。" });
}

function publishJob(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  ui.draftJob = data;
  const errors = [];
  if (!String(data.title || "").trim()) errors.push("请填写岗位名称。");
  if (!TYPES.includes(data.type)) errors.push("请选择工作类型。");
  if (!data.date) errors.push("请选择工作日期。");
  if (!data.start || !data.end) errors.push("请填写开始和结束时间。");
  else if (data.start >= data.end) errors.push("结束时间要晚于开始时间。");
  if (!(Number(data.pay) > 0)) errors.push("请填写大于 0 的时薪。");
  if (!(Number(data.slots) >= 1)) errors.push("招聘人数至少为 1。");
  if (!SETTLES.includes(data.settle)) errors.push("请选择结算方式。");
  if (!String(data.address || "").trim()) errors.push("请填写工作地点。");
  if (!(Number(data.distance) >= 0)) errors.push("请填写通勤距离。");
  if (!String(data.duties || "").trim()) errors.push("请填写工作内容。");
  if (!String(data.requirements || "").trim()) errors.push("请填写岗位要求。");
  if (!String(data.merchantName || "").trim()) errors.push("请填写商家名称。");
  ui.formError = errors;
  if (errors.length) {
    toast("还有必填信息没写完。");
    render();
    return;
  }
  const created = {
    id: "j" + Date.now(),
    title: data.title.trim(),
    type: data.type,
    pay: Number(data.pay),
    settle: data.settle,
    date: data.date,
    start: data.start,
    end: data.end,
    address: data.address.trim(),
    distance: Number(data.distance),
    slots: Number(data.slots),
    duties: data.duties.trim(),
    requirements: data.requirements.trim(),
    closed: false,
    merchant: {
      name: data.merchantName.trim(),
      verified: true,
      category: data.type,
      contact: state.shop.contact,
      phone: state.shop.phone,
      rating: 5,
    },
  };
  state.jobs.unshift(created);
  ui.draftJob = null;
  ui.formError = [];
  save();
  go(`#/merchant/job/${created.id}`, { type: "ok", text: "岗位已发布，学生端现在可以搜到。" });
}

function saveProfile(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const availability = [...form.querySelectorAll("input[name=availability]:checked")].map((node) => node.value);
  if (!String(data.name || "").trim()) return toast("请填写姓名。");
  if (!availability.length) return toast("请至少选择一个可工作时间。");
  if (!(Number(data.expected) > 0)) return toast("请填写期望时薪。");
  if (!(Number(data.commute) > 0)) return toast("请填写可接受的通勤距离。");
  state.profile = {
    name: data.name.trim(),
    school: String(data.school || "").trim(),
    skills: String(data.skills || "").split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
    availability,
    commute: Number(data.commute),
    expected: Number(data.expected),
    intro: String(data.intro || "").trim(),
  };
  save();
  toast("个人资料已保存。下次申请会带上这些信息。");
  render();
}

function saveShop(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  if (!String(data.name || "").trim()) return toast("请填写商家名称。");
  if (!String(data.contact || "").trim()) return toast("请填写联系人。");
  state.shop = {
    name: data.name.trim(),
    contact: data.contact.trim(),
    phone: String(data.phone || "").trim(),
    address: String(data.address || "").trim(),
    intro: String(data.intro || "").trim(),
  };
  save();
  toast("商家资料已保存。");
  render();
}

function saveReview(form) {
  const row = appById(form.dataset.id);
  if (!row || !row.owner) return toast("找不到这条兼职。");
  if (row.status !== "done") return toast("工作完成后才能评价。");
  if (row.review) return toast("已经评价过了。");
  const score = Number(new FormData(form).get("score"));
  if (!score) return toast("请先选择评分。");
  row.review = { score, text: String(new FormData(form).get("text") || "").trim(), at: new Date().toISOString() };
  save();
  toast("评价已记下。");
  render();
}

function setPending(id, status) {
  const row = appById(id);
  if (!row) return toast("找不到这条申请。");
  if (row.status !== "pending") return toast("这条申请已经处理过了。");
  const item = jobById(row.jobId);
  if (status === "hired") {
    if (!item || item.closed) return toast("招聘已结束，不能录用。");
    if (remaining(item) <= 0) return toast("名额已满，不能再录用。");
    row.status = "hired";
    toast("已录用。学生可在「我的兼职」看到待到岗。");
  } else {
    row.status = "rejected";
    toast("已拒绝这条申请。");
  }
  ui.confirm = null;
  save();
  render();
}

function markArrived(id) {
  const row = appById(id);
  if (!row || row.status !== "hired") return toast("只有待到岗的同学可以确认到岗。");
  if (row.arrived) return toast("已经记录过到岗。");
  row.arrived = true;
  save();
  toast("已记录到岗。");
  render();
}

function markDone(id) {
  const row = appById(id);
  if (!row || row.status !== "hired") return toast("当前状态不能标记完成。");
  if (!row.arrived) return toast("请先确认到岗，再标记完成。");
  row.status = "done";
  ui.confirm = null;
  save();
  toast("已确认完成。学生现在可以评价。");
  render();
}

function cancelApp(id, by) {
  const row = appById(id);
  if (!row) return toast("找不到这条申请。");
  if (by === "student" && !row.owner) return toast("只能取消自己的申请。");
  if (row.status === "done" || row.status === "rejected" || row.status === "cancelled") return toast("这条记录已经结束，不能取消。");
  if (by === "student" && row.arrived) return toast("到岗之后不能自行取消，请联系商家。");
  row.status = "cancelled";
  row.cancelBy = by || "student";
  ui.confirm = null;
  save();
  toast(by === "merchant" ? "已取消这次录用。" : "已取消申请。");
  render();
}

function confirmPlan(id) {
  const row = appById(id);
  if (!row || !row.owner) return toast("请在学生端确认自己的安排。");
  if (row.status !== "hired") return toast("商家录用后才能确认安排。");
  row.studentConfirmed = true;
  save();
  toast("已确认工作安排。");
  render();
}

function closeJob(id) {
  const item = jobById(id);
  if (!item) return toast("找不到这个岗位。");
  item.closed = true;
  ui.confirm = null;
  save();
  toast("已结束招聘，学生不能再申请。");
  render();
}

function reopenJob(id) {
  const item = jobById(id);
  if (!item) return toast("找不到这个岗位。");
  item.closed = false;
  save();
  toast(remaining(item) > 0 ? "已重新开放招聘。" : "已重新开放，但名额仍然是满的。");
  render();
}

function resetData() {
  state = seed();
  save();
  ui.confirm = null;
  ui.q = "";
  ui.date = "all";
  ui.type = "all";
  ui.pay = 0;
  ui.dist = 0;
  toast("已恢复示例数据。");
  go("#/");
}

function onClick(event) {
  const target = event.target.closest("[data-act]");
  if (!target) return;
  const act = target.dataset.act;
  const id = target.dataset.id;
  if (act === "role") {
    ui.role = target.dataset.role;
    localStorage.setItem(ROLE_KEY, ui.role);
    go(ui.role === "merchant" ? "#/merchant" : "#/");
  } else if (act === "clear-filters") {
    ui.q = ""; ui.date = "all"; ui.type = "all"; ui.pay = 0; ui.dist = 0;
    render();
  } else if (act === "mine-tab") { ui.mineTab = target.dataset.tab; render(); }
  else if (act === "job-filter") { ui.jobFilter = target.dataset.tab; render(); }
  else if (act === "work-tab") { ui.workTab = target.dataset.tab; render(); }
  else if (act === "ask") { ui.confirm = { id, act: target.dataset.next }; render(); }
  else if (act === "cancel-ask") { ui.confirm = null; render(); }
  else if (act === "hire") setPending(id, "hired");
  else if (act === "reject") setPending(id, "rejected");
  else if (act === "arrive") markArrived(id);
  else if (act === "complete") markDone(id);
  else if (act === "cancel") cancelApp(id, target.dataset.by || "student");
  else if (act === "confirm-plan") confirmPlan(id);
  else if (act === "close-job") closeJob(id);
  else if (act === "reopen-job") reopenJob(id);
  else if (act === "reset") resetData();
}

function onSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  if (form.id === "apply-form") submitApply(form);
  else if (form.id === "post-form") publishJob(form);
  else if (form.id === "profile-form") saveProfile(form);
  else if (form.id === "shop-form") saveShop(form);
  else if (form.id === "review-form") saveReview(form);
}

function onChange(event) {
  const target = event.target;
  if (target.id === "f-date") ui.date = target.value;
  else if (target.id === "f-type") ui.type = target.value;
  else if (target.id === "f-pay") ui.pay = Number(target.value);
  else if (target.id === "f-dist") ui.dist = Number(target.value);
  else return;
  render();
}

function onInput(event) {
  if (event.target.id !== "q" || ui.composing) return;
  ui.q = event.target.value;
  render();
}

document.addEventListener("click", onClick);
document.addEventListener("submit", onSubmit);
document.addEventListener("change", onChange);
document.addEventListener("input", onInput);
document.addEventListener("compositionstart", (event) => { if (event.target.id === "q") ui.composing = true; });
document.addEventListener("compositionend", (event) => {
  if (event.target.id !== "q") return;
  ui.composing = false;
  ui.q = event.target.value;
  render();
});
window.addEventListener("hashchange", () => {
  if (!ui.keepFlash) ui.flash = null;
  ui.keepFlash = false;
  ui.confirm = null;
  render();
});

if (!location.hash) location.hash = "#/";
render();
