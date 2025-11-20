// components/MultiStepForm.tsx

import React from 'react';
import { z } from 'zod';
import StepsHeader from './StepsHeader';
import NForm from '../NForm';
import { useStepNavigation } from './hooks/useStepNavigation';
import { useDialogButtons } from './hooks/useDialogButtons';
import { useFormSubmission } from './hooks/useFormSubmission';

interface MultiStepFormProps {
   children: React.ReactNode;
   fullSchema: z.ZodObject<any>;
   onSubmit?: (data: any) => void | Promise<void>;
   transformData: (formData: any) => any;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
   children,
   onSubmit,
   fullSchema,
   transformData
}) => {

   // 1. Step Navigation Logic
   const {
      currentStep,
      isLastStep,
      isFirstStep,
      handleNext,
      handlePrevious,
      reset,
      currentStepComponent,
      currentStepId,
      currentStepSchema,
      currentStepDefaultValues,
      steps
   } = useStepNavigation(children);

   // 2. External Dialog/Button Logic (as before)
   useDialogButtons({
      currentStep,
      isFirstStep,
      isLastStep,
      currentStepId,
      handlePrevious,
      reset
   });

   // 3. Submission and Data Handling Logic (The new hook)
   const { handleStepSubmit } = useFormSubmission({
      reset,
      currentStepId,
      isLastStep,
      handleNext,
      fullSchema,
      onSubmit,
      transformData
   });

   return (
      <div className="flex w-full flex-col justify-center gap-4">
         <StepsHeader steps={steps} currentStep={currentStep} />

         <NForm
            key={currentStepId}
            id={currentStepId}
            schema={currentStepSchema}
            defaultValues={currentStepDefaultValues}
            onSubmit={handleStepSubmit} // Use the function from the new hook
         >
            {currentStepComponent.props.children}
         </NForm>
      </div>
   );
};

export default MultiStepForm;