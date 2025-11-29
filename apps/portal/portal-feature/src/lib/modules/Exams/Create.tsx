import React from 'react';
import { useCreate, useUpdate } from '@refinedev/core';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['UPCOMING', 'CURRENT', 'COMPLETED']).default('UPCOMING'),
  examLevel: z.string().optional(),
  examMode: z.string().optional(),
  examDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  applicationStartDate: z.string().optional(),
  applicationEndDate: z.string().optional(),
  registrationUrl: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
  officialWebsite: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
  conductingBody: z.string().optional(),
  applicationFee: z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), z.number().nonnegative().optional()),
  description: z.string().optional(),
  eligibility: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ExamFormData = z.infer<typeof schema>;

const levels = ['NATIONAL', 'STATE', 'INSTITUTE'];
const modes = ['ONLINE', 'OFFLINE', 'HYBRID'];
const statuses = ['UPCOMING', 'CURRENT', 'COMPLETED'] as const;

interface ExamModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initial?: Partial<ExamFormData & { examId?: string }>
}

const CreateOrEditExamModal: React.FC<ExamModalProps> = ({ open, onClose, onSuccess, initial }) => {
  const isEdit = Boolean(initial?.examId);
  const { mutate: createOne } = useCreate();
  const { mutate: updateOne } = useUpdate();

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ExamFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name || '',
      category: initial?.category || '',
      status: (initial?.status as any) || 'UPCOMING',
      examLevel: initial?.examLevel || 'NATIONAL',
      examMode: initial?.examMode || 'ONLINE',
      examDate: initial?.examDate || '',
      startDate: initial?.startDate || '',
      endDate: initial?.endDate || '',
      applicationStartDate: initial?.applicationStartDate || '',
      applicationEndDate: initial?.applicationEndDate || '',
      registrationUrl: initial?.registrationUrl || '',
      officialWebsite: initial?.officialWebsite || '',
      conductingBody: initial?.conductingBody || '',
      applicationFee: (initial?.applicationFee ?? '') as any,
      description: initial?.description || '',
      eligibility: initial?.eligibility || '',
      isActive: initial?.isActive ?? true,
    },
  });

  const dateMode = watch('examDate') ? 'single' : (watch('startDate') || watch('endDate') ? 'range' : 'single');

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: initial?.name || '',
      category: initial?.category || '',
      status: (initial?.status as any) || 'UPCOMING',
      examLevel: initial?.examLevel || 'NATIONAL',
      examMode: initial?.examMode || 'ONLINE',
      examDate: initial?.examDate || '',
      startDate: initial?.startDate || '',
      endDate: initial?.endDate || '',
      applicationStartDate: initial?.applicationStartDate || '',
      applicationEndDate: initial?.applicationEndDate || '',
      registrationUrl: initial?.registrationUrl || '',
      officialWebsite: initial?.officialWebsite || '',
      conductingBody: initial?.conductingBody || '',
      applicationFee: (initial?.applicationFee ?? '') as any,
      description: initial?.description || '',
      eligibility: initial?.eligibility || '',
      isActive: initial?.isActive ?? true,
    });
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [open, initial, reset]);

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null);

  const onSubmit = (data: ExamFormData) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    const values = {
      ...data,
      examDate: data.examDate || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      applicationStartDate: data.applicationStartDate || undefined,
      applicationEndDate: data.applicationEndDate || undefined,
      registrationUrl: data.registrationUrl ? data.registrationUrl : undefined,
      officialWebsite: data.officialWebsite ? data.officialWebsite : undefined,
    } as any;

    if (isEdit && initial?.examId) {
      updateOne(
        { resource: 'exams', id: initial.examId, values },
        {
          onSuccess: () => { setSubmitSuccess('Exam saved'); onSuccess(); onClose(); },
          onError: (e: any) => setSubmitError(e?.response?.data?.message || e?.message || 'Failed to save exam'),
        }
      );
    } else {
      createOne(
        { resource: 'exams', values },
        {
          onSuccess: () => { setSubmitSuccess('Exam created'); onSuccess(); onClose(); reset(); },
          onError: (e: any) => setSubmitError(e?.response?.data?.message || e?.message || 'Failed to create exam'),
        }
      );
    }
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {submitError && (
            <Grid container><Grid item xs={12}><div style={{ color: '#d32f2f', marginBottom: 8 }}>{submitError}</div></Grid></Grid>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} fullWidth size="small" label="Exam Name *" error={!!errors.name} helperText={errors.name?.message} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="category" control={control} render={({ field }) => (
                <TextField {...field} fullWidth size="small" label="Category *" error={!!errors.category} helperText={errors.category?.message} />
              )} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller name="status" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth size="small" label="Status">
                  {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="examLevel" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth size="small" label="Level">
                  <MenuItem value="">—</MenuItem>
                  {levels.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="examMode" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth size="small" label="Mode">
                  <MenuItem value="">—</MenuItem>
                  {modes.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              )} />
            </Grid>

            {dateMode === 'single' ? (
              <Grid item xs={12} sm={4}>
                <Controller name="examDate" control={control} render={({ field }) => (
                  <DatePicker label="Exam Date" value={field.value ? dayjs(field.value) : null} onChange={(v: Dayjs | null) => field.onChange(v ? v.format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                )} />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={4}>
                  <Controller name="startDate" control={control} render={({ field }) => (
                    <DatePicker label="Start Date" value={field.value ? dayjs(field.value) : null} onChange={(v: Dayjs | null) => field.onChange(v ? v.format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                  )} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller name="endDate" control={control} render={({ field }) => (
                    <DatePicker label="End Date" value={field.value ? dayjs(field.value) : null} onChange={(v: Dayjs | null) => field.onChange(v ? v.format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                  )} />
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={4}>
              <Controller name="applicationStartDate" control={control} render={({ field }) => (
                <DatePicker label="Application Start" value={field.value ? dayjs(field.value) : null} onChange={(v: Dayjs | null) => field.onChange(v ? v.format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="applicationEndDate" control={control} render={({ field }) => (
                <DatePicker label="Application End" value={field.value ? dayjs(field.value) : null} onChange={(v: Dayjs | null) => field.onChange(v ? v.format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
              )} />
            </Grid>

            <Grid item xs={12}>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  More details (optional)
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller name="registrationUrl" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" label="Registration URL" placeholder="https://..." />
                      )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="officialWebsite" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" label="Official Website" placeholder="https://..." />
                      )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="conductingBody" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" label="Conducting Body" />
                      )} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller name="applicationFee" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" label="Application Fee" type="number" onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                      )} />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller name="description" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" multiline minRows={3} label="Description" />
                      )} />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller name="eligibility" control={control} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" multiline minRows={3} label="Eligibility" />
                      )} />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12}>
              <Controller name="isActive" control={control} render={({ field }) => (
                <FormControlLabel control={<Switch checked={field.value} onChange={(_, v) => field.onChange(v)} />} label="Active" />
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#ff6b35', '&:hover': { backgroundColor: '#e55a2b' } }}>{isEdit ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateOrEditExamModal;


