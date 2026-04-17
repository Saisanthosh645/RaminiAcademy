import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { coursesRef } from '@/firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { Course } from '@/types/firebase';

export const useUserCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userCourses', user?.uid, user?.enrolledCourses, user?.progress],
    queryFn: async () => {
      if (!user?.enrolledCourses?.length) return [];
      
      const coursePromises = user.enrolledCourses.map((courseId: string) => 
        getDoc(coursesRef(courseId)).then((snap) => {
          if (snap.exists()) {
            const courseData = { id: courseId, ...snap.data() } as Course;
            if (user?.progress?.[courseId]) {
              const uProg = user.progress[courseId];
              courseData.completedClasses = uProg.completedClasses || 0;
              courseData.totalClasses = Math.max(1, uProg.totalClasses || courseData.totalClasses || 1);
              courseData.progress = Math.round((courseData.completedClasses / courseData.totalClasses) * 100) || 0;
            } else {
              courseData.completedClasses = 0;
              courseData.progress = 0;
            }
            return courseData;
          }
          return null;
        })
      );
      
      const courses = await Promise.all(coursePromises);
      return courses.filter(Boolean) as Course[];
    },
    enabled: !!user,
  });
};

