const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'demo-excel');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// ── Email generation ──────────────────────────────────────────────────────────
const VN_MAP = {
  à:'a',á:'a',ả:'a',ã:'a',ạ:'a',ă:'a',ắ:'a',ặ:'a',ằ:'a',ẵ:'a',ẳ:'a',
  â:'a',ấ:'a',ầ:'a',ẩ:'a',ẫ:'a',ậ:'a',è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',
  ê:'e',ế:'e',ề:'e',ể:'e',ễ:'e',ệ:'e',ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
  ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',ô:'o',ố:'o',ồ:'o',ổ:'o',ỗ:'o',ộ:'o',
  ơ:'o',ớ:'o',ờ:'o',ở:'o',ỡ:'o',ợ:'o',ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',
  ư:'u',ứ:'u',ừ:'u',ử:'u',ữ:'u',ự:'u',ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',đ:'d',
};
const nvn = (s = '') => s.toLowerCase().split('').map((c) => VN_MAP[c] || c).join('').replace(/[^a-z0-9]/g, '');

function teacherEmail(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const last = nvn(parts[parts.length - 1]);
  const init = parts.slice(0, parts.length - 1).map((p) => nvn(p)[0] || '').join('');
  return `${last}${init}gv@gmail.com`;
}

function studentEmail(name, dob) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const last = parts.length ? nvn(parts[parts.length - 1]) : 'hs';
  const init = parts.slice(0, parts.length - 1).map((p) => nvn(p)[0] || '').join('');
  const dp = dob.split('/');
  const suf = dp.length === 3 ? `${dp[0].padStart(2,'0')}${dp[1].padStart(2,'0')}${dp[2].slice(-2)}` : '';
  return `${last}${init}${suf}@gmail.com`;
}

// ── Giáo viên (3 người) ───────────────────────────────────────────────────────
const TEACHER_NAMES = ['Nguyễn Thị Lan', 'Trần Văn Minh', 'Lê Thị Hoa'];
{
  const rows = [
    ['Họ và tên', 'Môn dạy', 'Email', 'Mật khẩu'],
    ...TEACHER_NAMES.map((n) => [n, 'Tiếng Anh', teacherEmail(n), '12345678a']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 28 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'GiaoVien');
  XLSX.writeFile(wb, path.join(outDir, 'giao_vien_demo_1.xlsx'));
  console.log('Created: giao_vien_demo_1.xlsx');
}

// ── Học sinh (5 lớp x 5 hs) ──────────────────────────────────────────────────
const classData = {
  '1A': [
    ['Nguyễn Văn An',   '05/03/2019'],
    ['Trần Thị Bảo',    '12/07/2019'],
    ['Lê Hoàng Chiến',  '20/01/2019'],
    ['Phạm Thị Diệu',   '08/09/2019'],
    ['Hoàng Văn Em',    '15/11/2019'],
  ],
  '2A': [
    ['Nguyễn Thị Lan',  '07/01/2018'],
    ['Trần Văn Minh',   '14/05/2018'],
    ['Lê Thị Ngọc',     '22/10/2018'],
    ['Phạm Văn Ổn',     '03/03/2018'],
    ['Hoàng Thị Phúc',  '19/07/2018'],
  ],
  '3A': [
    ['Nguyễn Văn Vinh', '09/02/2017'],
    ['Trần Thị Xuân',   '17/08/2017'],
    ['Lê Văn Yên',      '26/05/2017'],
    ['Phạm Thị Zung',   '13/01/2017'],
    ['Hoàng Văn Ân',    '05/10/2017'],
  ],
  '4A': [
    ['Nguyễn Văn Hải',  '01/04/2016'],
    ['Trần Thị Inh',    '20/08/2016'],
    ['Lê Văn Khải',     '15/02/2016'],
    ['Phạm Thị Linh',   '08/06/2016'],
    ['Hoàng Văn Mạnh',  '27/10/2016'],
  ],
  '5A': [
    ['Nguyễn Văn Sáng', '06/02/2015'],
    ['Trần Thị Thơm',   '19/06/2015'],
    ['Lê Văn Ước',      '28/10/2015'],
    ['Phạm Thị Vân',    '10/04/2015'],
    ['Hoàng Văn Xuân',  '23/08/2015'],
  ],
};

for (const [className, students] of Object.entries(classData)) {
  const rows = [
    ['Họ và tên', 'Ngày sinh (dd/mm/yyyy)', 'Email', 'Mật khẩu'],
    ...students.map(([name, dob]) => [name, dob, studentEmail(name, dob), '12345678a']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 28 }, { wch: 24 }, { wch: 30 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Lop_${className}`);
  XLSX.writeFile(wb, path.join(outDir, `hoc_sinh_${className}.xlsx`));
  console.log(`Created: hoc_sinh_${className}.xlsx`);
}

console.log('\nDone! All files saved to ./demo-excel/');