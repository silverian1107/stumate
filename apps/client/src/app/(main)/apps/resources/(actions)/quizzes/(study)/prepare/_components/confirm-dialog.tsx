import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { setShowResults } from '@/redux/slices/studyQuizSlice';
import type { AppDispatch } from '@/redux/store';

const ConfirmDialog = ({
  setShowDialog,
  showDialog
}: {
  setShowDialog: (state: boolean) => void;
  showDialog: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent asChild>
        <motion.div>
          <AlertDialogHeader>
            <AlertDialogTitle>Unanswered Questions</AlertDialogTitle>
            <AlertDialogDescription>
              There are still some questions you haven&apos;t answered. Are you
              sure you want to submit the quiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDialog(false);
                dispatch(setShowResults(true));
              }}
            >
              Submit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
