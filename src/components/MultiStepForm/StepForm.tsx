import React from 'react'
import z from 'zod';

interface StepFormProps {
   id: string;
   title?: string;
   description?: string;
   schema?: z.ZodType<any>;
   defaultValues?: any;
   children: React.ReactNode;
}

const StepForm: React.FC<StepFormProps> = ({ 
   id, 
   title, 
   schema, 
   description = '', 
   defaultValues, 
   children 
}) => {
   return (
      <div className="flex flex-col w-full">
         {(title || description) && (
            <div className="space-y-1 mb-4">
               {title && (
                  <h3 className="text-lg font-semibold">{title}</h3>
               )}
               {description && (
                  <p className="text-sm text-muted-foreground">
                     {description}
                  </p>
               )}
            </div>
         )}
         <div className="space-y-4">
            {children}
         </div>
      </div>
   )
}

export default StepForm