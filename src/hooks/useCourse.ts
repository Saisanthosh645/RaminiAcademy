import { useQuery } from '@tanstack/react-query';
import { coursesRef } from '@/firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { Course } from '@/types/firebase';

interface UseCourseProps {
  courseId: string;
}

export const useCourse = ({ courseId }: UseCourseProps) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const snap = await getDoc(coursesRef(courseId));
      if (snap.exists()) {
        return { id: courseId, ...snap.data() } as Course;
      }
      throw new Error('Course not found');
    },
    enabled: !!courseId,
  });
};

