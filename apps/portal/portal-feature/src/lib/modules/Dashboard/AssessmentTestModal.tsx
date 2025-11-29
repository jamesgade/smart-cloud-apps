import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from '@mui/material';

type Question = {
  id: string;
  text: string;
  options: { label: string; value: number }[];
};

interface AssessmentTestModalProps {
  open: boolean;
  onClose: () => void;
}

const QUESTIONS: Question[] = [
  // INTEREST
  { id: 'I1', text: 'I enjoy Maths and solving numerical problems.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'I2', text: 'I’m curious about how machines, electronics or software work.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'I3', text: 'Biology/health topics (human body, diseases, care) interest me.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'I4', text: 'I like business, money, markets or how companies work.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'I5', text: 'I enjoy drawing, design, videos, music or creative work.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'I6', text: 'I like history, civics, psychology or understanding people and society.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},

  // SKILL_CONFIDENCE
  { id: 'S1', text: 'I feel confident with Maths (algebra, statistics, calculations).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'S2', text: 'I feel confident with Physics/Chemistry concepts and experiments.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'S3', text: 'I feel confident with Biology (diagrams, concepts, memory-based learning).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'S4', text: 'I feel confident with Accounts/Economics/Business Studies.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'S5', text: 'I feel confident creating visual/artistic work (design, editing, presentation).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'S6', text: 'I explain ideas clearly in English or my first language.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},

  // WORK_PREFERENCE
  { id: 'W1', text: 'I prefer practical/hands‑on work (labs, projects, making things).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'W2', text: 'I like working with people (guiding, helping, communicating).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'W3', text: 'I like solving logic/coding problems step by step.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'W4', text: 'I enjoy reading, research and writing more than calculations.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'W5', text: 'I like selling ideas/products or starting small ventures.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'W6', text: 'I enjoy creative expression (designing, performing, content creation).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},

  // VALUES_PRACTICAL
  { id: 'V1', text: 'Getting a stable job and income soon after studies is important to me.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'V2', text: 'I want my career to help society or improve people’s lives.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'V3', text: 'I want a career where creativity is a big part of daily work.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'V4', text: 'I’m ready to prepare for competitive exams (NEET/JEE/CA/other).', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'V5', text: 'I prefer shorter/skill‑based paths that lead to faster employability.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
  { id: 'V6', text: 'Parental expectations strongly influence my stream/career choice.', options: [
    { label: 'Strongly Disagree', value: 1 }, { label: 'Disagree', value: 2 }, { label: 'Neutral', value: 3 }, { label: 'Agree', value: 4 }, { label: 'Strongly Agree', value: 5 },
  ]},
];

const AssessmentTestModal: React.FC<AssessmentTestModalProps> = ({ open, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const progress = Math.round(((currentIndex) / total) * 100);

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const score = React.useMemo(() => {
    const values = Object.values(answers);
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / (total * 5)) * 100);
  }, [answers, total]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assessment Test</DialogTitle>
      <DialogContent>
        {!submitted ? (
          <>
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary">
                Question {currentIndex + 1} of {total}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentQuestion.text}
            </Typography>
            <RadioGroup
              value={answers[currentQuestion.id] ?? ''}
              onChange={(e) => handleAnswer(Number(e.target.value))}
            >
              {currentQuestion.options.map((opt) => (
                <FormControlLabel key={opt.label} value={opt.value} control={<Radio />} label={opt.label} />
              ))}
            </RadioGroup>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Assessment Completed
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Your indicative fit score: <strong>{score}%</strong>
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {!submitted ? (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleBack} disabled={currentIndex === 0}>Back</Button>
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={answers[currentQuestion.id] == null}
            >
              {currentIndex === total - 1 ? 'Submit' : 'Next'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleRestart}>Retake</Button>
            <Button onClick={onClose} variant="contained">Done</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AssessmentTestModal;


