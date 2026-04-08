// Mock data for frontend-only mode (no backend required)

export const mockStudents = [
    {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@email.com",
        phone: "+91 98765 11111",
        standard: "10th",
        rollNumber: "DKC001",
        parentName: "Mr. Vijay Sharma",
        parentPhone: "+91 98765 00001",
        parentEmail: "vijay.sharma@email.com",
        dateOfBirth: "2009-04-15",
        address: "123 MG Road, Pune, Maharashtra 411001",
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
        id: 2,
        name: "Diya Patel",
        email: "diya.patel@email.com",
        phone: "+91 98765 22222",
        standard: "10th",
        rollNumber: "DKC002",
        parentName: "Mrs. Priya Patel",
        parentPhone: "+91 98765 00002",
        parentEmail: "priya.patel@email.com",
        dateOfBirth: "2009-08-22",
        address: "456 FC Road, Pune, Maharashtra 411004",
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
        id: 3,
        name: "Arjun Reddy",
        email: "arjun.reddy@email.com",
        phone: "+91 98765 33333",
        standard: "10th",
        rollNumber: "DKC003",
        parentName: "Mr. Kiran Reddy",
        parentPhone: "+91 98765 00003",
        parentEmail: "kiran.reddy@email.com",
        dateOfBirth: "2009-01-10",
        address: "789 Koregaon Park, Pune, Maharashtra 411001",
        createdAt: "2026-01-01T00:00:00.000Z",
    },
];

export const mockTeachers = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@durvankur.com",
        phone: "+91 98765 43210",
        subject: "Mathematics",
        qualification: "PhD in Mathematics",
        experience: 15,
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
        id: 2,
        name: "Prof. Meera Deshmukh",
        email: "meera.deshmukh@durvankur.com",
        phone: "+91 98765 43211",
        subject: "Science",
        qualification: "M.Sc. in Physics",
        experience: 12,
        createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
        id: 3,
        name: "Mrs. Anjali Patil",
        email: "anjali.patil@durvankur.com",
        phone: "+91 98765 43212",
        subject: "English",
        qualification: "MA in English Literature",
        experience: 10,
        createdAt: "2026-01-01T00:00:00.000Z",
    },
];

export const mockSubjects = [
    { id: 1, name: "Mathematics", standard: "10th", teacherId: 1 },
    { id: 2, name: "Science", standard: "10th", teacherId: 2 },
    { id: 3, name: "English", standard: "10th", teacherId: 3 },
];

export const mockAttendance = [
    { id: 1, studentId: 1, date: "2026-02-01", status: "present", remarks: null },
    { id: 2, studentId: 1, date: "2026-02-02", status: "present", remarks: null },
    { id: 3, studentId: 1, date: "2026-02-03", status: "absent", remarks: null },
    { id: 4, studentId: 1, date: "2026-02-04", status: "present", remarks: null },
    { id: 5, studentId: 1, date: "2026-02-05", status: "present", remarks: null },
    { id: 6, studentId: 2, date: "2026-02-01", status: "present", remarks: null },
    { id: 7, studentId: 2, date: "2026-02-02", status: "present", remarks: null },
    { id: 8, studentId: 2, date: "2026-02-03", status: "present", remarks: null },
    { id: 9, studentId: 3, date: "2026-02-01", status: "absent", remarks: null },
    { id: 10, studentId: 3, date: "2026-02-02", status: "present", remarks: null },
];

export const mockMarks = [
    { id: 1, studentId: 1, subjectId: 1, testName: "Unit Test 1", marksObtained: "85", totalMarks: "100", testDate: "2026-01-15", remarks: "Excellent performance" },
    { id: 2, studentId: 1, subjectId: 2, testName: "Unit Test 1", marksObtained: "78", totalMarks: "100", testDate: "2026-01-20", remarks: null },
    { id: 3, studentId: 2, subjectId: 1, testName: "Unit Test 1", marksObtained: "92", totalMarks: "100", testDate: "2026-01-15", remarks: "Outstanding" },
    { id: 4, studentId: 3, subjectId: 3, testName: "Unit Test 1", marksObtained: "88", totalMarks: "100", testDate: "2026-01-18", remarks: null },
];

export const mockFees = [
    { id: 1, studentId: 1, month: "January", year: 2026, amount: "5000", paidAmount: "5000", status: "paid", paymentDate: "2026-01-05", remarks: null },
    { id: 2, studentId: 1, month: "February", year: 2026, amount: "5000", paidAmount: "5000", status: "paid", paymentDate: "2026-02-05", remarks: null },
    { id: 3, studentId: 1, month: "March", year: 2026, amount: "5000", paidAmount: "0", status: "pending", paymentDate: null, remarks: null },
    { id: 4, studentId: 2, month: "January", year: 2026, amount: "5000", paidAmount: "5000", status: "paid", paymentDate: "2026-01-05", remarks: null },
    { id: 5, studentId: 2, month: "February", year: 2026, amount: "5000", paidAmount: "5000", status: "paid", paymentDate: "2026-02-05", remarks: null },
    { id: 6, studentId: 3, month: "January", year: 2026, amount: "5000", paidAmount: "5000", status: "paid", paymentDate: "2026-01-05", remarks: null },
    { id: 7, studentId: 3, month: "February", year: 2026, amount: "5000", paidAmount: "0", status: "pending", paymentDate: null, remarks: null },
];

export const mockTests = [
    { id: 1, name: "Mid-Term Examination", subjectId: 1, standard: "10th", totalMarks: "100", testDate: "2026-03-15", status: "upcoming" },
    { id: 2, name: "Final Examination", subjectId: 2, standard: "10th", totalMarks: "100", testDate: "2026-05-20", status: "upcoming" },
    { id: 3, name: "Unit Test 1", subjectId: 3, standard: "10th", totalMarks: "50", testDate: "2026-01-18", status: "completed" },
];

export const mockNotes = [
    {
        id: 1,
        title: "Quadratic Equations - Chapter Notes",
        subjectId: 1,
        subjectName: "Mathematics",
        standard: "10th",
        content: "Comprehensive notes covering quadratic equations, standard form, solving methods (factoring, completing square, quadratic formula) and real-world applications.",
        fileUrl: null,
        type: "handwritten",
        uploadedBy: 1,
        teacherName: "Dr. Rajesh Kumar",
        uploadedAt: "2026-01-10T00:00:00.000Z",
    },
    {
        id: 2,
        title: "Chemical Reactions - Video Lecture",
        subjectId: 2,
        subjectName: "Science",
        standard: "10th",
        content: "Video lecture covering types of chemical reactions, balancing equations, double displacement, and decomposition reactions.",
        fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video",
        uploadedBy: 2,
        teacherName: "Prof. Meera Deshmukh",
        uploadedAt: "2026-01-12T00:00:00.000Z",
    },
    {
        id: 3,
        title: "Algebra Basics - PowerPoint Slides",
        subjectId: 1,
        subjectName: "Mathematics",
        standard: "10th",
        content: "PPT covering algebraic identities, polynomials, and factorization with visual examples and practice problems.",
        fileUrl: "https://example.com/algebra-slides.pptx",
        type: "ppt",
        uploadedBy: 1,
        teacherName: "Dr. Rajesh Kumar",
        uploadedAt: "2026-01-15T00:00:00.000Z",
    },
    {
        id: 4,
        title: "English Grammar - Tenses Handwritten Notes",
        subjectId: 3,
        subjectName: "English",
        standard: "10th",
        content: "Handwritten detailed notes on all 12 tenses with examples, usage rules, and common mistakes to avoid.",
        fileUrl: null,
        type: "handwritten",
        uploadedBy: 3,
        teacherName: "Mrs. Anjali Patil",
        uploadedAt: "2026-01-18T00:00:00.000Z",
    },
    {
        id: 5,
        title: "Light & Optics - Video Lecture",
        subjectId: 2,
        subjectName: "Science",
        standard: "10th",
        content: "Video lecture on reflection, refraction, lenses, and human eye with animated diagrams and numerical problems.",
        fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video",
        uploadedBy: 2,
        teacherName: "Prof. Meera Deshmukh",
        uploadedAt: "2026-02-01T00:00:00.000Z",
    },
    {
        id: 6,
        title: "Shakespeare - Merchant of Venice PPT",
        subjectId: 3,
        subjectName: "English",
        standard: "10th",
        content: "Presentation covering all acts of Merchant of Venice, character analysis, themes and important quotes.",
        fileUrl: "https://example.com/shakespeare.pptx",
        type: "ppt",
        uploadedBy: 3,
        teacherName: "Mrs. Anjali Patil",
        uploadedAt: "2026-02-05T00:00:00.000Z",
    },
];

export const mockTestResults = [
    { id: 1, studentId: 1, subjectId: 1, subjectName: "Mathematics", testName: "Unit Test 1", testType: "tuition", marksObtained: 85, totalMarks: 100, grade: "A", term: "Term 1", testDate: "2026-01-15", remarks: "Excellent performance" },
    { id: 2, studentId: 1, subjectId: 2, subjectName: "Science", testName: "Unit Test 1", testType: "tuition", marksObtained: 78, totalMarks: 100, grade: "B+", term: "Term 1", testDate: "2026-01-20", remarks: "Good effort" },
    { id: 3, studentId: 1, subjectId: 3, subjectName: "English", testName: "Unit Test 1", testType: "tuition", marksObtained: 88, totalMarks: 100, grade: "A", term: "Term 1", testDate: "2026-01-18", remarks: null },
    { id: 4, studentId: 1, subjectId: 1, subjectName: "Mathematics", testName: "Mid-Term Exam", testType: "school", marksObtained: 72, totalMarks: 100, grade: "B", term: "Term 1", testDate: "2026-02-10", remarks: "Needs improvement in geometry" },
    { id: 5, studentId: 1, subjectId: 2, subjectName: "Science", testName: "Mid-Term Exam", testType: "school", marksObtained: 80, totalMarks: 100, grade: "A", term: "Term 1", testDate: "2026-02-12", remarks: null },
    { id: 6, studentId: 1, subjectId: 1, subjectName: "Mathematics", testName: "Unit Test 2", testType: "tuition", marksObtained: 91, totalMarks: 100, grade: "A+", term: "Term 2", testDate: "2026-03-05", remarks: "Outstanding improvement!" },
    { id: 7, studentId: 1, subjectId: 3, subjectName: "English", testName: "Unit Test 2", testType: "tuition", marksObtained: 65, totalMarks: 100, grade: "C", term: "Term 2", testDate: "2026-03-08", remarks: "Focus on essay writing" },
];

export const mockWeeklyAttendance = [
    { date: "2026-03-11", day: "Mon", status: "present" },
    { date: "2026-03-12", day: "Tue", status: "present" },
    { date: "2026-03-13", day: "Wed", status: "absent" },
    { date: "2026-03-14", day: "Thu", status: "present" },
    { date: "2026-03-15", day: "Fri", status: "present" },
    { date: "2026-03-17", day: "Mon", status: "present" },
];

export const mockMonthlyAttendance = [
    { month: "October", year: 2025, totalDays: 26, present: 24, absent: 2, percentage: 92 },
    { month: "November", year: 2025, totalDays: 25, present: 23, absent: 2, percentage: 92 },
    { month: "December", year: 2025, totalDays: 20, present: 18, absent: 2, percentage: 90 },
    { month: "January", year: 2026, totalDays: 24, present: 20, absent: 4, percentage: 83 },
    { month: "February", year: 2026, totalDays: 22, present: 19, absent: 3, percentage: 86 },
    { month: "March", year: 2026, totalDays: 11, present: 9, absent: 2, percentage: 82 },
];

export const mockAbsenceNotifications = [
    { id: 1, studentId: 1, date: "2026-03-13", message: "Aarav Sharma was absent on 13 Mar 2026 (Wednesday). Please ensure timely attendance.", isRead: false, sentAt: "2026-03-13T09:15:00.000Z" },
    { id: 2, studentId: 1, date: "2026-02-24", message: "Aarav Sharma was absent on 24 Feb 2026 (Monday). Please contact the teacher if there is any concern.", isRead: true, sentAt: "2026-02-24T09:15:00.000Z" },
    { id: 3, studentId: 1, date: "2026-01-15", message: "Aarav Sharma was absent on 15 Jan 2026 (Wednesday).", isRead: true, sentAt: "2026-01-15T09:15:00.000Z" },
];

export const mockBatchAchievements = [
    { id: 1, name: "Shreya Kulkarni", batchYear: "2024-25", percentage: 98.4, rank: 1, grade: "A+", collegeAdmitted: "IIT Bombay - Computer Science", photo: null },
    { id: 2, name: "Rohit Joshi", batchYear: "2024-25", percentage: 96.8, rank: 2, grade: "A+", collegeAdmitted: "COEP Pune - Mechanical Eng.", photo: null },
    { id: 3, name: "Ananya Desai", batchYear: "2024-25", percentage: 95.2, rank: 3, grade: "A", collegeAdmitted: "Pune University - Science", photo: null },
    { id: 4, name: "Vikram Nair", batchYear: "2024-25", percentage: 93.6, rank: 4, grade: "A", collegeAdmitted: "BITS Pilani - Electronics", photo: null },
    { id: 5, name: "Priya Menon", batchYear: "2024-25", percentage: 92.1, rank: 5, grade: "A", collegeAdmitted: "Symbiosis - IT", photo: null },
    { id: 6, name: "Aditya Thakur", batchYear: "2023-24", percentage: 97.2, rank: 1, grade: "A+", collegeAdmitted: "IIT Delhi - Civil Eng.", photo: null },
    { id: 7, name: "Kavya Iyer", batchYear: "2023-24", percentage: 95.5, rank: 2, grade: "A+", collegeAdmitted: "NIT Trichy - CSE", photo: null },
    { id: 8, name: "Siddharth Ghosh", batchYear: "2023-24", percentage: 94.0, rank: 3, grade: "A", collegeAdmitted: "VIT Vellore - ECE", photo: null },
];

export const mockMessages = [
    {
        id: 1,
        senderId: 1,
        senderType: "parent",
        receiverId: 1,
        receiverType: "teacher",
        subject: "Query regarding Math Assignment",
        content: "Dear Sir, My child needs clarification on the quadratic equations assignment. Could we schedule a meeting?",
        isRead: false,
        createdAt: "2026-02-10T00:00:00.000Z",
    },
    {
        id: 2,
        senderId: 1,
        senderType: "teacher",
        receiverId: 2,
        receiverType: "parent",
        subject: "Progress Update",
        content: "Your child Diya is performing excellently in mathematics. Keep it up!",
        isRead: true,
        createdAt: "2026-02-08T00:00:00.000Z",
    },
];

export const mockDashboardStats = {
    totalStudents: 3,
    totalTeachers: 3,
    pendingFees: 10000,
    upcomingTests: 2,
    recentMessages: 1,
};

export const mockStudentStats: Record<number, object> = {
    1: {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@email.com",
        phone: "+91 98765 11111",
        standard: "10th",
        rollNumber: "DKC001",
        attendancePercentage: 80,
        averageMarks: 81.5,
        pendingFees: 5000,
    },
    2: {
        id: 2,
        name: "Diya Patel",
        email: "diya.patel@email.com",
        phone: "+91 98765 22222",
        standard: "10th",
        rollNumber: "DKC002",
        attendancePercentage: 100,
        averageMarks: 92,
        pendingFees: 0,
    },
    3: {
        id: 3,
        name: "Arjun Reddy",
        email: "arjun.reddy@email.com",
        phone: "+91 98765 33333",
        standard: "10th",
        rollNumber: "DKC003",
        attendancePercentage: 50,
        averageMarks: 88,
        pendingFees: 5000,
    },
};

export const mockAttendanceStats: Record<number, object> = {
    1: { total: 10, present: 8, absent: 2, percentage: 80 },
    2: { total: 10, present: 10, absent: 0, percentage: 100 },
    3: { total: 10, present: 5, absent: 5, percentage: 50 },
};

export const mockFeeStats: Record<number, object> = {
    1: { totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, paidMonths: 2, pendingMonths: 1 },
    2: { totalAmount: 10000, paidAmount: 10000, pendingAmount: 0, paidMonths: 2, pendingMonths: 0 },
    3: { totalAmount: 10000, paidAmount: 5000, pendingAmount: 5000, paidMonths: 1, pendingMonths: 1 },
};

/**
 * Resolve a mock response for any /api/* URL.
 * Returns `undefined` if the path is not recognized.
 */
export function resolveMock(url: string): unknown | undefined {
    // Strip query string
    const path = url.split("?")[0];

    if (path === "/api/dashboard/stats") return mockDashboardStats;
    if (path === "/api/students") return mockStudents;
    if (path === "/api/teachers") return mockTeachers;
    if (path === "/api/subjects") return mockSubjects;
    if (path === "/api/attendance") return mockAttendance;
    if (path === "/api/marks") return mockMarks;
    if (path === "/api/fees") return mockFees;
    if (path === "/api/tests") return mockTests;
    if (path === "/api/notes") return mockNotes;
    if (path === "/api/messages") return mockMessages;
    if (path === "/api/test-results") return mockTestResults;
    if (path === "/api/attendance/weekly") return mockWeeklyAttendance;
    if (path === "/api/attendance/monthly") return mockMonthlyAttendance;
    if (path === "/api/notifications/absence") return mockAbsenceNotifications;
    if (path === "/api/achievements") return mockBatchAchievements;

    // /api/students/:id
    const studentMatch = path.match(/^\/api\/students\/(\d+)$/);
    if (studentMatch) {
        return mockStudents.find((s) => s.id === Number(studentMatch[1])) ?? null;
    }

    // /api/students/:id/stats
    const studentStatsMatch = path.match(/^\/api\/students\/(\d+)\/stats$/);
    if (studentStatsMatch) {
        return mockStudentStats[Number(studentStatsMatch[1])] ?? null;
    }

    // /api/teachers/:id
    const teacherMatch = path.match(/^\/api\/teachers\/(\d+)$/);
    if (teacherMatch) {
        return mockTeachers.find((t) => t.id === Number(teacherMatch[1])) ?? null;
    }

    // /api/attendance/stats/:studentId
    const attendanceStatsMatch = path.match(/^\/api\/attendance\/stats\/(\d+)$/);
    if (attendanceStatsMatch) {
        return mockAttendanceStats[Number(attendanceStatsMatch[1])] ?? { total: 0, present: 0, absent: 0, percentage: 0 };
    }

    // /api/fees/stats/:studentId
    const feeStatsMatch = path.match(/^\/api\/fees\/stats\/(\d+)$/);
    if (feeStatsMatch) {
        return mockFeeStats[Number(feeStatsMatch[1])] ?? { totalAmount: 0, paidAmount: 0, pendingAmount: 0, paidMonths: 0, pendingMonths: 0 };
    }

    return undefined;
}
