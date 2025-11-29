import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Chip, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

interface Props {
  open: boolean;
  onClose: () => void;
  profile: any;
  student: any;
  apiUrl: string;
  onSaved: (p:any) => void;
}

const StudentProfileModal: React.FC<Props> = ({ open, onClose, profile, student, apiUrl, onSaved }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      tenthMarksPercent: profile?.tenthMarksPercent || '',
      interStream: profile?.interStream || '',
      interFirstYearPercent: profile?.interFirstYearPercent || '',
      interSecondYearPercent: profile?.interSecondYearPercent || '',
      competitiveExams: (Array.isArray(profile?.competitiveExams) ? profile.competitiveExams : []) as string[],
      fatherName: profile?.fatherName || '',
      fatherMobile: profile?.fatherMobile || '',
      fatherOccupation: profile?.fatherOccupation || '',
      motherName: profile?.motherName || '',
      motherMobile: profile?.motherMobile || '',
      motherOccupation: profile?.motherOccupation || '',
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        tenthMarksPercent: profile?.tenthMarksPercent || '',
        interStream: profile?.interStream || '',
        interFirstYearPercent: profile?.interFirstYearPercent || '',
        interSecondYearPercent: profile?.interSecondYearPercent || '',
        competitiveExams: (Array.isArray(profile?.competitiveExams) ? profile.competitiveExams : []) as string[],
        fatherName: profile?.fatherName || '',
        fatherMobile: profile?.fatherMobile || '',
        fatherOccupation: profile?.fatherOccupation || '',
        motherName: profile?.motherName || '',
        motherMobile: profile?.motherMobile || '',
        motherOccupation: profile?.motherOccupation || '',
      });
    }
  }, [open, profile, reset]);

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    const payload = {
      tenthMarksPercent: data.tenthMarksPercent === '' ? undefined : Number(data.tenthMarksPercent),
      interStream: data.interStream || undefined,
      interFirstYearPercent: data.interFirstYearPercent === '' ? undefined : Number(data.interFirstYearPercent),
      interSecondYearPercent: data.interSecondYearPercent === '' ? undefined : Number(data.interSecondYearPercent),
      competitiveExams: data.competitiveExams,
      fatherName: data.fatherName || undefined,
      fatherMobile: data.fatherMobile || undefined,
      fatherOccupation: data.fatherOccupation || undefined,
      motherName: data.motherName || undefined,
      motherMobile: data.motherMobile || undefined,
      motherOccupation: data.motherOccupation || undefined,
    };
    const res = await axios.put(`${apiUrl}/auth/student/profile`, payload, { headers: { Authorization: `Bearer ${token}` } });
    onSaved(res.data);
  };

  const [examInput, setExamInput] = React.useState('');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Academic Profile</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Student basic details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              value={
                `${(student?.firstName || student?.first_name || student?.userName?.split(' ')?.[0] || '')} ${(student?.lastName || student?.last_name || student?.userName?.split(' ')?.[1] || '')}`.trim() || '—'
              }
              label="Name"
              size="small"
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField value={student?.email || student?.emailId || '—'} label="Email" size="small" fullWidth InputProps={{ readOnly: true }} />
            <TextField value={student?.mobilePhone || student?.mobile_phone || '—'} label="Phone" size="small" fullWidth InputProps={{ readOnly: true }} />
            <TextField value={student?.state || '—'} label="State" size="small" fullWidth InputProps={{ readOnly: true }} />
            <TextField value={student?.city || '—'} label="City" size="small" fullWidth InputProps={{ readOnly: true }} />
            <TextField value={student?.courseName || student?.course_name || (student?.course?.name) || '—'} label="Course" size="small" fullWidth InputProps={{ readOnly: true }} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller name="tenthMarksPercent" control={control} render={({ field }) => (
              <TextField {...field} label="10th Marks (%)" type="number" inputProps={{ min: 0, max: 100, step: 0.01 }} fullWidth size="small" />
            )} />
            <Controller name="interStream" control={control} render={({ field }) => (
              <TextField {...field} label="Intermediate Stream (e.g., MPC, BiPC)" placeholder="MPC" fullWidth size="small" />
            )} />
            <Controller name="interFirstYearPercent" control={control} render={({ field }) => (
              <TextField {...field} label="Intermediate 1st Year (%)" type="number" inputProps={{ min: 0, max: 100, step: 0.01 }} fullWidth size="small" />
            )} />
            <Controller name="interSecondYearPercent" control={control} render={({ field }) => (
              <TextField {...field} label="Intermediate 2nd Year (%)" type="number" inputProps={{ min: 0, max: 100, step: 0.01 }} fullWidth size="small" />
            )} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Controller name="competitiveExams" control={control} render={({ field }) => (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField value={examInput} onChange={(e) => setExamInput(e.target.value)} size="small" label="Add Competitive Exam" fullWidth />
                  <Button onClick={() => { if (examInput.trim()) { field.onChange([...(field.value||[]), examInput.trim()]); setExamInput(''); } }} variant="outlined">Add</Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(field.value || []).map((ex: string, idx: number) => (
                    <Chip key={`${ex}-${idx}`} label={ex} onDelete={() => field.onChange((field.value || []).filter((x:string,i:number)=> i!==idx))} />
                  ))}
                </Box>
              </Box>
            )} />
          </Box>

          {/* Family Details - Optional */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <Controller name="fatherName" control={control} render={({ field }) => (
              <TextField {...field} label="Father's Name" size="small" fullWidth />
            )} />
            <Controller name="fatherMobile" control={control} render={({ field }) => (
              <TextField {...field} label="Father's Mobile" size="small" fullWidth />
            )} />
            <Controller name="fatherOccupation" control={control} render={({ field }) => (
              <TextField {...field} label="Father's Occupation" size="small" fullWidth />
            )} />
            <Controller name="motherName" control={control} render={({ field }) => (
              <TextField {...field} label="Mother's Name" size="small" fullWidth />
            )} />
            <Controller name="motherMobile" control={control} render={({ field }) => (
              <TextField {...field} label="Mother's Mobile" size="small" fullWidth />
            )} />
            <Controller name="motherOccupation" control={control} render={({ field }) => (
              <TextField {...field} label="Mother's Occupation" size="small" fullWidth />
            )} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#ff6b35', '&:hover': { backgroundColor: '#e55a2b' } }}>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentProfileModal;


