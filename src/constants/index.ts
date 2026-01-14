import { GraduationCap, School } from 'lucide-react';

export const USER_ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.STUDENT,
        label: 'Student',
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.TEACHER,
        label: 'Teacher',
        icon: School,
    },
];

export const DEPARTMENTS = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Economics',
    'Business Administration',
    'Engineering',
    'Psychology',
    'Sociology',
    'Political Science',
    'Philosophy',
    'Education',
    'Fine Arts',
    'Music',
    'Physical Education',
    'Law',
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));
