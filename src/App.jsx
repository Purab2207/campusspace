import { useState, useMemo } from "react";
import { AlertTriangle, X, Plus, Check, Building, Clock, Search, Bell, Users, MapPin, BarChart2, Calendar, Database, Upload, RefreshCw, ChevronRight, FileSpreadsheet, Table2 } from "lucide-react";

const ROOMS = [
  { id: "LH-101", name: "LH 101", full: "Lecture Hall 101", building: "Main Block", floor: 1, capacity: 120, type: "lecture", facilities: ["AC", "Projector", "Smartboard", "Mic System"], accessible: true },
  { id: "LH-102", name: "LH 102", full: "Lecture Hall 102", building: "Main Block", floor: 1, capacity: 80, type: "lecture", facilities: ["AC", "Projector", "Whiteboard"], accessible: true },
  { id: "LH-201", name: "LH 201", full: "Lecture Hall 201", building: "Engineering Block", floor: 2, capacity: 60, type: "lecture", facilities: ["AC", "Projector"], accessible: false },
  { id: "SR-101", name: "SR 101", full: "Seminar Room 101", building: "Admin Block", floor: 1, capacity: 40, type: "seminar", facilities: ["AC", "Whiteboard", "Projector"], accessible: true },
  { id: "SR-201", name: "SR 201", full: "Seminar Room 201", building: "Engineering Block", floor: 2, capacity: 35, type: "seminar", facilities: ["AC", "Whiteboard"], accessible: false },
  { id: "LAB-301", name: "Lab 301", full: "Computer Lab 301", building: "IT Block", floor: 3, capacity: 30, type: "lab", facilities: ["AC", "Computers (30)", "Projector"], accessible: false },
  { id: "LAB-302", name: "Lab 302", full: "Chemistry Lab 302", building: "Science Block", floor: 1, capacity: 25, type: "lab", facilities: ["Fume Hood", "Safety Cabinet", "Whiteboard"], accessible: true },
];

const TIME_SLOTS = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SIS_COURSES = [
  { id: "CS301", name: "Data Structures", dept: "CSE", students: 85, faculty: "Dr. Arjun Sharma", semester: "Even 2025-26", status: "active" },
  { id: "CS401", name: "Machine Learning", dept: "CSE", students: 70, faculty: "Dr. Arjun Sharma", semester: "Even 2025-26", status: "active" },
  { id: "EC301", name: "Digital Electronics", dept: "ECE", students: 90, faculty: "Dr. Priya Mehta", semester: "Even 2025-26", status: "active" },
  { id: "ME201", name: "Thermodynamics", dept: "ME", students: 110, faculty: "Dr. Ravi Kumar", semester: "Even 2025-26", status: "active" },
  { id: "CH301", name: "Organic Chemistry", dept: "CHEM", students: 25, faculty: "Dr. Anita Singh", semester: "Even 2025-26", status: "active" },
  { id: "MA201", name: "Linear Algebra", dept: "MATH", students: 130, faculty: "Prof. Vikram Das", semester: "Even 2025-26", status: "active" },
  { id: "CS201", name: "Operating Systems", dept: "CSE", students: 60, faculty: "Dr. Arjun Sharma", semester: "Even 2025-26", status: "active" },
  { id: "PHY101", name: "Engineering Physics", dept: "PHY", students: 40, faculty: "Dr. Priya Mehta", semester: "Even 2025-26", status: "active" },
  { id: "EC401", name: "VLSI Design", dept: "ECE", students: 55, faculty: "TBD", semester: "Even 2025-26", status: "pending" },
  { id: "ME301", name: "Fluid Mechanics", dept: "ME", students: 95, faculty: "Dr. Ravi Kumar", semester: "Even 2025-26", status: "active" },
];

const CSV_PREVIEW_ROWS = [
  { room: "LH-101", day: "Mon", slot: "9:00", course: "CS301", faculty: "Dr. Arjun Sharma", status: "ok" },
  { room: "LH-102", day: "Mon", slot: "9:00", course: "EC301", faculty: "Dr. Priya Mehta", status: "ok" },
  { room: "LH-201", day: "Tue", slot: "14:00", course: "ME201", faculty: "Dr. Ravi Kumar", status: "ok" },
  { room: "SR-101", day: "Wed", slot: "10:00", course: "PHY101", faculty: "Dr. Priya Mehta", status: "ok" },
  { room: "LAB-301", day: "Wed", slot: "14:00", course: "CS401", faculty: "Dr. Arjun Sharma", status: "ok" },
  { room: "LH-101", day: "Mon", slot: "9:00", course: "MA201", faculty: "Prof. Vikram Das", status: "conflict" },
  { room: "SR-201", day: "Fri", slot: "14:00", course: "PHY101", faculty: "Dr. Priya Mehta", status: "ok" },
  { room: "LH-102", day: "Fri", slot: "11:00", course: "CS201", faculty: "Dr. Arjun Sharma", status: "ok" },
];

const COURSES = SIS_COURSES.filter(c => c.status === "active").map(c => ({
  id: c.id, name: c.name, dept: c.dept, students: c.students
}));

const FACULTY = [
  { id: "F1", name: "Dr. Arjun Sharma", dept: "CSE" },
  { id: "F2", name: "Dr. Priya Mehta", dept: "ECE" },
  { id: "F3", name: "Dr. Ravi Kumar", dept: "ME" },
  { id: "F4", name: "Dr. Anita Singh", dept: "CHEM" },
  { id: "F5", name: "Prof. Vikram Das", dept: "MATH" },
];

const INIT_BOOKINGS = [
  { id: 1, roomId: "LH-101", day: "Mon", slot: "9:00", courseId: "CS301", facultyId: "F1" },
  { id: 2, roomId: "LH-101", day: "Mon", slot: "10:00", courseId: "CS301", facultyId: "F1" },
  { id: 3, roomId: "LH-102", day: "Mon", slot: "9:00", courseId: "EC301", facultyId: "F2" },
  { id: 4, roomId: "LH-101", day: "Tue", slot: "11:00", courseId: "MA201", facultyId: "F5" },
  { id: 5, roomId: "LH-201", day: "Tue", slot: "14:00", courseId: "ME201", facultyId: "F3" },
  { id: 6, roomId: "SR-101", day: "Wed", slot: "10:00", courseId: "PHY101", facultyId: "F2" },
  { id: 7, roomId: "LAB-301", day: "Wed", slot: "14:00", courseId: "CS401", facultyId: "F1" },
  { id: 8, roomId: "LAB-301", day: "Wed", slot: "15:00", courseId: "CS401", facultyId: "F1" },
  { id: 9, roomId: "LAB-302", day: "Thu", slot: "10:00", courseId: "CH301", facultyId: "F4" },
  { id: 10, roomId: "LH-102", day: "Thu", slot: "9:00", courseId: "CS201", facultyId: "F1" },
  { id: 11, roomId: "LH-101", day: "Fri", slot: "9:00", courseId: "ME201", facultyId: "F3" },
  { id: 12, roomId: "SR-201", day: "Fri", slot: "14:00", courseId: "PHY101", facultyId: "F2" },
  { id: 13, roomId: "LH-102", day: "Fri", slot: "11:00", courseId: "CS201", facultyId: "F1" },
  { id: 14, roomId: "SR-101", day: "Sat", slot: "9:00", courseId: "MA201", facultyId: "F5" },
];

const TYPE_STYLES = {
  lecture: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500", label: "Lecture Hall" },
  seminar: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "Seminar Room" },
  lab: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500", label: "Lab" },
};

const DEPT_COLORS = {
  CSE: "bg-blue-100 text-blue-700", ECE: "bg-violet-100 text-violet-700",
  ME: "bg-orange-100 text-orange-700", CHEM: "bg-rose-100 text-rose-700",
  MATH: "bg-teal-100 text-teal-700", PHY: "bg-amber-100 text-amber-700",
};

export default function CampusSpace() {
  const [persona, setPersona] = useState("admin");
  const [bookings, setBookings] = useState(INIT_BOOKINGS);
  const [activeDay, setActiveDay] = useState("Mon");
  const [selectedFaculty, setSelectedFaculty] = useState("F1");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);
  const [notification, setNotification] = useState(null);
  const [modalForm, setModalForm] = useState({ roomId: "LH-101", day: "Mon", slot: "8:00", courseId: "", facultyId: "" });

  // SIS Import state
  const [showSISModal, setShowSISModal] = useState(false);
  const [sisStep, setSisStep] = useState("preview");
  const [sisSelected, setSisSelected] = useState(SIS_COURSES.filter(c => c.status === "active").map(c => c.id));
  const [sisProgress, setSisProgress] = useState(0);

  // CSV Import state
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvStep, setCsvStep] = useState("upload"); // upload | preview | importing | done
  const [csvProgress, setCsvProgress] = useState(0);

  const getBooking = (roomId, day, slot) =>
    bookings.find((b) => b.roomId === roomId && b.day === day && b.slot === slot);

  const getConflicts = (roomId, day, slot, facultyId, excludeId = null) => {
    const issues = [];
    const roomConflict = bookings.find((b) => b.roomId === roomId && b.day === day && b.slot === slot && b.id !== excludeId);
    if (roomConflict) {
      const c = COURSES.find((c) => c.id === roomConflict.courseId);
      issues.push({ type: "room", msg: `Room already booked for ${c?.name || roomConflict.courseId}` });
    }
    if (facultyId) {
      const facConflict = bookings.find((b) => b.facultyId === facultyId && b.day === day && b.slot === slot && b.id !== excludeId);
      if (facConflict) {
        const r = ROOMS.find((r) => r.id === facConflict.roomId);
        issues.push({ type: "faculty", msg: `Faculty already assigned to ${r?.full || facConflict.roomId}` });
      }
    }
    return issues;
  };

  const getCapacityWarning = (roomId, courseId) => {
    const room = ROOMS.find((r) => r.id === roomId);
    const course = COURSES.find((c) => c.id === courseId);
    if (room && course && course.students > room.capacity) {
      return `${course.students} enrolled but room fits only ${room.capacity}. Consider a larger space.`;
    }
    return null;
  };

  const openCell = (roomId, day, slot) => {
    const existing = getBooking(roomId, day, slot);
    if (existing) { setDetailBooking(existing); }
    else { setModalForm({ roomId, day, slot, courseId: "", facultyId: "" }); setShowModal(true); }
  };

  const handleBook = () => {
    const { roomId, day, slot, courseId, facultyId } = modalForm;
    if (!courseId || !facultyId) return;
    const conflicts = getConflicts(roomId, day, slot, facultyId);
    if (conflicts.length > 0) return;
    setBookings((prev) => [...prev, { id: Date.now(), roomId, day, slot, courseId, facultyId }]);
    setShowModal(false);
    toast("Booking confirmed", "success");
  };

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDetailBooking(null);
    toast("Booking removed", "info");
  };

  const toast = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSISImport = () => {
    setSisStep("importing");
    setSisProgress(0);
    const interval = setInterval(() => {
      setSisProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setSisStep("done"); return 100; }
        return prev + 8;
      });
    }, 120);
  };

  const handleSISDone = () => {
    setShowSISModal(false);
    setSisStep("preview");
    setSisProgress(0);
    toast(`${sisSelected.length} courses imported from SIS`, "success");
  };

  const handleCSVUpload = () => setCsvStep("preview");

  const handleCSVImport = () => {
    setCsvStep("importing");
    setCsvProgress(0);
    const interval = setInterval(() => {
      setCsvProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setCsvStep("done"); return 100; }
        return prev + 10;
      });
    }, 100);
  };

  const handleCSVDone = () => {
    setShowCSVModal(false);
    setCsvStep("upload");
    setCsvProgress(0);
    toast("Timetable imported from Excel sheet", "success");
  };

  const toggleSISCourse = (id) => {
    setSisSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredRooms = useMemo(() =>
    ROOMS.filter((r) => {
      const q = searchQuery.toLowerCase();
      return (typeFilter === "all" || r.type === typeFilter) &&
        (!q || r.full.toLowerCase().includes(q) || r.building.toLowerCase().includes(q));
    }), [searchQuery, typeFilter]);

  const dayBookings = bookings.filter((b) => b.day === activeDay);
  const utilPct = Math.round((dayBookings.length / (ROOMS.length * TIME_SLOTS.length)) * 100);
  const liveConflicts = getConflicts(modalForm.roomId, modalForm.day, modalForm.slot, modalForm.facultyId);
  const capWarning = getCapacityWarning(modalForm.roomId, modalForm.courseId);
  const canBook = modalForm.courseId && modalForm.facultyId && liveConflicts.length === 0;
  const facultySchedule = bookings.filter((b) => b.facultyId === selectedFaculty);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAV */}
      <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-xs font-bold tracking-tight">CS</div>
          <span className="font-semibold text-sm tracking-tight">CampusSpace</span>
          <span className="text-slate-500 text-xs">IIT Ropar · Even Sem 2025–26</span>
          <div className="flex items-center gap-1.5 bg-emerald-900/50 border border-emerald-700/40 rounded-lg px-2 py-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-emerald-400 text-[10px] font-medium">SIS Connected</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
            {[{ id: "admin", label: "Admin" }, { id: "faculty", label: "Faculty" }, { id: "student", label: "Student" }].map((p) => (
              <button key={p.id} onClick={() => setPersona(p.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${persona === p.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 ${notification.type === "success" ? "bg-emerald-600 text-white" : "bg-slate-700 text-white"}`}>
          <Check className="w-3.5 h-3.5" />{notification.msg}
        </div>
      )}

      {/* ═══ ADMIN VIEW ═══ */}
      {persona === "admin" && (
        <div className="p-5">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total Spaces", value: ROOMS.length, sub: "across 4 buildings", Icon: Building },
              { label: `Booked · ${activeDay}`, value: dayBookings.length, sub: `${utilPct}% utilisation`, Icon: Calendar },
              { label: "Free Slots", value: ROOMS.length * TIME_SLOTS.length - dayBookings.length, sub: "available today", Icon: Check },
              { label: "Courses from SIS", value: COURSES.length, sub: "imported this semester", Icon: Database },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">{s.label}</span>
                  <s.Icon className="w-3.5 h-3.5 text-slate-200" />
                </div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Grid card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex gap-0.5">
                {DAYS.map((d) => (
                  <button key={d} onClick={() => setActiveDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeDay === d ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-2.5 py-1.5">
                  <Search className="w-3 h-3 text-slate-400" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search room..." className="bg-transparent outline-none text-xs w-28 text-slate-700" />
                </div>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none">
                  <option value="all">All types</option>
                  <option value="lecture">Lecture Halls</option>
                  <option value="seminar">Seminar Rooms</option>
                  <option value="lab">Labs</option>
                </select>
                <button onClick={() => setShowSISModal(true)}
                  className="flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-emerald-700">
                  <Database className="w-3 h-3" />Sync SIS
                </button>
                <button onClick={() => setShowCSVModal(true)}
                  className="flex items-center gap-1.5 bg-slate-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-slate-700">
                  <FileSpreadsheet className="w-3 h-3" />Import Excel
                </button>
                <button onClick={() => { setModalForm({ roomId: "LH-101", day: activeDay, slot: "9:00", courseId: "", facultyId: "" }); setShowModal(true); }}
                  className="flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-indigo-700">
                  <Plus className="w-3 h-3" />New Booking
                </button>
              </div>
            </div>

            {/* Timetable grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: "950px" }}>
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 w-44 sticky left-0 bg-white z-10">Room</th>
                    {TIME_SLOTS.map((slot) => (
                      <th key={slot} className="text-center px-1 py-3 text-xs font-medium text-slate-400" style={{ minWidth: "76px" }}>{slot}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => {
                    const s = TYPE_STYLES[room.type];
                    return (
                      <tr key={room.id} className="border-t border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-2 sticky left-0 bg-white z-10">
                          <div className="text-xs font-semibold text-slate-700">{room.full}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${s.badge}`}>{s.label}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{room.capacity}</span>
                            {!room.accessible && <span className="text-[10px] text-amber-500">⚠ no lift</span>}
                          </div>
                        </td>
                        {TIME_SLOTS.map((slot) => {
                          const booking = getBooking(room.id, activeDay, slot);
                          const course = booking ? COURSES.find((c) => c.id === booking.courseId) : null;
                          const faculty = booking ? FACULTY.find((f) => f.id === booking.facultyId) : null;
                          return (
                            <td key={slot} className="px-1 py-1.5">
                              {booking ? (
                                <button onClick={() => openCell(room.id, activeDay, slot)}
                                  className={`w-full rounded-lg p-1.5 border text-left hover:opacity-80 transition-opacity ${s.bg} ${s.border}`} style={{ height: "58px" }}>
                                  <div className={`text-[10px] font-bold leading-tight ${s.text}`}>{course?.id}</div>
                                  <div className="text-[9px] text-slate-500 leading-tight truncate">{faculty?.name.split(" ").slice(-1)[0]}</div>
                                  <div className={`text-[9px] ${s.text} opacity-60 mt-0.5`}>{course?.students} stu.</div>
                                </button>
                              ) : (
                                <button onClick={() => openCell(room.id, activeDay, slot)}
                                  className="w-full rounded-lg border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center group transition-all" style={{ height: "58px" }}>
                                  <Plus className="w-3 h-3 text-slate-200 group-hover:text-indigo-400 transition-colors" />
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-5 text-xs text-slate-400">
              {Object.entries(TYPE_STYLES).map(([type, s]) => (
                <span key={type} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}
                </span>
              ))}
              <span className="ml-auto">Click any slot to book or view details</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FACULTY VIEW ═══ */}
      {persona === "faculty" && (
        <div className="p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {FACULTY.find((f) => f.id === selectedFaculty)?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm outline-none">
                {FACULTY.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
              <div className="text-xs text-slate-400 mt-0.5 ml-1">{facultySchedule.length} sessions scheduled this week</div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {DAYS.map((day) => {
              const dayItems = facultySchedule.filter((b) => b.day === day).sort((a, b) => TIME_SLOTS.indexOf(a.slot) - TIME_SLOTS.indexOf(b.slot));
              return (
                <div key={day} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className={`px-3 py-2 text-xs font-bold text-center border-b border-slate-100 ${day === "Mon" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600"}`}>
                    {day}<span className="ml-1 opacity-50">({dayItems.length})</span>
                  </div>
                  <div className="p-2 space-y-1.5 min-h-44">
                    {dayItems.length === 0 ? (
                      <div className="text-center text-[10px] text-slate-300 pt-10">Free</div>
                    ) : (
                      dayItems.map((b) => {
                        const course = COURSES.find((c) => c.id === b.courseId);
                        const room = ROOMS.find((r) => r.id === b.roomId);
                        const s = TYPE_STYLES[room?.type || "lecture"];
                        return (
                          <div key={b.id} className={`rounded-lg p-2 border ${s.bg} ${s.border}`}>
                            <div className={`text-[10px] font-bold ${s.text}`}>{b.slot}</div>
                            <div className="text-[10px] text-slate-700 font-medium leading-tight">{course?.name}</div>
                            <div className="text-[9px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-2 h-2" />{room?.name}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Bell className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-amber-800">Room Change Requests</span>
                <span className="text-[10px] bg-amber-200 text-amber-700 rounded-full px-2 py-0.5 font-semibold">Phase 2</span>
              </div>
              <p className="text-xs text-amber-700">Faculty will be able to raise room swap requests, book makeup classes, and flag cancellations.</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STUDENT VIEW ═══ */}
      {persona === "student" && (
        <div className="p-5 max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-sm">PG</div>
            <div>
              <div className="font-semibold text-sm text-slate-800">Purab Gupta · B.Tech CSE, Sem 8</div>
              <div className="text-xs text-slate-400">Today: Monday · 4 classes</div>
            </div>
          </div>
          <div className="space-y-3">
            {bookings.filter((b) => b.day === "Mon" && ["CS301", "CS401", "CS201", "MA201"].includes(b.courseId))
              .sort((a, b) => TIME_SLOTS.indexOf(a.slot) - TIME_SLOTS.indexOf(b.slot))
              .map((b, idx) => {
                const course = COURSES.find((c) => c.id === b.courseId);
                const room = ROOMS.find((r) => r.id === b.roomId);
                const faculty = FACULTY.find((f) => f.id === b.facultyId);
                const s = TYPE_STYLES[room?.type || "lecture"];
                const isNow = idx === 0;
                return (
                  <div key={b.id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 ${isNow ? "border-indigo-300 ring-2 ring-indigo-50" : "border-slate-100"}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                      <Clock className={`w-5 h-5 ${s.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800">{course?.name}</span>
                        {isNow && <span className="text-[10px] bg-indigo-600 text-white rounded-full px-2 py-0.5 font-semibold">NOW</span>}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{faculty?.name}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-slate-700">{b.slot}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 justify-end mt-0.5"><MapPin className="w-3 h-3" />{room?.name}</div>
                      <div className="text-[10px] text-slate-400">{room?.building}</div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
            📲 <strong>Phase 2:</strong> Room change alerts will be pushed via WhatsApp/SMS in real-time.
          </div>
        </div>
      )}

      {/* ═══ SIS IMPORT MODAL ═══ */}
      {showSISModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sync from Student Information System</h3>
                  <p className="text-xs text-slate-400 mt-0.5">IIT Ropar SIS · Even Semester 2025–26</p>
                </div>
              </div>
              {sisStep !== "importing" && (
                <button onClick={() => { setShowSISModal(false); setSisStep("preview"); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* STEP 1 — Preview */}
            {sisStep === "preview" && (
              <>
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500">Select courses to import. Faculty and enrollment data pulls automatically.</p>
                    <span className="text-xs font-semibold text-indigo-600">{sisSelected.length} selected</span>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-50 rounded-t-lg border border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    <div className="col-span-1"></div>
                    <div className="col-span-2">Code</div>
                    <div className="col-span-4">Course</div>
                    <div className="col-span-2">Dept</div>
                    <div className="col-span-2">Students</div>
                    <div className="col-span-1">Status</div>
                  </div>

                  {/* Course rows */}
                  <div className="border border-t-0 border-slate-100 rounded-b-lg overflow-hidden max-h-64 overflow-y-auto">
                    {SIS_COURSES.map((c, i) => {
                      const isSelected = sisSelected.includes(c.id);
                      const isPending = c.status === "pending";
                      return (
                        <div key={c.id}
                          onClick={() => !isPending && toggleSISCourse(c.id)}
                          className={`grid grid-cols-12 gap-2 px-3 py-2.5 items-center border-b border-slate-50 last:border-0 transition-colors ${isPending ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-slate-50"} ${isSelected && !isPending ? "bg-emerald-50/50" : ""}`}>
                          <div className="col-span-1">
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isSelected && !isPending ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
                              {isSelected && !isPending && <Check className="w-2 h-2 text-white" />}
                            </div>
                          </div>
                          <div className="col-span-2 text-xs font-mono font-semibold text-slate-600">{c.id}</div>
                          <div className="col-span-4">
                            <div className="text-xs font-medium text-slate-700 leading-tight">{c.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{c.faculty}</div>
                          </div>
                          <div className="col-span-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${DEPT_COLORS[c.dept] || "bg-slate-100 text-slate-600"}`}>{c.dept}</span>
                          </div>
                          <div className="col-span-2 text-xs text-slate-600 font-medium">{c.students}</div>
                          <div className="col-span-1">
                            {isPending
                              ? <span className="text-[10px] text-amber-500 font-medium">TBD</span>
                              : <span className="text-[10px] text-emerald-500 font-medium">✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2">⚠ Courses marked TBD have no faculty assigned in SIS yet. Import after assignment.</p>
                </div>

                <div className="px-5 pb-5 flex gap-2 mt-2">
                  <button onClick={() => { setShowSISModal(false); setSisStep("preview"); }}
                    className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button onClick={handleSISImport} disabled={sisSelected.length === 0}
                    className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import {sisSelected.length} Courses
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 — Importing */}
            {sisStep === "importing" && (
              <div className="px-5 py-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-800 text-sm mb-1">Syncing from SIS...</div>
                  <div className="text-xs text-slate-400">Pulling courses, enrollment counts, and faculty assignments</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-150" style={{ width: `${sisProgress}%` }} />
                </div>
                <div className="text-xs text-slate-400">{sisProgress}% complete</div>
                <div className="text-[10px] text-slate-300 space-y-1 text-center">
                  {sisProgress > 20 && <div className="text-slate-400">✓ Course codes verified</div>}
                  {sisProgress > 50 && <div className="text-slate-400">✓ Enrollment counts synced</div>}
                  {sisProgress > 80 && <div className="text-slate-400">✓ Faculty assignments loaded</div>}
                </div>
              </div>
            )}

            {/* STEP 3 — Done */}
            {sisStep === "done" && (
              <div className="px-5 py-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-800 text-sm mb-1">Import Complete</div>
                  <div className="text-xs text-slate-400">{sisSelected.length} courses are now available for scheduling</div>
                </div>
                <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2">
                  {[
                    ["Courses imported", `${sisSelected.length}`],
                    ["Faculty linked", `${FACULTY.length}`],
                    ["Total students covered", `${SIS_COURSES.filter(c => sisSelected.includes(c.id)).reduce((a, c) => a + c.students, 0)}`],
                    ["SIS source", "IIT Ropar SIS v4.2"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{k}</span>
                      <span className="text-xs font-semibold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-700">CampusSpace reads from SIS only. No data was written back to SIS.</span>
                </div>
                <button onClick={handleSISDone} className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                  Go to Timetable <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ CSV IMPORT MODAL ═══ */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Import from Excel / Google Sheets</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Migrate your existing timetable on day one</p>
                </div>
              </div>
              {csvStep !== "importing" && (
                <button onClick={() => { setShowCSVModal(false); setCsvStep("upload"); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* STEP 1 — Upload */}
            {csvStep === "upload" && (
              <div className="px-5 py-6">
                <div
                  onClick={handleCSVUpload}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-700">Drop your timetable file here</div>
                    <div className="text-xs text-slate-400 mt-1">Supports .xlsx, .xls, .csv — or click to browse</div>
                  </div>
                  <div className="text-xs text-indigo-500 font-medium">Click to simulate upload →</div>
                </div>

                <div className="mt-4 bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-600 mb-2">Expected column format</div>
                  <div className="grid grid-cols-5 gap-1 text-[10px]">
                    {["Room ID", "Day", "Time Slot", "Course Code", "Faculty"].map(h => (
                      <div key={h} className="bg-white border border-slate-200 rounded px-2 py-1 font-medium text-slate-600 text-center">{h}</div>
                    ))}
                    {["LH-101", "Mon", "9:00", "CS301", "Dr. Arjun Sharma"].map(v => (
                      <div key={v} className="bg-white border border-slate-100 rounded px-2 py-1 text-slate-400 text-center">{v}</div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  Conflicts in the sheet will be flagged before import. No bookings are created until you confirm.
                </div>
              </div>
            )}

            {/* STEP 2 — Preview with conflict detection */}
            {csvStep === "preview" && (
              <>
                <div className="px-5 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">timetable_even_2025.xlsx — 8 rows detected</p>
                      <p className="text-xs text-slate-400 mt-0.5">1 conflict found — review before importing</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium"><Check className="w-3 h-3" />7 valid</span>
                      <span className="flex items-center gap-1 text-[10px] text-red-500 font-medium"><AlertTriangle className="w-3 h-3" />1 conflict</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      <div className="col-span-2">Room</div>
                      <div className="col-span-1">Day</div>
                      <div className="col-span-2">Slot</div>
                      <div className="col-span-2">Course</div>
                      <div className="col-span-4">Faculty</div>
                      <div className="col-span-1">Status</div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {CSV_PREVIEW_ROWS.map((row, i) => (
                        <div key={i} className={`grid grid-cols-12 gap-1 px-3 py-2.5 border-b border-slate-50 last:border-0 items-center text-xs ${row.status === "conflict" ? "bg-red-50" : "bg-white"}`}>
                          <div className="col-span-2 font-mono font-semibold text-slate-600">{row.room}</div>
                          <div className="col-span-1 text-slate-500">{row.day}</div>
                          <div className="col-span-2 text-slate-500">{row.slot}</div>
                          <div className="col-span-2 font-medium text-slate-700">{row.course}</div>
                          <div className="col-span-4 text-slate-500 truncate">{row.faculty}</div>
                          <div className="col-span-1">
                            {row.status === "conflict"
                              ? <span className="text-[10px] text-red-500 font-semibold">⚠ Conflict</span>
                              : <span className="text-[10px] text-emerald-500 font-semibold">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-red-700">
                      <strong>Row 6:</strong> LH-101 on Mon 9:00 is already booked for CS301. This row will be skipped. Resolve manually after import.
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 flex gap-2 mt-3">
                  <button onClick={() => setCsvStep("upload")} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-600 hover:bg-slate-50">Back</button>
                  <button onClick={handleCSVImport} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />Import 7 Valid Rows
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 — Importing */}
            {csvStep === "importing" && (
              <div className="px-5 py-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-800 text-sm mb-1">Importing timetable...</div>
                  <div className="text-xs text-slate-400">Creating bookings and running conflict checks</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all duration-150" style={{ width: `${csvProgress}%` }} />
                </div>
                <div className="text-xs text-slate-400">{csvProgress}% complete</div>
                <div className="text-[10px] space-y-1 text-center">
                  {csvProgress > 30 && <div className="text-slate-400">✓ Rows validated</div>}
                  {csvProgress > 60 && <div className="text-slate-400">✓ Conflict check passed</div>}
                  {csvProgress > 90 && <div className="text-slate-400">✓ Bookings created</div>}
                </div>
              </div>
            )}

            {/* STEP 4 — Done */}
            {csvStep === "done" && (
              <div className="px-5 py-8 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-800 text-sm mb-1">Import Complete</div>
                  <div className="text-xs text-slate-400">Your existing timetable has been migrated to CampusSpace</div>
                </div>
                <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2">
                  {[
                    ["Rows processed", "8"],
                    ["Bookings created", "7"],
                    ["Conflicts skipped", "1"],
                    ["Source file", "timetable_even_2025.xlsx"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{k}</span>
                      <span className="text-xs font-semibold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-700">1 conflicting row was skipped. Review and resolve manually in the timetable grid.</span>
                </div>
                <button onClick={handleCSVDone} className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                  Go to Timetable <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">New Booking</h3>
                <div className="text-xs text-slate-400 mt-0.5">{modalForm.day} · {modalForm.slot}</div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Room</label>
                <select value={modalForm.roomId} onChange={(e) => setModalForm((p) => ({ ...p, roomId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400">
                  {ROOMS.map((r) => (<option key={r.id} value={r.id}>{r.full} (cap: {r.capacity})</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Day</label>
                  <select value={modalForm.day} onChange={(e) => setModalForm((p) => ({ ...p, day: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                    {DAYS.map((d) => (<option key={d}>{d}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Time Slot</label>
                  <select value={modalForm.slot} onChange={(e) => setModalForm((p) => ({ ...p, slot: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                    {TIME_SLOTS.map((s) => (<option key={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Course</label>
                <select value={modalForm.courseId} onChange={(e) => setModalForm((p) => ({ ...p, courseId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Select a course...</option>
                  {COURSES.map((c) => (<option key={c.id} value={c.id}>{c.id} — {c.name} ({c.students} stu.)</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Faculty</label>
                <select value={modalForm.facultyId} onChange={(e) => setModalForm((p) => ({ ...p, facultyId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
                  <option value="">Select faculty...</option>
                  {FACULTY.map((f) => (<option key={f.id} value={f.id}>{f.name} · {f.dept}</option>))}
                </select>
              </div>
              {capWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-700">{capWarning}</span>
                </div>
              )}
              {liveConflicts.map((c, i) => (
                <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-red-700"><strong>Conflict:</strong> {c.msg}</span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleBook} disabled={!canBook} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DETAIL MODAL ═══ */}
      {detailBooking && (() => {
        const b = detailBooking;
        const course = COURSES.find((c) => c.id === b.courseId);
        const room = ROOMS.find((r) => r.id === b.roomId);
        const faculty = FACULTY.find((f) => f.id === b.facultyId);
        const s = TYPE_STYLES[room?.type || "lecture"];
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-6 rounded-full ${s.dot}`} />
                  <h3 className="font-bold text-slate-900 text-sm">Booking Details</h3>
                </div>
                <button onClick={() => setDetailBooking(null)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className={`rounded-xl p-3.5 border ${s.bg} ${s.border}`}>
                  <div className={`text-base font-bold ${s.text}`}>{course?.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{course?.id} · {course?.dept} Dept.</div>
                </div>
                {[
                  ["Faculty", faculty?.name],
                  ["Room", room?.full],
                  ["Building", `${room?.building} · Floor ${room?.floor}`],
                  ["Day & Time", `${b.day} · ${b.slot}`],
                  ["Enrolled / Capacity", `${course?.students} / ${room?.capacity}`],
                  ["Facilities", room?.facilities.join(", ")],
                  ["Accessibility", room?.accessible ? "✓ Ramp / lift accessible" : "⚠ No ramp or lift"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start">
                    <span className="text-xs text-slate-400">{k}</span>
                    <span className="text-xs text-slate-700 font-medium text-right max-w-52">{v}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => setDetailBooking(null)} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-600 hover:bg-slate-50">Close</button>
                <button onClick={() => handleDelete(b.id)} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600">Remove Booking</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
