// Course Configuration - Centralized place to manage Zoom links, times, and other dynamic data
export const COURSE_CONFIG = {
  // Zoom links for each course
  zoomLinks: {
    "python-zero-hero": "https://zoom.us/j/1234567890",
    "web-dev-basics": "https://zoom.us/j/2345678901",
    "dsa-python": "https://zoom.us/j/3456789012",
    "ai-tools": "https://zoom.us/j/4567890123",
    "powerpoint": "https://zoom.us/j/5678901234",
    "excel": "https://zoom.us/j/6789012345"
  },

  // Default meeting times for each course (can be overridden per session)
  defaultTimes: {
    "python-zero-hero": "7:00 PM",
    "web-dev-basics": "8:15 PM",
    "dsa-python": "5:00 PM",
    "ai-tools": "6:00 PM",
    "powerpoint": "4:00 PM",
    "excel": "3:00 PM"
  },

  // Course capacities and enrollment limits
  capacities: {
    "python-zero-hero": 100,
    "web-dev-basics": 50,
    "dsa-python": 40,
    "ai-tools": 75,
    "powerpoint": 60,
    "excel": 80
  },

  // Current enrollment counts (update these regularly)
  enrolledCounts: {
    "python-zero-hero": 85,
    "web-dev-basics": 50, // Full
    "dsa-python": 40, // Full
    "ai-tools": 45,
    "powerpoint": 30,
    "excel": 55
  },

  // Instructor information
  instructors: {
    default: "Ramini Academy",
    "python-zero-hero": "Ramini Academy",
    "web-dev-basics": "Ramini Academy",
    "dsa-python": "Ramini Academy",
    "ai-tools": "Ramini Academy",
    "powerpoint": "Ramini Academy",
    "excel": "Ramini Academy"
  },

  // Support contact information
  support: {
    email: "support@raminiacademy.com",
    phone: "+91-XXXXXXXXXX",
    whatsapp: "https://wa.me/91XXXXXXXXXX"
  }
};

// Helper functions to get configuration data
export const getZoomLink = (courseId: string): string => {
  return COURSE_CONFIG.zoomLinks[courseId] || COURSE_CONFIG.zoomLinks["python-zero-hero"];
};

export const getDefaultTime = (courseId: string): string => {
  return COURSE_CONFIG.defaultTimes[courseId] || "7:00 PM";
};

export const getCapacity = (courseId: string): number => {
  return COURSE_CONFIG.capacities[courseId] || 50;
};

export const getEnrolledCount = (courseId: string): number => {
  return COURSE_CONFIG.enrolledCounts[courseId] || 0;
};

export const isCourseFull = (courseId: string): boolean => {
  const capacity = getCapacity(courseId);
  const enrolled = getEnrolledCount(courseId);
  return enrolled >= capacity;
};

export const getSupportInfo = () => COURSE_CONFIG.support;