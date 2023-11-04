"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isCompleted?: boolean
}

const CourseProgressButton  = ({ courseId, chapterId, nextChapterId, isCompleted }: 
    CourseProgressButtonProps) => {
        const router = useRouter();
        const confetti = useConfettiStore();
        const [isLoading, setisLoading] = useState(false);
        const Icon = isCompleted ? XCircle : CheckCircle;
        
        const onClick = async () => {
            try {
                setisLoading(true);
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: !isCompleted
                });
                // reach to the end of the course
                if (!isCompleted && !nextChapterId) {
                    confetti.onOpen();
                }

                if(!isCompleted && nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }

                toast.success("progress updated");
                router.refresh();
            } catch(err) {
                toast.error("Something went wrong");
            } finally {
                setisLoading(false);
            }
        }
  return (
    <Button 
        className=" w-full md:w-auto" 
        type="button" 
        variant={isCompleted ? "outline" : "success"}
        onClick={onClick}
        disabled={isLoading}
    >
        {isCompleted? "Not completed": "Mark as complete"}
        <Icon className="h-4 w-4 ml-2" />
    </Button>
  )
}

export default CourseProgressButton 