'use client';

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseActionsProps {
    courseId: string;
    isPublished: boolean;
    disabled: boolean;
}

const CourseActions = (
    { isPublished, disabled, courseId }: CourseActionsProps) => {

        const router = useRouter();
        const { onOpen } = useConfettiStore();
        const [isLoading, setIsLoading] = useState(false);

        const handleDelete = async () => {
            try {
                setIsLoading(true);
                await axios.delete(`/api/courses/${courseId}`);
                toast.success("Course deleted");
                router.refresh();
                router.push(`/teacher/courses`);
            } catch(err) {
                toast.error("Something went wrong");
                
            } finally {
                setIsLoading(false);
            }
        }

        const handlePublish = async () => {
            try {
                setIsLoading(true);
                if (isPublished){
                    await axios.patch(`/api/courses/${courseId}/unpublish`);
                
                    toast.success("Course Unpublished");                    
                } else {
                    await axios.patch(`/api/courses/${courseId}/publish`);
                
                    toast.success("Course Published");
                    onOpen();
                }

                router.refresh();

            } catch(err) {
                toast.error("Something went wrong");
            } finally {
                setIsLoading(false);
            }
        }
  return (
    <div className="flex items-center gap-x-2">
        <Button
            onClick={handlePublish}
            disabled={disabled || isLoading}
            variant={"outline"}
        >
            {isPublished? "Unpublish": "Publish"}
        </Button>
        <ConfirmModal onConfirm={handleDelete}>
            <Button
                variant="outline"
                size="sm"
            >
                <Trash  className='w-4 h-4'/>
            </Button>
        </ConfirmModal>
    </div>
  )
}

export default CourseActions 