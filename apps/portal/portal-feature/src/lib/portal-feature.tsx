import styles from './portal-feature.module.scss';

export function PortalFeature() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to PortalFeature!</h1>
    </div>
  );
}

export default PortalFeature;

// Export components from modules
export { AdminLogin, UserList, ActiveProvider, Calendar, CollegeList, CreateCollegeModal, EditCollegeModal, CollegeView, StudentsListPage, LoanList, CreateLoanModal, EditLoanModal, ScholarshipList, FollowupsPage, ChatBotList, Dashboard, ExamsList, BlogList, CreateBlogModal, EditBlogModal, ViewBlogModal } from './modules';
