import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DiscoverProblems from './pages/DiscoverProblems';
import ProblemDetails from './pages/ProblemDetails';
import PostProblem from './pages/PostProblem';
import FindCollaborators from './pages/FindCollaborators';
import StudentProfile from './pages/StudentProfile';
import MyCollaborations from './pages/MyCollaborations';
import CollaborationWorkspace from './pages/CollaborationWorkspace';
import Tasks from './pages/Tasks';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import MyProblems from './pages/MyProblems';
const publicPages = ['landing', 'login', 'register', 'onboarding'];
const validPages = new Set([
    ...publicPages,
    'dashboard',
    'discover',
    'problem-details',
    'post-problem',
    'find-collaborators',
    'profile',
    'my-problems',
    'my-collaborations',
    'workspace',
    'tasks',
    'messages',
    'notifications',
    'settings',
]);

function pageFromLocation() {
    const page = window.location.hash.replace(/^#\/?/, '');
    return validPages.has(page) ? page : 'landing';
}

function AppInner() {
    const initialPage = pageFromLocation();
    const [page, setPage] = useState(initialPage);
    const [context, setContext] = useState(() => window.history.state?.context || {});

    useEffect(() => {
        if (!window.location.hash) {
            window.history.replaceState({ page: initialPage, context: {} }, '', '#landing');
        }
        const handlePopState = event => {
            setPage(validPages.has(event.state?.page) ? event.state.page : pageFromLocation());
            setContext(event.state?.context || {});
            window.scrollTo({ top: 0, behavior: 'instant' });
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [initialPage]);

    function navigate(to, ctx) {
        const nextContext = ctx || {};
        window.history.pushState({ page: to, context: nextContext }, '', `#${to}`);
        setPage(to);
        setContext(nextContext);
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
    const isPublic = publicPages.includes(page);
    function renderPage() {
        switch (page) {
            case 'landing': return <Landing navigate={navigate}/>;
            case 'login': return <Login navigate={navigate}/>;
            case 'register': return <Register navigate={navigate}/>;
            case 'onboarding': return <Onboarding navigate={navigate}/>;
            case 'dashboard': return <Dashboard navigate={navigate}/>;
            case 'discover': return <DiscoverProblems navigate={navigate}/>;
            case 'problem-details': return <ProblemDetails navigate={navigate} context={context}/>;
            case 'post-problem': return <PostProblem navigate={navigate}/>;
            case 'find-collaborators': return <FindCollaborators navigate={navigate}/>;
            case 'profile': return <StudentProfile navigate={navigate} context={context}/>;
            case 'my-problems': return <MyProblems navigate={navigate}/>;
            case 'my-collaborations': return <MyCollaborations navigate={navigate}/>;
            case 'workspace': return <CollaborationWorkspace navigate={navigate} context={context}/>;
            case 'tasks': return <Tasks navigate={navigate}/>;
            case 'messages': return <Messages navigate={navigate}/>;
            case 'notifications': return <Notifications navigate={navigate}/>;
            case 'settings': return <Settings navigate={navigate}/>;
            default: return <Dashboard navigate={navigate}/>;
        }
    }
    if (isPublic) {
        return <div key={page} className="fade-in">{renderPage()}</div>;
    }
    return (<AppShell currentPage={page} sidebarPage={context.sidebarPage} navigate={navigate}>
      <div key={page} className="fade-in">
        {renderPage()}
      </div>
    </AppShell>);
}
export default function App() {
    return (<AuthProvider>
      <AppInner />
    </AuthProvider>);
}
