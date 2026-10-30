/* =====================================================================
   DEMO DATA ENGINE — dữ liệu mẫu 100% hư cấu cho bản demo tt-laixe.
   200 học viên "Nguyễn Văn A / Nguyễn Thị B..." + SĐT/CCCD/địa chỉ mẫu,
   KHÔNG chứa bất kỳ dữ liệu thật nào. Chạy hoàn toàn phía trình duyệt:
   DEMO_API.get/post thay cho Apps Script API.
   ===================================================================== */
(function () {
  // Dọn cache SWR cũ (tránh khách đã mở bản cũ thấy dữ liệu lưu trên máy)
  try {
    const ks = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('hp_swr_')) ks.push(k); }
    ks.forEach(k => localStorage.removeItem(k));
    // Đã kết nối Sheet riêng (có hp_api_url) -> KHÔNG chạy dữ liệu mẫu, để app gọi thẳng Web App của trung tâm
    if (localStorage.getItem('hp_api_url')) { window.__REAL_API_MODE__ = true; return; }
  } catch (e) {}

  const TODAY = '2026-10-27';
  // --- RNG xác định (seed cố định -> dữ liệu nhất quán giữa các lần mở) ---
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = mulberry32(20261027);
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const pad = (n, w) => String(n).padStart(w, '0');
  function letters(i) { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function dAdd(iso, days) { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
  function dDiff(a, b) { return Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000); }
  const clamp01 = v => Math.max(0, Math.min(1, v));

  // ---------------- Khóa học ----------------
  const TUITION = { B1: 18000000, B2: 20000000, C1: 25000000 };
  const TARGET = { B1: 710, B2: 810, C1: 825 };
  const COURSES = [
    { code: 'K38', licenseClass: 'B2', openDate: '2026-06-01', closeDate: '2026-09-30', count: 30 },
    { code: 'K39', licenseClass: 'B2', openDate: '2026-07-01', closeDate: '2026-10-31', count: 40 },
    { code: 'K40', licenseClass: 'B2', openDate: '2026-08-01', closeDate: '2026-11-30', count: 35 },
    { code: 'K41', licenseClass: 'B2', openDate: '2026-09-01', closeDate: '2026-12-31', count: 30 },
    { code: 'C1-K120', licenseClass: 'C1', openDate: '2026-07-01', closeDate: '2026-12-31', count: 30 },
    { code: 'BK220', licenseClass: 'B1', openDate: '2026-08-01', closeDate: '2026-12-31', count: 35 },
  ].map(c => ({ ...c, ltStart: c.openDate, ltEnd: '', thStart: dAdd(c.openDate, 28), thEnd: c.closeDate, datStart: dAdd(c.openDate, 28), tuition: TUITION[c.licenseClass] }));
  const courseByCode = {}; COURSES.forEach(c => courseByCode[c.code] = c);

  // ---------------- Giáo viên & xe ----------------
  const TCOL = ['#81C784', '#90CAF9', '#FFB74D', '#BA68C8', '#4DB6AC', '#F06292', '#AED581', '#64B5F6', '#FFD54F', '#7986CB', '#4FC3F7', '#DCE775'];
  const TEACHERS = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Hùng', 'Khoa', 'Long', 'Nam', 'Phong', 'Sơn', 'Tuấn'].map((w, i) => ({
    id: 101 + i, name: 'Nguyễn Văn ' + w, shortName: w, color: TCOL[i], kind: i < 9 ? 'chinh' : 'thue',
    phone: '091' + (3000000 + i * 12347), hourlyRate: i < 9 ? 180000 : 200000, hoursMonth: 120 + (i * 13) % 80,
  }));
  TEACHERS.forEach(t => t.salary = t.hourlyRate * t.hoursMonth);
  const VEHICLES = Array.from({ length: 14 }, (_, i) => {
    const odo = 180000 + i * 13700;
    const rem = ((i * 733) % 4800) - 300;
    return {
      id: 201 + i, plate: '51A-' + (10001 + i), licenseClass: i % 5 === 3 ? 'C1' : (i % 5 === 2 ? 'B1' : 'B2'),
      ownerTeacher: TEACHERS[i % 12].name, poolCourses: [COURSES[i % 6].code, COURSES[(i + 2) % 6].code],
      status: i === 13 ? 'Bảo trì' : 'Đang sử dụng', odometerKm: odo, lastServiceKm: odo + rem - 5000, serviceIntervalKm: 5000,
      serviceRemainingKm: rem, maintenanceDate: dAdd('2026-10-05', i * 2), inspectionDate: '2027-0' + (1 + i % 6) + '-15',
      insuranceExpiry: [3, 6, 9].includes(i) ? '2026-11-' + pad(3 + i * 3, 2) : '2027-0' + (2 + i % 5) + '-20',
      badgeExpiry: '2027-03-' + pad(1 + i, 2), fuelMonth: 900000 + i * 73000, hoursWeek: 18 + (i * 7) % 24, overuse: i === 2 || i === 9,
    };
  });
  const CENTERS = ['A (K51)', 'B (K52)', 'C (K53)', 'D (K54)', 'E (K55)'].map((s, i) => {
    const cnt = [24, 20, 18, 16, 12][i];
    return { id: 301 + i, name: 'Trung tâm liên kết ' + s, commissionRate: 5, studentsCount: cnt, revenue: cnt * 7200000, commission: cnt * 7200000 * 0.05 };
  });
  const COMMISSION_TOTAL = CENTERS.reduce((a, c) => a + c.commission, 0);

  // ---------------- Học viên (200 HV mẫu) ----------------
  const DISTRICTS = ['Quận 12', 'Quận 7', 'Quận Gò Vấp', 'Quận Bình Tân', 'TP. Thủ Đức', 'Huyện Hóc Môn'];
  const SLOTS = ['06-08h', '08-10h', '10-12h', '13-15h', '15-17h', '17-19h'];
  const SLOT_MIN = { '06-08h': 360, '08-10h': 480, '10-12h': 600, '13-15h': 780, '15-17h': 900, '17-19h': 1020 };
  const STUDENTS = [];
  let _n = 0;
  COURSES.forEach(course => {
    for (let j = 0; j < course.count; j++, _n++) {
      const n = _n, female = n % 2 === 1;
      const teacher = TEACHERS[n % 12];
      const finished = course.closeDate < TODAY;
      const span = Math.max(1, dDiff(course.thStart, course.closeDate));
      const tProg = finished ? 1 : clamp01(dDiff(course.thStart, TODAY) / span);
      const jitter = 0.75 + ((n * 29) % 50) / 100;
      const prog = finished ? Math.min(1, 0.85 + ((n * 31) % 16) / 100) : clamp01(tProg * jitter);
      const target = TARGET[course.licenseClass];
      let datKmDone = Math.round(target * prog / 5) * 5;
      if (finished && j % 6 !== 5) datKmDone = target;
      const cabinHours = finished ? (j % 5 === 4 ? 2 : 3) : (prog > 0.55 ? [3, 2, 3, 1][n % 4] : n % 2);
      const theoryScore = 25 + (n % 11);
      const discount = n % 25 === 7 ? 500000 : 0;
      const payable = course.tuition - discount;
      let paid;
      if (finished) paid = payable;
      else if (n % 4 === 0) paid = payable;
      else paid = Math.round(payable * Math.max(0.3, Math.min(1, prog * 1.15)) / 100000) * 100000;
      const examined = course.code === 'K38' && j < 26;
      const passedExam = examined && j % 5 !== 4;
      const licensed = passedExam && j < 18;
      const criteria = { theory: theoryScore >= 26, cabin: cabinHours >= 3, dat: datKmDone >= target, sahinh: prog > 0.8 || finished, fee: payable - paid === 0 };
      const eligible = !examined && criteria.theory && criteria.cabin && criteria.dat && criteria.sahinh && criteria.fee;
      const center = n < 90 ? CENTERS[Math.floor(n / 18) % 5] : null;
      STUDENTS.push({
        id: 1000 + n, code: 'HV' + pad(n + 1, 3), maHv: String(88000000 + n * 137),
        name: (female ? 'Nguyễn Thị ' : 'Nguyễn Văn ') + letters(n),
        dob: (1986 + (n * 7) % 22) + '-' + pad((n * 5) % 12 + 1, 2) + '-' + pad((n * 11) % 28 + 1, 2),
        cccd: '079' + (100000000 + n), phone: '090' + (2000000 + n),
        address: 'Số ' + (15 + n * 3) + ' Đường Số ' + ((n % 20) + 1) + ', ' + DISTRICTS[n % 6] + ', TP.HCM',
        courseCode: course.code, licenseClass: course.licenseClass,
        centerName: center ? center.name : '',
        homeTeacherName: teacher.name, homePlate: VEHICLES[n % 12].plate, plateKg: n % 4 === 0 ? VEHICLES[(n + 5) % 14].plate : '',
        regDate: dAdd(course.openDate, -(10 + n % 15)), healthExamDate: dAdd(course.openDate, -(10 + n % 15)), healthExpiry: dAdd(course.openDate, 355 - (n % 15)),
        cabinHours, cabinSessions: Math.round(cabinHours * 1.33),
        theoryScore, theoryPassed: theoryScore >= 26, sahinhDone: prog > 0.8 || finished,
        datKmDone, datKmTotal: target, datMarkerKm: 0,
        datStartDate: course.datStart, datDeadline: course.closeDate, openDate: course.openDate, closeDate: course.closeDate,
        tuitionTotal: course.tuition, tuitionDiscount: discount, discountReason: discount ? 'Ưu đãi đăng ký sớm' : '',
        tuitionPayable: payable, tuitionPaid: paid, tuitionDebt: payable - paid,
        status: licensed ? 'Đã có bằng' : passedExam ? 'Đã đậu sát hạch' : eligible ? 'Đủ điều kiện thi' : 'Đang học',
        gradExamDate: examined ? '2026-09-26' : '', gradResult: examined ? (passedExam ? 'Đậu' : 'Rớt') : '',
        certNo: passedExam ? 'TN2026-HV' + pad(n + 1, 3) : '', certDate: passedExam ? '2026-09-30' : '',
        licenseDate: licensed ? '2026-10-25' : '', hasLicense: licensed, licenseScore: licensed ? 30 + (n % 6) : 0,
        criteria, eligible,
        _course: course, _teacher: teacher, _prog: prog, _examined: examined, _passed: passedExam, _idxInCourse: j,
      });
    }
  });
  const stuById = {}; STUDENTS.forEach(s => stuById[s.id] = s);

  // ---------------- Phiếu thu ----------------
  const PAYMENTS = [];
  let _pid = 5000;
  STUDENTS.forEach((s, n) => {
    if (s.tuitionPaid <= 0) return;
    const parts = s.tuitionPaid >= s.tuitionPayable
      ? [0.4, 0.35, 0.25] : (s._prog > 0.5 ? [0.55, 0.45] : [1]);
    let acc = 0;
    parts.forEach((f, k) => {
      const amt = k === parts.length - 1 ? s.tuitionPaid - acc : Math.round(s.tuitionPaid * f / 1000) * 1000;
      acc += amt;
      let date = dAdd(s.regDate, 2 + k * 48);
      if (k === parts.length - 1 && s.courseCode !== 'K38' && parts.length > 1) date = '2026-10-' + pad(1 + n % 27, 2);
      if (date > TODAY) date = TODAY;
      PAYMENTS.push({ id: _pid++, studentId: s.id, studentCode: s.code, studentName: s.name, courseCode: s.courseCode, date, amount: amt, kind: 'Học phí', method: (n + k) % 2 ? 'Chuyển khoản' : 'Tiền mặt', note: 'Lần ' + (k + 1) + (k === 0 ? ' – Cọc giữ chỗ' : (k === parts.length - 1 && s.tuitionDebt === 0 ? ' – Đóng đủ học phí' : '')), kmDeducted: 0 });
    });
  });
  PAYMENTS.sort((a, b) => a.date < b.date ? 1 : -1);

  // ---------------- Buổi học ----------------
  const SESSIONS = [];
  let _sid = 9000;
  function addSession(s, date, slot, type, km, past) {
    const t = s._teacher, v = VEHICLES[s.id % 14];
    SESSIONS.push({
      id: _sid++, date, slot, startMinutes: SLOT_MIN[slot], type, courseCode: s.courseCode, courseSize: s._course.count,
      studentId: s.id, studentName: s.name, teacherId: t.id, teacherName: t.name, teacherShort: t.shortName, teacherColor: t.color,
      vehicleId: v.id, plate: v.plate, centerName: s.centerName, km: km || 0, actualKm: past && type === 'DAT' ? (km || 0) : null,
      attendance: past && (s.id + _sid) % 20 === 0 ? 'HV vắng' : 'Đã học', groupLabel: '', note: '', editable: true,
    });
  }
  STUDENTS.forEach((s, n) => {
    const c = s._course;
    for (let k = 0; k < 4; k++) addSession(s, dAdd(c.ltStart, 2 + k * 7 + n % 3), SLOTS[(n + k) % 6], 'Lý thuyết', 0, true);
    const datCount = Math.round(s.datKmDone / 78);
    for (let k = 0; k < datCount; k++) {
      const date = dAdd(c.datStart, Math.floor((k + 0.5) * Math.max(6, dDiff(c.datStart, TODAY) - 4) / Math.max(1, datCount)) + (n % 3));
      addSession(s, date > TODAY ? TODAY : date, SLOTS[(n + k * 2) % 6], 'DAT', 68 + (n + k) % 18, true);
    }
    if (c.closeDate >= TODAY) for (let k = 0; k < 2; k++) addSession(s, dAdd(TODAY, 3 + ((n + k * 5) % 16)), SLOTS[(n + k * 3) % 6], 'DAT', 75, false);
    if (s.sahinhDone || s._prog > 0.6) for (let k = 0; k < 2; k++) addSession(s, dAdd(c.datStart, 20 + k * 17 + n % 5), SLOTS[(n + k + 2) % 6], 'Sa hình', 0, true);
  });
  // 16 buổi đúng ngày "hôm nay" + 3 cặp trùng lịch (cho cảnh báo)
  STUDENTS.filter(s => ['K39', 'K40', 'K41'].includes(s.courseCode)).slice(0, 16).forEach((s, i) => addSession(s, TODAY, SLOTS[i % 6], i % 5 === 4 ? 'Sa hình' : 'DAT', 75, true));
  [40, 90, 140].forEach((base, i) => {
    const s = STUDENTS[base], other = STUDENTS[base + 7];
    const date = dAdd(TODAY, 5 + i * 4);
    addSession(s, date, '08-10h', 'DAT', 75, false);
    const clone = { ...SESSIONS[SESSIONS.length - 1], id: _sid++, studentId: other.id, studentName: other.name, courseCode: other.courseCode };
    SESSIONS.push(clone);
  });
  SESSIONS.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.startMinutes - b.startMinutes);

  // ---------------- Tổng hợp phụ ----------------
  const pub = s => { const o = {}; Object.keys(s).forEach(k => { if (k[0] !== '_') o[k] = s[k]; }); return o; };
  function findConflicts() {
    const map = {};
    SESSIONS.forEach(x => {
      [['GV', x.teacherId], ['xe', x.vehicleId]].forEach(([kind, ref]) => {
        const key = x.date + '|' + x.slot + '|' + kind + ref;
        (map[key] = map[key] || []).push(x);
      });
    });
    const out = [];
    Object.values(map).forEach(g => {
      if (g.length > 1 && new Set(g.map(x => x.studentId)).size > 1)
        out.push({ kind: g[0].id % 2 ? 'Trùng xe' : 'Trùng GV', severity: 'error', key: g[0].date + '|' + g[0].slot + '|c' + g[0].id, date: g[0].date, slot: g[0].slot, sessions: g });
    });
    return out.slice(0, 3);
  }
  const CONFLICTS = findConflicts();
  const EXAMINED = STUDENTS.filter(s => s._examined);
  const ELIGIBLE = STUDENTS.filter(s => s.eligible);
  const LICENSED = STUDENTS.filter(s => s.hasLicense);
  const PASSED_N = STUDENTS.filter(s => s._passed).length;
  const EXAM_RESULTS = EXAMINED.map((s, i) => ({
    id: 7000 + i, studentId: s.id, code: s.code, name: s.name, courseCode: s.courseCode, licenseClass: s.licenseClass,
    examDate: '2026-10-10', sbd: pad(i + 1, 3),
    theory: s.theoryPassed ? 'Đậu' : 'Rớt', theoryScore: s.theoryScore,
    sahinh: s._passed ? 'Đậu' : 'Rớt', sahinhScore: 80 + (s.id % 20),
    road: s._passed ? 'Đậu' : 'Chưa thi', roadScore: s._passed ? 80 + (s.id % 18) : 0,
    passed: s._passed, retakeFee: s._passed ? 0 : 400000, retakeFeeNote: s._passed ? '' : 'Thi lại sa hình', note: '',
    hasLicense: s.hasLicense, licenseDate: s.licenseDate,
  }));
  const R_TODAY = '2026-10-28'; // mốc tính nhắc việc (K39 bế giảng 31/10 -> còn 3 ngày)
  const overdueStu = STUDENTS.filter(s => s.courseCode === 'K38' && s.datKmDone < s.datKmTotal);
  const dueSoonStu = STUDENTS.filter(s => s.courseCode === 'K39' && s.datKmDone < s.datKmTotal);
  const alertRow = s => ({ id: s.id, code: s.code, name: s.name, courseCode: s.courseCode, doneKm: s.datKmDone, targetKm: s.datKmTotal, closeDate: s.closeDate, daysLeft: dDiff(R_TODAY, s.closeDate), overdueDays: Math.max(0, dDiff(s.closeDate, R_TODAY)), cabinOk: s.cabinHours >= 3, teacherName: s.homeTeacherName });
  const docRows = [
    { plate: VEHICLES[3].plate, docLabel: 'Bảo hiểm TNDS', expiryDate: '2026-11-12', daysLeft: 16, state: 'Sắp hết hạn' },
    { plate: VEHICLES[6].plate, docLabel: 'Bảo hiểm TNDS', expiryDate: '2026-11-21', daysLeft: 25, state: 'Sắp hết hạn' },
    { plate: VEHICLES[9].plate, docLabel: 'Bảo hiểm TNDS', expiryDate: '2026-11-30', daysLeft: 34, state: 'Sắp hết hạn' },
    { plate: VEHICLES[5].plate, docLabel: 'Kiểm định', expiryDate: '2026-11-18', daysLeft: 22, state: 'Sắp hết hạn' },
  ];
  const svcRows = VEHICLES.filter(v => v.serviceRemainingKm < 500).map(v => ({ plate: v.plate, odometerKm: v.odometerKm, remainingKm: Math.max(0, v.serviceRemainingKm) }));
  const cabinZero = STUDENTS.filter(s => s.closeDate >= TODAY && s.cabinHours === 0);
  const debtCount = STUDENTS.filter(s => s.tuitionDebt > 0).length;
  function alertBundle() {
    return {
      alerts: [
        { kind: 'DAT quá hạn', level: 'error', message: overdueStu.length + ' HV chưa đủ km DAT, đã quá hạn hoàn thành (khóa K38)' },
        { kind: 'DAT sắp hết hạn', level: 'warn', message: dueSoonStu.length + ' HV khóa K39 sắp hết hạn DAT 31/10/2026 mà chưa đủ km' },
        { kind: 'Sắp bế giảng', level: 'warn', message: 'Khóa K39 bế giảng 31/10/2026 — còn 3 ngày' },
        { kind: 'Trùng lịch', level: 'error', message: CONFLICTS.length + ' lịch trùng GV/xe cần xử lý' },
        { kind: 'Giấy tờ xe', level: 'warn', message: docRows.length + ' xe sắp hết hạn bảo hiểm/kiểm định' },
        { kind: 'Học phí', level: 'warn', message: debtCount + ' HV còn nợ học phí' },
      ],
      notifications: overdueStu.slice(0, 3).map((s, i) => ({ createdAt: TODAY + 'T01:00:00.000Z', id: 101 + i, kind: 'DAT', message: 'Mốc DAT: ' + s.name + ' (MHV ' + s.maHv + ') còn thiếu ' + (s.datKmTotal - s.datKmDone) + ' km', target: s.name }))
        .concat(dueSoonStu.slice(0, 2).map((s, i) => ({ createdAt: TODAY + 'T01:05:00.000Z', id: 111 + i, kind: 'DAT', message: 'HV ' + s.name + ' (K39) cần chạy thêm ' + (s.datKmTotal - s.datKmDone) + ' km trước 31/10', target: s.name })))
        .concat([{ createdAt: TODAY + 'T02:00:00.000Z', id: 121, kind: 'Bế giảng', message: 'Khóa K39 bế giảng 31/10/2026 — rà soát HV chưa đủ điều kiện thi', target: 'K39' }]),
      vehicleDocAlerts: { count: docRows.length, rows: docRows },
      vehicleServiceAlerts: { count: svcRows.length, rows: svcRows },
      healthAlerts: { count: 0, rows: [] },
      cabinNotStarted: { count: cabinZero.length, rows: cabinZero.slice(0, 50).map(s => ({ code: s.code, name: s.name, courseCode: s.courseCode })) },
      vehicleOveruse: [],
      reminders: {
        closingSoon: { count: STUDENTS.filter(s => s.courseCode === 'K39').length, rows: STUDENTS.filter(s => s.courseCode === 'K39').map(s => ({ courseCode: 'K39', closeDate: '2026-10-31', daysLeft: 3, name: s.name, datOk: s.datKmDone >= s.datKmTotal, cabinOk: s.cabinHours >= 3, done: s.datKmDone >= s.datKmTotal && s.cabinHours >= 3 })) },
        datStartSoon: { count: 0, rows: [] },
      },
      datOverdue: { count: overdueStu.length, rows: overdueStu.map(alertRow) },
      datDueSoon: { count: dueSoonStu.length, rows: dueSoonStu.map(alertRow) },
    };
  }
  function sessionsProgress() {
    const total = 3200, scheduled = SESSIONS.length;
    const days = new Set(SESSIONS.map(x => x.date)).size;
    return { total, scheduled, remaining: total - scheduled, gridCells: total, datSpecial: SESSIONS.filter(x => x.type === 'DAT').length, sahinh: SESSIONS.filter(x => x.type === 'Sa hình').length, regular: SESSIONS.filter(x => x.type === 'Lý thuyết').length, off: 0, days, avgPerDay: Math.round(scheduled / days * 10) / 10, from: SESSIONS[0].date, to: '2026-12-31' };
  }
  const payByMonth = {};
  PAYMENTS.forEach(p => { const m = p.date.slice(0, 7); payByMonth[m] = (payByMonth[m] || 0) + p.amount; });
  const revenueMonth = payByMonth['2026-10'] || 0;

  // ---------------- API handlers ----------------
  const H = {
    getdashboard() {
      const byClass = ['B2', 'C1', 'B1'].map(c => ({ licenseClass: c, count: STUDENTS.filter(s => s.licenseClass === c).length }));
      const heat = {};
      SESSIONS.forEach(x => heat[x.date] = (heat[x.date] || 0) + 1);
      const todaySess = SESSIONS.filter(x => x.date === TODAY);
      return {
        kpis: { totalStudents: 200, byClass, todaySessions: todaySess.length, thToday: todaySess.filter(x => x.type !== 'Lý thuyết').length, ltToday: todaySess.filter(x => x.type === 'Lý thuyết').length, revenueMonth, profitMonth: -Math.round(revenueMonth * 0.12 / 1000000) * 1000000, profitPct: -12, passRate: Math.round(PASSED_N / EXAMINED.length * 100), licensedCount: LICENSED.length, teachersActive: 11, vehiclesTotal: 14, vehiclesInUse: 12, conflicts: CONFLICTS.length },
        sessionsProgress: sessionsProgress(),
        cabinStats: { fullCount: STUDENTS.filter(s => s.cabinHours >= 3).length, total: 200, pct: Math.round(STUDENTS.filter(s => s.cabinHours >= 3).length / 2) },
        gantt: COURSES.map(c => ({ code: c.code, licenseClass: c.licenseClass, openDate: c.openDate, closeDate: c.closeDate, ltStart: c.ltStart, ltEnd: c.ltEnd, thStart: c.thStart, thEnd: c.thEnd, studentCount: c.count })),
        heatmap: Object.keys(heat).sort().map(d => ({ date: d, sessions: heat[d] })),
        licensed: LICENSED.map(s => ({ name: s.name, licenseClass: s.licenseClass, licenseDate: s.licenseDate, licenseScore: s.licenseScore })),
        alerts: alertBundle(),
      };
    },
    listnotifications() { return alertBundle(); },
    getlookups() {
      return {
        courses: COURSES.map(c => ({ code: c.code, licenseClass: c.licenseClass, tuition: c.tuition })),
        teachers: TEACHERS.map(t => ({ id: t.id, name: t.name, shortName: t.shortName, color: t.color, kind: t.kind })),
        vehicles: VEHICLES.map(v => ({ id: v.id, plate: v.plate, status: v.status })),
        students: STUDENTS.map(s => ({ id: s.id, code: s.code, maHv: s.maHv, name: s.name, courseCode: s.courseCode, status: s.status, datKmDone: s.datKmDone, datKmTotal: s.datKmTotal, plateKg: s.plateKg })),
      };
    },
    liststudents(p) {
      let rows = STUDENTS.slice();
      const q = (p.search || '').toString().toLowerCase();
      if (q) rows = rows.filter(s => (s.name + ' ' + s.code + ' ' + s.phone + ' ' + s.cccd).toLowerCase().includes(q));
      if (p.courseCode) rows = rows.filter(s => s.courseCode === p.courseCode);
      if (p.centerName) rows = rows.filter(s => s.centerName === p.centerName);
      if (p.status) rows = rows.filter(s => s.status === p.status);
      if (p.onlyEligible === 'true' || p.onlyEligible === true) rows = rows.filter(s => s.eligible);
      const page = parseInt(p.page || '1', 10), size = parseInt(p.pageSize || '20', 10);
      return { students: rows.slice((page - 1) * size, page * size).map(pub), total: rows.length, page, pageSize: size };
    },
    getstudent(p) {
      const s = stuById[parseInt(p.id, 10)] || STUDENTS[0];
      return {
        student: pub(s),
        payments: PAYMENTS.filter(x => x.studentId === s.id).map(x => ({ id: x.id, date: x.date, amount: x.amount, kind: x.kind, method: x.method, note: x.note })),
        schedules: SESSIONS.filter(x => x.studentId === s.id),
        exams: EXAM_RESULTS.filter(x => x.studentId === s.id).map(x => ({ _row: 1, ID: x.id, IDHocVien: s.id, MaHV: s.code, HoTen: s.name, MaKhoa: s.courseCode, NgayThi: x.examDate, SBD: x.sbd, LyThuyet: x.theory, DiemLT: x.theoryScore, SaHinh: x.sahinh, DiemSH: x.sahinhScore, DuongTruong: x.road, DiemDT: x.roadScore, KetQua: x.passed ? 'Đậu' : 'Rớt', DiemTong: Math.round((x.theoryScore + x.sahinhScore + x.roadScore) / 3), TrangThaiBang: s.hasLicense ? 'Đã cấp' : 'Chưa cấp', SoHieuBang: s.certNo, NgayCapBang: s.licenseDate, GhiChu: '' })),
        history: [],
      };
    },
    listschedules(p) { return { schedules: SESSIONS.filter(x => x.date === p.date) }; },
    listschedulesrange(p) {
      const rows = SESSIONS.filter(x => x.date >= p.from && x.date <= p.to);
      const totals = {}; rows.forEach(x => totals[x.date] = (totals[x.date] || 0) + 1);
      const dayTotals = []; let d = p.from;
      while (d <= p.to) { dayTotals.push({ date: d, sessions: totals[d] || 0 }); d = dAdd(d, 1); }
      const markers = [];
      COURSES.forEach(c => {
        if (c.closeDate >= p.from && c.closeDate <= p.to) markers.push({ date: c.closeDate, kind: 'close', label: 'Bế giảng khóa ' + c.code });
        if (c.openDate >= p.from && c.openDate <= p.to) markers.push({ date: c.openDate, kind: 'open', label: 'Khai giảng khóa ' + c.code });
        if (c.datStart >= p.from && c.datStart <= p.to) markers.push({ date: c.datStart, kind: 'dat', label: 'Xuống DAT khóa ' + c.code });
      });
      return { schedules: rows, dayTotals, markers, cabinByCourse: COURSES.map(c => { const ss = STUDENTS.filter(s => s.courseCode === c.code); const done = ss.filter(s => s.cabinHours >= 3).length; return { courseCode: c.code, students: ss.length, done3h: done, avgHours: Math.round(ss.reduce((a, s) => a + s.cabinHours, 0) / ss.length * 10) / 10, pct: Math.round(done / ss.length * 100) }; }) };
    },
    getdatsummary(p) {
      let rows = STUDENTS.map(s => {
        const pct = Math.round(s.datKmDone / s.datKmTotal * 100);
        const status = pct >= 100 ? 'Đạt chuẩn' : s.datKmDone === 0 ? 'Chưa chạy' : s.closeDate < TODAY ? 'Quá hạn' : pct >= Math.round(s._prog * 100) - 5 ? 'Đúng tiến độ' : 'Chậm';
        return { studentId: s.id, code: s.code, maHv: s.maHv, name: s.name, courseCode: s.courseCode, licenseClass: s.licenseClass, openDate: s.openDate, closeDate: s.closeDate, doneKm: s.datKmDone, targetKm: s.datKmTotal, remainingKm: s.datKmTotal - s.datKmDone, pct, g2Pct: pct, status, below500: s.datKmDone < 500, hoursDone: Math.round(s.datKmDone / 40.5), hoursNeeded: Math.ceil((s.datKmTotal - s.datKmDone) / 40.5), avgSpeedKmh: 40.5, homePlate: s.homePlate, homeTeacherName: s.homeTeacherName };
      });
      const q = (p.search || '').toString().toLowerCase();
      if (q) rows = rows.filter(r => (r.name + ' ' + r.code).toLowerCase().includes(q));
      if (p.courseCode) rows = rows.filter(r => r.courseCode === p.courseCode);
      const all = STUDENTS;
      return { rows, summary: { totalStudents: 200, totalKmDone: all.reduce((a, s) => a + s.datKmDone, 0), totalTargetKm: all.reduce((a, s) => a + s.datKmTotal, 0), passedCount: rows.filter(r => r.status === 'Đạt chuẩn').length, onTrackCount: rows.filter(r => r.status === 'Đúng tiến độ').length, slowCount: rows.filter(r => r.status === 'Chậm' || r.status === 'Quá hạn').length, notStartedCount: rows.filter(r => r.status === 'Chưa chạy').length } };
    },
    listpayments() {
      const month = PAYMENTS.filter(x => x.date.startsWith('2026-10'));
      return { payments: month, totalMonth: month.reduce((a, x) => a + x.amount, 0), totalPaidAll: PAYMENTS.reduce((a, x) => a + x.amount, 0), totalGrossAll: STUDENTS.reduce((a, s) => a + s.tuitionTotal, 0), totalPayableAll: STUDENTS.reduce((a, s) => a + s.tuitionPayable, 0), totalDiscountAll: STUDENTS.reduce((a, s) => a + s.tuitionDiscount, 0), totalDebtAll: STUDENTS.reduce((a, s) => a + s.tuitionDebt, 0) };
    },
    listadmissions() {
      const names = ['Khải', 'Mai', 'Đức', 'Lan', 'Sơn', 'Ngọc', 'Hải', 'Thu', 'Phúc', 'Trang', 'Hiếu', 'Vy', 'Đạt', 'Nhung', 'Tài', 'Yến'];
      const LBL = { cccd: 'CCCD', health: 'Giấy khám sức khỏe', photo: 'Ảnh 3x4', form: 'Đơn đăng ký', resume: 'Sơ yếu lý lịch' };
      const rows = names.map((w, i) => {
        const missing = Object.keys(LBL).filter((k, ki) => (i + ki) % 4 === 3);
        const docs = {}; Object.keys(LBL).forEach(k => docs[k] = missing.includes(k) ? 'Chưa nộp' : 'Đã nộp');
        const first = dAdd('2026-10-01', i % 24);
        return { id: 401 + i, expectedCode: 'TS' + pad(i + 1, 3), name: 'Nguyễn ' + (i % 2 ? 'Thị ' : 'Văn ') + w, phone: '093' + (4000000 + i * 137), licenseClass: ['B2', 'B1', 'C1'][i % 3], source: ['Đến trực tiếp', 'Facebook', 'Zalo', 'Giới thiệu'][i % 4], firstSubmitDate: first, deadline: dAdd(first, 14), docs, docsStatus: missing.length ? 'Thiếu giấy tờ' : 'Đủ giấy tờ', missingCount: missing.length, missingLabels: missing.map(k => LBL[k]), healthExamDate: first, healthExpiry: dAdd(first, 365) };
      });
      return { rows, summary: { total: rows.length, enough: rows.filter(r => r.missingCount === 0).length, missing: rows.filter(r => r.missingCount > 0).length, overdue: rows.filter(r => r.missingCount > 0 && r.deadline < TODAY).length } };
    },
    listexamrounds() {
      const reg = s => ({ id: s.id, studentId: s.id, sbd: '', code: s.code, name: s.name, courseCode: s.courseCode, licenseClass: s.licenseClass, dob: s.dob, cccd: s.cccd });
      return { rounds: [
        { id: 1, name: 'Đợt sát hạch 10/10/2026', examDate: '2026-10-10', location: 'Trung tâm sát hạch lái xe (Sở GTVT TP.HCM)', dossierStatus: 'Đã có kết quả', registrations: EXAMINED.map((s, i) => ({ ...reg(s), sbd: pad(i + 1, 3) })) },
        { id: 2, name: 'Đợt sát hạch 05/11/2026', examDate: '2026-11-05', location: 'Trung tâm sát hạch lái xe (Sở GTVT TP.HCM)', dossierStatus: 'Đã nộp Sở', registrations: ELIGIBLE.map((s, i) => ({ ...reg(s), sbd: pad(i + 1, 3) })) },
      ], registrable: [] };
    },
    listexams() {
      return { results: EXAM_RESULTS, eligible: ELIGIBLE.map(pub), eligibleTotal: ELIGIBLE.length, passedTotal: PASSED_N, licensedCount: LICENSED.length, passedNoLicense: PASSED_N - LICENSED.length, passRate: Math.round(PASSED_N / EXAMINED.length * 100), passByCourse: [{ courseCode: 'K38', examined: EXAMINED.length, passed: PASSED_N, rate: Math.round(PASSED_N / EXAMINED.length * 1000) / 10 }], nextExamDate: '2026-11-05' };
    },
    getfleet() {
      const logs = H.listfuellogs();
      const botucNames = ['Trần Văn Khải', 'Lê Thị Mai', 'Phạm Văn Đức', 'Hoàng Thị Lan', 'Vũ Văn Sơn', 'Đặng Thị Ngọc', 'Bùi Văn Hải', 'Ngô Thị Thu'];
      const botuc = botucNames.map((nm, i) => { const svc = i % 2 ? 'Thuê xe' : 'Bổ túc tay lái'; const rate = svc === 'Thuê xe' ? 300000 : 350000; return { id: 601 + i, date: dAdd('2026-10-20', i), customerName: nm, phone: '093' + (5000000 + i * 211), service: svc, teacherName: TEACHERS[i % 12].name, plate: VEHICLES[i % 14].plate, slot: SLOTS[i % 6], hours: 2, rate, total: 2 * rate, note: '' }; });
      return { teachers: TEACHERS, vehicles: VEHICLES, botuc, botucTotal: botuc.reduce((a, x) => a + x.total, 0), centers: CENTERS, commissionTotal: COMMISSION_TOTAL, fuelTotal: logs.logs.reduce((a, x) => a + x.amount, 0) };
    },
    listcenters() { return { centers: CENTERS, commissionTotal: COMMISSION_TOTAL }; },
    listconflicts() { return { conflicts: CONFLICTS }; },
    listfuellogs() {
      const logs = [];
      VEHICLES.forEach((v, i) => { for (let k = 0; k < 2; k++) { const liters = 26 + (i + k * 3) % 10; logs.push({ id: 801 + i * 2 + k, vehicleId: v.id, plate: v.plate, date: '2026-10-' + pad(3 + ((i * 2 + k * 5) % 24), 2), liters, odometerKm: v.odometerKm - 300 - k * 350, amount: liters * 21500 }); } });
      return { logs, perVehicle: VEHICLES.map(v => { const ls = logs.filter(x => x.vehicleId === v.id); return { plate: v.plate, vehicleId: v.id, logs: ls.length, totalLiters: ls.reduce((a, x) => a + x.liters, 0), totalAmount: ls.reduce((a, x) => a + x.amount, 0), kmDriven: 350, litersPer100: 7.4 }; }) };
    },
    getreports() {
      const M = 1000000;
      const gross = STUDENTS.reduce((a, s) => a + s.tuitionTotal, 0) / M, disc = STUDENTS.reduce((a, s) => a + s.tuitionDiscount, 0) / M;
      const collected = PAYMENTS.reduce((a, x) => a + x.amount, 0) / M;
      const months = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
      const plSeries = months.map((m, mi) => { const rev = Math.round((payByMonth[m] || 0) / M); const cost = Math.round(rev * (0.68 + (mi % 3) * 0.06)); return { month: 'T' + (mi + 5) + '/2026', revenue: rev, cost, profit: rev - cost }; });
      const totCost = plSeries.reduce((a, x) => a + x.cost, 0);
      const byPlate = {}; SESSIONS.filter(x => x.type === 'DAT').forEach(x => { byPlate[x.plate] = byPlate[x.plate] || { plate: x.plate, km: 0, sessions: 0 }; byPlate[x.plate].km += x.km; byPlate[x.plate].sessions++; });
      return {
        totalStudents: 200,
        studentsByCourse: COURSES.map(c => ({ courseCode: c.code, licenseClass: c.licenseClass, count: c.count })),
        receivable: { totalGross: gross, totalDiscount: disc, totalDue: gross - disc, collected, debt: gross - disc - collected },
        revenueByCourse: COURSES.map(c => { const ss = STUDENTS.filter(s => s.courseCode === c.code); return { label: c.code, students: c.count, perCourse: c.tuition / M, total: Math.round(ss.reduce((a, s) => a + s.tuitionPaid, 0) / M) }; }),
        plSeries,
        costBreakdown: [['Lương giáo viên', 0.62], ['Xăng dầu', 0.14], ['Bảo trì & khấu hao xe', 0.13], ['Mặt bằng & khác', 0.11]].map(([label, f]) => ({ label, amount: Math.round(totCost * f), pct: Math.round(f * 1000) / 10 })),
        datByVehicle: Object.values(byPlate).sort((a, b) => b.km - a.km),
        datBySlot: SLOTS.map(sl => ({ slot: sl, dat: SESSIONS.filter(x => x.slot === sl && x.type === 'DAT').length, sahinh: SESSIONS.filter(x => x.slot === sl && x.type === 'Sa hình').length })),
        sessionsProgress: sessionsProgress(), eligibleCount: ELIGIBLE.length, passRate: Math.round(PASSED_N / EXAMINED.length * 100),
      };
    },
    getgovreports() {
      return {
        byCourse: COURSES.map(c => ({ courseCode: c.code, licenseClass: c.licenseClass, openDate: c.openDate, closeDate: c.closeDate, total: c.count, graduated: STUDENTS.filter(s => s.courseCode === c.code && s._passed).length, examined: STUDENTS.filter(s => s.courseCode === c.code && s._examined).length, passed: STUDENTS.filter(s => s.courseCode === c.code && s._passed).length })),
        enrollments: STUDENTS.map(s => ({ code: s.code, name: s.name, cccd: s.cccd, dob: s.dob, licenseClass: s.licenseClass, courseCode: s.courseCode, regDate: s.regDate, openDate: s.openDate })),
        examByDate: [{ examDate: '2026-10-10', total: EXAMINED.length, passed: PASSED_N, students: EXAM_RESULTS.map(x => ({ code: x.code, name: x.name, courseCode: x.courseCode, sbd: x.sbd, theory: x.theory, sahinh: x.sahinh, road: x.road, result: x.passed ? 'Đậu' : 'Rớt' })) }],
      };
    },
    getconfig() {
      let cfg = null;
      try { cfg = JSON.parse(localStorage.getItem('tt_cfg_saved') || 'null'); } catch (e) {}
      return { config: cfg };
    },
  };

  window.DEMO_API = {
    get(action, params) {
      return new Promise(resolve => setTimeout(() => {
        try { resolve(Object.assign({ ok: true }, H[action] ? H[action](params || {}) : {})); }
        catch (e) { resolve({ ok: false, error: 'Demo: ' + e.message }); }
      }, 60));
    },
    post(action, params) {
      return new Promise(resolve => setTimeout(() => {
        if (action === 'saveconfig') { try { localStorage.setItem('tt_cfg_saved', JSON.stringify((params || {}).config || {})); } catch (e) {} }
        resolve({ ok: true, id: Date.now() });
      }, 60));
    },
  };
})();
