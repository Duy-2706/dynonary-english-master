import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssessmentIcon from '@material-ui/icons/Assessment';
import EditIcon from '@material-ui/icons/Edit';
import GetAppIcon from '@material-ui/icons/GetApp';
import GradeIcon from '@material-ui/icons/Grade';
import PeopleIcon from '@material-ui/icons/People';
import SaveIcon from '@material-ui/icons/Save';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import classroomApi from 'apis/classroomApi';

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box pt={3}>{children}</Box>}
    </div>
  );
}

// ─── Tab 1: Students ─────────────────────────────────────────────────────────

function StudentsTab({ classroom }) {
  const students = classroom?.students || [];

  if (students.length === 0) {
    return (
      <Box textAlign="center" py={6} color="text.secondary">
        <PeopleIcon style={{ fontSize: 64, opacity: 0.3 }} />
        <Typography style={{ marginTop: 12 }}>
          Chưa có học viên nào trong lớp.
        </Typography>
        <Typography variant="body2" style={{ marginTop: 8 }}>
          Chia sẻ mã lớp <b>{classroom?.classCode}</b> để học viên tham gia.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} style={{ borderRadius: 12 }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>#</TableCell>
            <TableCell>Họ tên</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Ngày tham gia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((s, idx) => (
            <TableRow key={s.accountId} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" style={{ gap: 10 }}>
                  <Avatar style={{ width: 32, height: 32, fontSize: 14 }}>
                    {(s.name || s.username || '?')[0].toUpperCase()}
                  </Avatar>
                  {s.name || s.username}
                </Box>
              </TableCell>
              <TableCell>{s.username}</TableCell>
              <TableCell>
                {s.joinedAt
                  ? new Date(
                      s.joinedAt?.toDate ? s.joinedAt.toDate() : s.joinedAt,
                    ).toLocaleDateString('vi-VN')
                  : '–'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Tab 2: Activity ─────────────────────────────────────────────────────────

function ActivityTab({ classroomId }) {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classroomApi
      .getActivity(classroomId)
      .then((res) => {
        if (res.status === 200) setActivity(res.data.activity || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classroomId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (activity.length === 0) {
    return (
      <Box textAlign="center" py={6} color="text.secondary">
        <AssessmentIcon style={{ fontSize: 64, opacity: 0.3 }} />
        <Typography style={{ marginTop: 12 }}>
          Chưa có dữ liệu hoạt động.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} style={{ borderRadius: 12 }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>#</TableCell>
            <TableCell>Học viên</TableCell>
            <TableCell>Bài đã nộp</TableCell>
            <TableCell>Tổng điểm</TableCell>
            <TableCell>Hoạt động gần nhất</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activity.map((s, idx) => (
            <TableRow key={s.accountId} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" style={{ gap: 10 }}>
                  <Avatar style={{ width: 32, height: 32, fontSize: 14 }}>
                    {(s.name || s.username || '?')[0].toUpperCase()}
                  </Avatar>
                  <div>
                    <Typography
                      variant="body2"
                      style={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {s.name || s.username}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {s.username}
                    </Typography>
                  </div>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={`${s.submissionCount} bài`}
                  size="small"
                  color={s.submissionCount > 0 ? 'primary' : 'default'}
                />
              </TableCell>
              <TableCell>
                {s.totalMaxScore > 0
                  ? `${s.totalScore} / ${s.totalMaxScore}`
                  : '–'}
              </TableCell>
              <TableCell>
                {s.lastActive
                  ? new Date(s.lastActive).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Chưa hoạt động'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ─── Tab 3: Weekly Grading ───────────────────────────────────────────────────

function WeeklyGradingTab({ classroomId }) {
  const now = new Date();
  const [weekNumber, setWeekNumber] = useState(getWeekNumber(now));
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [evalForm, setEvalForm] = useState({
    teacherScore: '',
    teacherComment: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchReport = useCallback(() => {
    setLoading(true);
    classroomApi
      .getWeeklyReport(classroomId, weekNumber, year)
      .then((res) => {
        if (res.status === 200) setReport(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classroomId, weekNumber, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleOpenEval = (student) => {
    setEditingStudent(student);
    setEvalForm({
      teacherScore: student.evaluation?.teacherScore ?? '',
      teacherComment: student.evaluation?.teacherComment ?? '',
    });
  };

  const handleSaveEval = async () => {
    setSaving(true);
    try {
      await classroomApi.upsertWeeklyEvaluation(classroomId, {
        studentAccountId: editingStudent.accountId,
        studentName: editingStudent.name || editingStudent.username,
        weekNumber,
        year,
        teacherScore: evalForm.teacherScore,
        teacherComment: evalForm.teacherComment,
      });
      setEditingStudent(null);
      fetchReport();
    } catch (e) {}
    setSaving(false);
  };

  const handleExportExcel = async () => {
    if (!report) return;
    const xlsx = await import('xlsx');
    const assignments = report.assignments || [];
    const headerRow = [
      '#',
      'Họ tên',
      'Username',
      ...assignments.map((a) => a.assignmentTitle || a.title || 'Bài tập'),
      'Tổng điểm',
      'Điểm GV',
      'Nhận xét GV',
    ];
    const dataRows = (report.report || []).map((s, idx) => [
      idx + 1,
      s.name || s.username,
      s.username,
      ...assignments.map((a) => {
        const sa = s.assignments?.find((x) => x.assignmentId === a._id);
        return sa?.submitted ? `${sa.score ?? 0}/${sa.maxScore ?? 0}` : 'Chưa nộp';
      }),
      s.totalMaxScore > 0 ? `${s.totalScore}/${s.totalMaxScore}` : '–',
      s.evaluation?.teacherScore ?? '–',
      s.evaluation?.teacherComment ?? '',
    ]);
    const ws = xlsx.utils.aoa_to_sheet([headerRow, ...dataRows]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, `Tuần ${weekNumber}`);
    xlsx.writeFile(wb, `BaoCao_Tuan${weekNumber}_${year}.xlsx`);
  };

  const weeks = Array.from({ length: 53 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026, 2027];

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        style={{ gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <FormControl variant="outlined" size="small" style={{ minWidth: 140 }}>
          <InputLabel>Tuần</InputLabel>
          <Select
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            label="Tuần">
            {weeks.map((w) => (
              <MenuItem key={w} value={w}>
                Tuần {w}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Năm">
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<GetAppIcon />}
          onClick={handleExportExcel}
          disabled={!report || loading}>
          Xuất Excel
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : !report || report.report?.length === 0 ? (
        <Box textAlign="center" py={6} color="text.secondary">
          <GradeIcon style={{ fontSize: 64, opacity: 0.3 }} />
          <Typography style={{ marginTop: 12 }}>
            Không có dữ liệu cho tuần này.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          style={{ borderRadius: 12, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>#</TableCell>
                <TableCell>Học viên</TableCell>
                {(report.assignments || []).map((a, i) => (
                  <TableCell
                    key={i}
                    align="center"
                    style={{ whiteSpace: 'nowrap' }}>
                    {a.assignmentTitle || a.title || `Bài ${i + 1}`}
                  </TableCell>
                ))}
                <TableCell align="center">Tổng</TableCell>
                <TableCell align="center">Điểm GV</TableCell>
                <TableCell>Nhận xét</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.report.map((s, idx) => (
                <TableRow key={s.accountId} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      style={{ gap: 8 }}>
                      <Avatar style={{ width: 28, height: 28, fontSize: 12 }}>
                        {(s.name || s.username || '?')[0].toUpperCase()}
                      </Avatar>
                      {s.name || s.username}
                    </Box>
                  </TableCell>
                  {(s.assignments || []).map((a, i) => (
                    <TableCell key={i} align="center">
                      {a.submitted ? (
                        <Chip
                          label={`${a.score ?? 0}/${a.maxScore ?? 0}`}
                          size="small"
                          style={{
                            backgroundColor: '#e8f5e9',
                            color: '#2e7d32',
                          }}
                        />
                      ) : (
                        <Chip
                          label="Chưa nộp"
                          size="small"
                          style={{ backgroundColor: '#fafafa', color: '#999' }}
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    {s.totalMaxScore > 0
                      ? `${s.totalScore}/${s.totalMaxScore}`
                      : '–'}
                  </TableCell>
                  <TableCell align="center">
                    {s.evaluation?.teacherScore != null ? (
                      <Chip
                        label={s.evaluation.teacherScore}
                        size="small"
                        color="primary"
                      />
                    ) : (
                      '–'
                    )}
                  </TableCell>
                  <TableCell style={{ maxWidth: 160 }}>
                    <Typography
                      variant="caption"
                      style={{ color: '#555' }}
                      noWrap>
                      {s.evaluation?.teacherComment || '–'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chấm điểm & nhận xét">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEval(s)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          Đánh giá: {editingStudent?.name || editingStudent?.username}
          <Typography variant="body2" color="textSecondary">
            Tuần {weekNumber} / {year}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box style={{ marginTop: 8 }}>
            <TextField
              label="Điểm (0–10)"
              type="number"
              variant="outlined"
              fullWidth
              inputProps={{ min: 0, max: 10, step: 0.5 }}
              value={evalForm.teacherScore}
              onChange={(e) =>
                setEvalForm((f) => ({ ...f, teacherScore: e.target.value }))
              }
              style={{ marginBottom: 16 }}
            />
            <TextField
              label="Nhận xét"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={evalForm.teacherComment}
              onChange={(e) =>
                setEvalForm((f) => ({
                  ...f,
                  teacherComment: e.target.value,
                }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingStudent(null)} disabled={saving}>
            Hủy
          </Button>
          <Button
            variant="contained"
            className="_btn _btn-primary"
            startIcon={
              saving ? <CircularProgress size={16} /> : <SaveIcon />
            }
            onClick={handleSaveEval}
            disabled={saving}>
            Lưu đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ClassroomDetailPage() {
  const { id } = useParams();
  const history = useHistory();
  const [tab, setTab] = useState(0);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classroomApi
      .getClassroomById(id)
      .then((res) => {
        if (res.status === 200) setClassroom(res.data.classroom);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!classroom) {
    return (
      <Box textAlign="center" py={10}>
        <Typography>
          Không tìm thấy lớp học hoặc bạn không có quyền truy cập.
        </Typography>
        <Button
          style={{ marginTop: 16 }}
          onClick={() => history.push('/classrooms')}>
          Quay lại danh sách lớp
        </Button>
      </Box>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <Box
        display="flex"
        alignItems="flex-start"
        style={{ gap: 12, marginBottom: 24 }}>
        <IconButton
          onClick={() => history.push('/classrooms')}
          size="small"
          style={{ marginTop: 4 }}>
          <ArrowBackIcon />
        </IconButton>
        <div>
          <Typography variant="h5" style={{ fontWeight: 700 }}>
            {classroom.name}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <Chip label={classroom.level} size="small" color="primary" />
            <Chip
              label={classroom.status === 'active' ? 'Đang mở' : 'Tạm đóng'}
              size="small"
              style={{
                backgroundColor:
                  classroom.status === 'active' ? '#e8f5e9' : '#fafafa',
                color: classroom.status === 'active' ? '#2e7d32' : '#757575',
              }}
            />
            <Typography variant="body2" color="textSecondary">
              Mã lớp: <b>{classroom.classCode}</b>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              · {classroom.students?.length || 0} học viên
            </Typography>
          </Box>
        </div>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        style={{ borderBottom: '1px solid #e0e0e0' }}>
        <Tab icon={<PeopleIcon />} label="Học sinh" />
        <Tab icon={<AssessmentIcon />} label="Hoạt động" />
        <Tab icon={<GradeIcon />} label="Chấm điểm tuần" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <StudentsTab classroom={classroom} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ActivityTab classroomId={id} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <WeeklyGradingTab classroomId={id} />
      </TabPanel>
    </div>
  );
}

export default ClassroomDetailPage;
