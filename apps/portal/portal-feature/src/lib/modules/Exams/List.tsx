import React from 'react';
import { useTable, useCreate, useUpdate, useDelete, usePermissions, useGetIdentity } from '@refinedev/core';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Switch, FormControlLabel, Autocomplete, Snackbar, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import CreateOrEditExamModal from './Create';

type Exam = {
  examId: string;
  name: string;
  category: string;
  description?: string;
  examDate?: string;
  startDate?: string;
  endDate?: string;
  status: 'UPCOMING' | 'CURRENT' | 'COMPLETED';
  isActive: boolean;
  // New fields
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

const categories = ['Engineering', 'Medical', 'Management', 'Law', 'Science', 'Arts', 'Pharmacy', 'Architecture'];
const statuses = ['UPCOMING', 'CURRENT', 'COMPLETED'];
const levels = ['NATIONAL', 'STATE', 'INSTITUTE'];
const modes = ['ONLINE', 'OFFLINE', 'HYBRID'];

// Removed old inline ExamForm in favor of CreateOrEditExamModal

const ExamsList: React.FC = () => {
  const { data: permissions } = usePermissions({});
  const { data: user } = useGetIdentity();
  const { mutate: createOne } = useCreate();
  const { mutate: updateOne } = useUpdate();
  const { mutate: deleteOne } = useDelete();

  const canManage = React.useMemo(() => {
    const has = (perm: string) => permissions?.data?.some((p: any) => p.actionName === perm);
    const role = (user?.roleName || user?.userTypeName || '').toLowerCase();
    return has('EXAMS_MANAGEMENT_MENU') || ['admin','manager','counsellor','senior counsellor'].some(r => role.includes(r));
  }, [permissions, user]);

  const { tableQuery } = useTable<Exam>({ resource: 'exams', syncWithLocation: false, pagination: { mode: 'server' } });
  const rows = Array.isArray(tableQuery.data?.data?.data) ? tableQuery.data.data.data : [];
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Exam | undefined>(undefined);

  const handleSave = (values: Partial<Exam>) => {
    return new Promise<void>((resolve, reject) => {
      if (editing?.examId) {
        updateOne(
          { resource: 'exams', id: editing.examId, values },
          {
            onSuccess: () => { setFormOpen(false); tableQuery.refetch?.(); resolve(); },
            onError: (e) => reject(e),
          }
        );
      } else {
        createOne(
          { resource: 'exams', values },
          {
            onSuccess: () => { setFormOpen(false); tableQuery.refetch?.(); resolve(); },
            onError: (e) => reject(e),
          }
        );
      }
    });
  };

  const handleDelete = (row: Exam) => {
    deleteOne(
      { resource: 'exams', id: row.examId, mutationMode: 'pessimistic' },
      { onSuccess: () => tableQuery.refetch?.() }
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Exams Management</Typography>
        {canManage && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(undefined); setFormOpen(true); }}>Add Exam</Button>
        )}
      </Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table stickyHeader size="small" sx={{ '& tbody tr:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Date/Window</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Active</TableCell>
                  {canManage && <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((e: Exam) => (
                  <TableRow key={e.examId} hover>
                    <TableCell>{e.name}</TableCell>
                    <TableCell><Chip label={e.category} size="small" /></TableCell>
                    <TableCell>{e.examLevel || '—'}</TableCell>
                    <TableCell>{e.examMode || '—'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        {e.examDate || (e.startDate ? `${e.startDate}${e.endDate ? ` - ${e.endDate}` : ''}` : '—')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const v = (e.applicationFee as any);
                        const n = v === '' || v === null || v === undefined ? NaN : Number(v);
                        return isNaN(n) ? '—' : `₹${n}`;
                      })()}
                    </TableCell>
                    <TableCell>
                      <Chip label={e.status} size="small" color={e.status === 'CURRENT' ? 'warning' : e.status === 'UPCOMING' ? 'info' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Chip label={e.isActive ? 'Active' : 'Inactive'} size="small" color={e.isActive ? 'success' : 'default'} variant="outlined" />
                    </TableCell>
                    {canManage && (
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
                          <IconButton size="small" onClick={() => { setEditing(e); setFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(e)}><DeleteIcon fontSize="small" /></IconButton>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <CreateOrEditExamModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(undefined); }}
        onSuccess={() => tableQuery.refetch?.()}
        initial={editing}
      />
    </Box>
  );
};

export default ExamsList;


