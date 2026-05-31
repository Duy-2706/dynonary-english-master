'use strict';
// draw.io XML generator for Dynonary - Black & White style

const HEADER_H = 30;
const FIELD_H = 22;
const CLASS_W = 245;
const COL_GAP = 90;      // Khoảng cách ngang
const ROW_GAP = 50;      // Khoảng cách dọc
const START_X = 40;
const START_Y = 80;

const classMap = {};
let idCounter = 2;

function nextId() { return `n${idCounter++}`; }

// Columns of classes (giữ nguyên như cũ)
const columns = [
  // Col 0 – AUTH
  [
    { id:'Account', lbl:'Account', ste:'Document',
      flds:['- email: String','- password: String (hashed)','- authType: "local"|"gg"|"fb"','- createdDate: Date'] },
    { id:'User', lbl:'User', ste:'Document',
      flds:['- accountId: → Account','- name: String','- username: String (unique)','- avt: String (URL)','- coin: Number = 100','- favoriteList: String[]','- role: student|teacher|admin'] },
    { id:'VerifyCode', lbl:'VerifyCode', ste:'Document',
      flds:['- code: String (6 chars)','- email: String','- createdDate: Date (TTL 10m)'] },
  ],
  // Col 1 – CONTENT
  [
    { id:'Word', lbl:'Word', ste:'Document',
      flds:['- word: String','- mean: String','- type: n|v|adj|adv|...','- level: A1|A2|B1|B2|C1|C2','- phonetic: String','- picture: String (URL)','- audioUrl: String (TTS)','- topics: String[]','- synonyms: String[]','- antonyms: String[]','- note: String','- isChecked: Boolean','- examples: Example[]'] },
    { id:'Example', lbl:'Example', ste:'Embedded',
      flds:['- word: String','- example: String','- mean: String','- phonetic: String','- picture: String'] },
    { id:'Sentence', lbl:'Sentence', ste:'Document',
      flds:['- sentence: String','- mean: String (Vietnamese)','- note: String (grammar)','- topics: String[]','- level: String','- audioUrl: String (TTS)','- videoUrl: String (YouTube)','- isChecked: Boolean'] },
  ],
  // Col 2 – GAME + BLOG
  [
    { id:'HighScore', lbl:'HighScore', ste:'Document',
      flds:['- name: String (game key)','- top: HighScoreEntry[]'] },
    { id:'HighScoreEntry', lbl:'HighScoreEntry', ste:'Embedded',
      flds:['- accountId: → Account','- score: Number'] },
    { id:'Blog', lbl:'Blog', ste:'Document',
      flds:['- title: String','- desc: String','- html: String'] },
  ],
  // Col 3 – COURSE
  [
    { id:'Course', lbl:'Course', ste:'Document',
      flds:['- title: String','- description: String','- thumbnail: String','- level: String','- teacherAccountId: → Account','- teacherName: String','- price: Number','- isFree: Boolean','- status: draft|published|archived','- totalStudents: Number','- totalChapters: Number','- totalLessons: Number','- createdAt: Date','- updatedAt: Date'] },
    { id:'Chapter', lbl:'Chapter', ste:'Document',
      flds:['- courseId: → Course','- title: String','- description: String','- order: Number','- isFree: Boolean','- totalLessons: Number','- createdAt: Date','- updatedAt: Date'] },
  ],
  // Col 4 – LESSON
  [
    { id:'Lesson', lbl:'Lesson', ste:'Document',
      flds:['- courseId: → Course','- chapterId: → Chapter','- title: String','- order: Number','- type: video|flashcard|quiz|fill_blank|mixed','- videoUrl: String','- content: String (HTML)','- materials: Material[]','- words: LessonWord[]','- questions: LessonQuestion[]','- fillBlanks: FillBlank[]','- hasExercise: Boolean','- isFree: Boolean','- timeLimit: Number (min)','- createdAt: Date'] },
    { id:'Material', lbl:'Material', ste:'Embedded',
      flds:['- title: String','- content: String','- fileUrl: String'] },
    { id:'Enrollment', lbl:'Enrollment', ste:'Document',
      flds:['- courseId: → Course','- studentAccountId: → Account','- studentName: String','- status: pending|active|completed|cancelled','- paymentStatus: pending|paid|free|refunded','- paidAmount: Number','- progressPercent: Number','- completedLessons: Number','- totalLessons: Number','- enrolledAt: Date','- completedAt: Date'] },
  ],
  // Col 5 – LESSON CONTENT
  [
    { id:'LessonWord', lbl:'LessonWord', ste:'Embedded',
      flds:['- word: String','- mean: String','- phonetic: String','- picture: String','- example: String'] },
    { id:'LessonQuestion', lbl:'LessonQuestion', ste:'Embedded',
      flds:['- question: String','- options: String[4]','- correctIndex: Number','- explanation: String'] },
    { id:'FillBlank', lbl:'FillBlank', ste:'Embedded',
      flds:['- sentence: String','- correctAnswer: String','- hint: String'] },
    { id:'LessonProgress', lbl:'LessonProgress', ste:'Document',
      flds:['- lessonId: → Lesson','- courseId: → Course','- studentAccountId: → Account','- status: not_started|in_progress|completed','- score: Number','- maxScore: Number','- correctCount: Number','- totalCount: Number','- knownWords: String[]','- unknownWords: String[]','- startedAt: Date','- completedAt: Date','- updatedAt: Date'] },
  ],
  // Col 6 – CLASSROOM
  [
    { id:'Classroom', lbl:'Classroom', ste:'Document',
      flds:['- teacherAccountId: → Account','- teacherUsername: String','- name: String','- description: String','- level: String','- classCode: String (unique)','- status: active|inactive','- students: ClassroomStudent[]','- createdAt: Date','- updatedAt: Date'] },
    { id:'ClassroomStudent', lbl:'ClassroomStudent', ste:'Embedded',
      flds:['- accountId: → Account','- username: String','- name: String','- joinedAt: Date'] },
  ],
  // Col 7 – REALTIME GAME
  [
    { id:'GameRoom', lbl:'GameRoom ★NEW', ste:'Document',
      flds:['- roomCode: String (unique)','- hostAccountId: → Account','- hostName: String','- classroomId: → Classroom (opt)','- status: waiting|started|question|reveal|finished','- currentQuestionIndex: Number','- totalQuestions: Number','- topicConfig: String[]','- levelConfig: String','- createdAt: Date','- startedAt: Date','- finishedAt: Date'] },
    { id:'GameParticipant', lbl:'GameParticipant ★NEW', ste:'Document',
      flds:['- roomCode: → GameRoom','- accountId: → Account','- name: String','- avt: String','- score: Number','- streak: Number','- rank: Number','- isOnline: Boolean','- joinedAt: Date'] },
    { id:'RealtimeQuestion', lbl:'RealtimeQuestion ★NEW', ste:'Document',
      flds:['- roomCode: → GameRoom','- index: Number','- wordId: → Word','- word: String','- mean: String','- phonetic: String','- picture: String','- options: String[4]','- correctIndex: Number','- timeLimit: Number (sec)','- startedAt: Date'] },
    { id:'RealtimeAnswer', lbl:'RealtimeAnswer ★NEW', ste:'Document',
      flds:['- roomCode: → GameRoom','- questionIndex: Number','- accountId: → Account','- selectedIndex: Number','- isCorrect: Boolean','- timeMs: Number','- pointsEarned: Number','- answeredAt: Date'] },
  ],
];

// Tính vị trí
const colXStart = [];
let cx = START_X;
columns.forEach(() => {
  colXStart.push(cx);
  cx += CLASS_W + COL_GAP;
});

columns.forEach((col, ci) => {
  let y = START_Y;
  col.forEach(cls => {
    const h = HEADER_H + cls.flds.length * FIELD_H + 20;
    cls._x = colXStart[ci];
    cls._y = y;
    cls._w = CLASS_W;
    cls._h = h;
    cls._cellId = nextId();
    classMap[cls.id] = cls;
    y += h + ROW_GAP;
  });
});

// Relationship tối ưu
const rels = [
  {s:'Account',t:'User',lbl:'1──1',sty:'assoc'},
  {s:'Word',t:'Example',lbl:'1──*',sty:'comp'},
  {s:'HighScore',t:'HighScoreEntry',lbl:'1──*',sty:'comp'},
  {s:'Account',t:'HighScoreEntry',lbl:'earns',sty:'assoc'},
  {s:'Account',t:'Course',lbl:'teacher',sty:'assoc'},
  {s:'Course',t:'Chapter',lbl:'1──*',sty:'comp'},
  {s:'Chapter',t:'Lesson',lbl:'1──*',sty:'comp'},
  {s:'Lesson',t:'Material',lbl:'1──*',sty:'comp'},
  {s:'Lesson',t:'LessonWord',lbl:'1──*',sty:'comp'},
  {s:'Lesson',t:'LessonQuestion',lbl:'1──*',sty:'comp'},
  {s:'Lesson',t:'FillBlank',lbl:'1──*',sty:'comp'},
  {s:'Course',t:'Enrollment',lbl:'1──*',sty:'assoc'},
  {s:'Account',t:'Enrollment',lbl:'student',sty:'assoc'},
  {s:'Lesson',t:'LessonProgress',lbl:'1──*',sty:'assoc'},
  {s:'Account',t:'LessonProgress',lbl:'student',sty:'assoc'},
  {s:'Account',t:'Classroom',lbl:'teacher',sty:'assoc'},
  {s:'Classroom',t:'ClassroomStudent',lbl:'1──*',sty:'comp'},
  {s:'Account',t:'GameRoom',lbl:'host',sty:'assoc'},
  {s:'Classroom',t:'GameRoom',lbl:'hosts',sty:'assoc'},
  {s:'GameRoom',t:'GameParticipant',lbl:'1──*',sty:'comp'},
  {s:'GameRoom',t:'RealtimeQuestion',lbl:'1──*',sty:'comp'},
  {s:'RealtimeQuestion',t:'RealtimeAnswer',lbl:'1──*',sty:'comp'},
  {s:'Account',t:'GameParticipant',lbl:'joins',sty:'assoc'},
  {s:'Word',t:'RealtimeQuestion',lbl:'source',sty:'dep'},
];

function escapeXml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function classCell(cls) {
  const lines = [];
  // Container - khung đen trắng
  lines.push(`    <mxCell id="${cls._cellId}" value="&lt;&lt;${cls.ste}&gt;&gt; ${cls.lbl}" style="swimlane;fontStyle=1;align=center;startSize=${HEADER_H};fillColor=#ffffff;strokeColor=#000000;fontSize=11;" vertex="1" parent="1">`);
  lines.push(`      <mxGeometry x="${cls._x}" y="${cls._y}" width="${cls._w}" height="${cls._h}" as="geometry" />`);
  lines.push(`    </mxCell>`);
  
  // Fields
  cls.flds.forEach((f, i) => {
    const fid = nextId();
    lines.push(`    <mxCell id="${fid}" value="${escapeXml(f)}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;rotatable=0;" vertex="1" parent="${cls._cellId}">`);
    lines.push(`      <mxGeometry y="${HEADER_H + i*FIELD_H}" width="${cls._w}" height="${FIELD_H}" as="geometry" />`);
    lines.push(`    </mxCell>`);
  });
  return lines.join('\n');
}

function relCell(r) {
  const src = classMap[r.s];
  const tgt = classMap[r.t];
  if (!src || !tgt) return '';
  
  const rid = nextId();
  let style = 'endArrow=open;endFill=0;fontSize=9;edgeStyle=orthogonalEdgeStyle;';
  
  if (r.sty === 'comp') {
    style = 'endArrow=ERone;startArrow=ERmandOne;endFill=0;startFill=0;fontSize=9;edgeStyle=orthogonalEdgeStyle;';
  } else if (r.sty === 'dep') {
    style = 'endArrow=open;dashed=1;fontSize=9;edgeStyle=orthogonalEdgeStyle;';
  }

  return `    <mxCell id="${rid}" value="${escapeXml(r.lbl)}" style="${style}" edge="1" source="${src._cellId}" target="${tgt._cellId}" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>`;
}

// Generate XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxGraphModel dx="2800" dy="1600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="3200" pageHeight="2000" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />
    
    <mxCell id="title" value="Dynonary — Class &amp; ERD Diagram (Firestore)&#xa;★ = New realtime game collections  |  Embedded = stored inside parent document" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=15;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="40" y="-40" width="2800" height="70" as="geometry" />
    </mxCell>
`;

columns.forEach(col => col.forEach(cls => {
  xml += classCell(cls) + '\n';
}));

rels.forEach(r => {
  const line = relCell(r);
  if (line) xml += line + '\n';
});

xml += `  </root>
</mxGraphModel>`;

require('fs').writeFileSync('./dynonary_diagram_bw_v2.drawio', xml);
console.log('✅ Đã generate ./dynonary_diagram_bw.drawio');
console.log(`Total cells: ${idCounter - 2}`);