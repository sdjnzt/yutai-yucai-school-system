import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp, Spin, theme } from 'antd';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';

// 登录页面
const Login = React.lazy(() => import('./pages/Login'));

// 首页
const Home = React.lazy(() => import('./pages/Home'));

// 学生管理
const StudentList = React.lazy(() => import('./pages/student/StudentList'));
const ClassManagement = React.lazy(() => import('./pages/student/ClassManagement'));

// 教师管理
const TeacherList = React.lazy(() => import('./pages/teacher/TeacherList'));
const TeacherSchedule = React.lazy(() => import('./pages/teacher/TeacherSchedule'));

// 课程管理
const CourseList = React.lazy(() => import('./pages/course/CourseList'));
const CourseSchedule = React.lazy(() => import('./pages/course/CourseSchedule'));
const CoursePlan = React.lazy(() => import('./pages/course/CoursePlan'));

// 成绩管理
const ScoreInput = React.lazy(() => import('./pages/score/ScoreInput'));
const ScoreAnalysis = React.lazy(() => import('./pages/score/ScoreAnalysis'));
const ScoreReport = React.lazy(() => import('./pages/score/ScoreReport'));

// 流程审批
const PendingApproval = React.lazy(() => import('./pages/workflow/PendingApproval'));
const DoneApproval = React.lazy(() => import('./pages/workflow/DoneApproval'));

// 通知公告
const NotificationList = React.lazy(() => import('./pages/notification/NotificationList'));
const PublishNotification = React.lazy(() => import('./pages/notification/PublishNotification'));
const MyNotification = React.lazy(() => import('./pages/notification/MyNotification'));

// 系统管理
const UserManagement = React.lazy(() => import('./pages/system/UserManagement'));
const RoleManagement = React.lazy(() => import('./pages/system/RoleManagement'));
const SystemSettings = React.lazy(() => import('./pages/system/SystemSettings'));

const App = () => {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '20%' }}><Spin size="large" /></div>}>
          <Routes>
            {/* 根路径重定向到首页，首页会被 PrivateRoute 保护 */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* 登录页面 */}
            <Route path="/login" element={<Login />} />

            {/* 受保护的路由 */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              {/* 首页 */}
              <Route path="/home" element={<Home />} />
              
              {/* 学生管理 */}
              <Route path="/student">
                <Route path="list" element={<StudentList />} />
                <Route path="class" element={<ClassManagement />} />
              </Route>

              {/* 教师管理 */}
              <Route path="/teacher">
                <Route path="list" element={<TeacherList />} />
                <Route path="schedule" element={<TeacherSchedule />} />
              </Route>

              {/* 课程管理 */}
              <Route path="/course">
                <Route path="list" element={<CourseList />} />
                <Route path="schedule" element={<CourseSchedule />} />
                <Route path="plan" element={<CoursePlan />} />
              </Route>

              {/* 成绩管理 */}
              <Route path="/score">
                <Route path="input" element={<ScoreInput />} />
                <Route path="analysis" element={<ScoreAnalysis />} />
                <Route path="report" element={<ScoreReport />} />
              </Route>

              {/* 流程审批 */}
              <Route path="/workflow">
                <Route path="pending" element={<PendingApproval />} />
                <Route path="done" element={<DoneApproval />} />
              </Route>

              {/* 通知公告 */}
              <Route path="/announcement">
                <Route path="list" element={<NotificationList />} />
                <Route path="create" element={<PublishNotification />} />
                <Route path="my" element={<MyNotification />} />
              </Route>

              {/* 系统管理 */}
              <Route path="/system">
                <Route path="users" element={<UserManagement />} />
                <Route path="roles" element={<RoleManagement />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>
            </Route>

            {/* 404页面重定向到首页 */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
