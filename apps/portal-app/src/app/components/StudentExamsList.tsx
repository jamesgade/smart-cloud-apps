import React from 'react';
import { useApiUrl } from '@refinedev/core';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Link, 
  Grid, 
  Divider,
  Stack,
  Paper,
} from '@mui/material';
import { 
  CalendarToday, 
  School, 
  Computer, 
  AttachMoney, 
  Description, 
  CheckCircle,
  Language,
  Subject,
  Business,
} from '@mui/icons-material';

type PublicExam = {
  examId: string;
  name: string;
  category: string;
  description?: string;
  examDate?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
  registrationUrl?: string;
  officialWebsite?: string;
  eligibility?: string;
  examMode?: string;
  examLevel?: string;
  subjects?: string[];
  applicationFee?: number | string;
  conductingBody?: string;
};

const StudentExamsList: React.FC = () => {
  const apiUrl = useApiUrl();
  const [rows, setRows] = React.useState<PublicExam[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<PublicExam | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiUrl}/public/exams`);
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError('Failed to load exams');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDateWindow = (e: PublicExam) => {
    if (e.examDate) return e.examDate;
    if (e.startDate && e.endDate) return `${e.startDate} - ${e.endDate}`;
    if (e.startDate) return e.startDate;
    return '—';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>Exams</Typography>
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>
          ) : error ? (
            <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>
          ) : rows.length === 0 ? (
            <Box sx={{ p: 3 }}><Typography color="text.secondary">No exams available.</Typography></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Date/Window</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((e) => (
                    <TableRow key={e.examId} hover>
                      <TableCell>{e.name}</TableCell>
                      <TableCell><Chip label={e.category} size="small" /></TableCell>
                      <TableCell>{e.examLevel || '—'}</TableCell>
                      <TableCell>{e.examMode || '—'}</TableCell>
                      <TableCell>{formatDateWindow(e)}</TableCell>
                      <TableCell>
                        {(() => {
                          const v = (e.applicationFee as any);
                          const n = v === '' || v === null || v === undefined ? NaN : Number(v);
                          return isNaN(n) ? '—' : `₹${n}`;
                        })()}
                      </TableCell>
                      <TableCell>
                        <Chip label={(e.status || 'UPCOMING').toUpperCase()} size="small" color={(e.status || 'UPCOMING') === 'CURRENT' ? 'warning' : (e.status || 'UPCOMING') === 'UPCOMING' ? 'info' : 'default'} />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" onClick={() => setSelected(e)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
            Exam Details
          </Typography>
          {selected && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={selected.category} 
                size="small" 
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 500,
                }} 
              />
              {selected.examLevel && (
                <Chip 
                  label={selected.examLevel} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#f3e5f5',
                    color: '#7b1fa2',
                    fontWeight: 500,
                  }} 
                />
              )}
              {selected.examMode && (
                <Chip 
                  label={selected.examMode} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#fff3e0',
                    color: '#e65100',
                    fontWeight: 500,
                  }} 
                />
              )}
              <Chip 
                label={(selected.status || 'UPCOMING').toUpperCase()} 
                color={
                  (selected.status || 'UPCOMING') === 'CURRENT' ? 'warning' : 
                  (selected.status || 'UPCOMING') === 'UPCOMING' ? 'info' : 
                  'default'
                } 
                size="small" 
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {selected && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#333', fontSize: '1.5rem' }}>
                {selected.name}
              </Typography>

              {/* Key Information Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Exam Date/Window
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
                      {formatDateWindow(selected)}
                    </Typography>
                    {selected.examDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Single Date
                      </Typography>
                    )}
                    {selected.startDate && selected.endDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Date Range: {selected.startDate} to {selected.endDate}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Application Window
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
                      {selected.applicationStartDate 
                        ? `${selected.applicationStartDate}${selected.applicationEndDate ? ` - ${selected.applicationEndDate}` : ''}` 
                        : '—'}
                    </Typography>
                    {selected.applicationStartDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {selected.applicationEndDate ? 'Start to End' : 'Start Date Only'}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Application Fee
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
                      {(() => { 
                        const v: any = selected.applicationFee; 
                        const n = v === '' || v == null ? NaN : Number(v); 
                        return isNaN(n) ? '—' : `₹${n.toLocaleString('en-IN')}`; 
                      })()}
                    </Typography>
                  </Paper>
                </Grid>
                {selected.conductingBody && (
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Business sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Conducting Body
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#333' }}>
                        {selected.conductingBody}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Additional Details Section */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                Additional Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {selected.examDate && (
                  <Grid item xs={12} sm={6}>
                    <Detail label="Exam Date" value={selected.examDate} />
                  </Grid>
                )}
                {selected.startDate && (
                  <Grid item xs={12} sm={6}>
                    <Detail label="Start Date" value={selected.startDate} />
                  </Grid>
                )}
                {selected.endDate && (
                  <Grid item xs={12} sm={6}>
                    <Detail label="End Date" value={selected.endDate} />
                  </Grid>
                )}
                {selected.applicationStartDate && (
                  <Grid item xs={12} sm={6}>
                    <Detail label="Application Start Date" value={selected.applicationStartDate} />
                  </Grid>
                )}
                {selected.applicationEndDate && (
                  <Grid item xs={12} sm={6}>
                    <Detail label="Application End Date" value={selected.applicationEndDate} />
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Description */}
              {selected.description && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Description sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {selected.description}
                  </Typography>
                </Box>
              )}

              {/* Eligibility */}
              {selected.eligibility && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                      Eligibility
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {selected.eligibility}
                  </Typography>
                </Box>
              )}

              {/* Subjects */}
              {Array.isArray(selected.subjects) && selected.subjects.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Subject sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                      Subjects
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selected.subjects.map((subject, index) => (
                      <Chip 
                        key={index}
                        label={subject} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#f5f5f5',
                          color: '#333',
                        }} 
                      />
                    ))}
                  </Box>
              </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Links */}
              <Grid container spacing={2}>
                {selected.registrationUrl && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Language sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                        Registration URL
                      </Typography>
                    </Box>
                    <Link 
                      href={selected.registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{
                        color: '#ff6b35',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                        wordBreak: 'break-all',
                      }}
                    >
                      {selected.registrationUrl}
                    </Link>
                  </Grid>
                )}
                {selected.officialWebsite && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Language sx={{ fontSize: 20, color: '#ff6b35', mr: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                        Official Website
                      </Typography>
                    </Box>
                    <Link 
                      href={selected.officialWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{
                        color: '#ff6b35',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                        wordBreak: 'break-all',
                      }}
                    >
                      {selected.officialWebsite}
                    </Link>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setSelected(null)}
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Close
          </Button>
          {selected?.registrationUrl && (
            <Button 
              variant="contained"
              href={selected.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#ff6b35',
                '&:hover': {
                  backgroundColor: '#e55a2b',
                },
              }}
            >
              Register Now
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const Detail: React.FC<{ label: string; value?: string; multiline?: boolean }> = ({ label, value, multiline }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2" sx={{ whiteSpace: multiline ? 'pre-wrap' : 'normal' }}>{value || '—'}</Typography>
  </Box>
);

const DetailLink: React.FC<{ label: string; href?: string | null }> = ({ label, href }) => (
  <Detail label={label} value={href ? undefined : '—'}>
    {href ? <Link href={href} target="_blank" rel="noopener noreferrer">{href}</Link> : null}
  </Detail>
);

export default StudentExamsList;


