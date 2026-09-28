import React, { useState, useEffect } from 'react';
import { Role, Submission, AuthUser, CTVApplication, ExpertApplication } from './types';
import { INITIAL_SUBMISSIONS } from './data/initialSubmissions';
import { Header } from './components/Header';
import { CitizenPortal } from './components/CitizenPortal';
import { CitizenSubmissionForm } from './components/CitizenSubmissionForm';
import { CitizenProfile } from './components/CitizenProfile';
import { ReporterApplicationForm } from './components/ReporterApplicationForm';
import { EditorDesk } from './components/EditorDesk';
import { ReporterDesk } from './components/ReporterDesk';
import { LeadershipDesk } from './components/LeadershipDesk';
import { ExpertDesk } from './components/ExpertDesk';
import { TrackingModal } from './components/TrackingModal';
import { SubmissionDetailModal } from './components/SubmissionDetailModal';
import { LoginModal } from './components/LoginModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ExpertApplicationModal } from './components/ExpertApplicationModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('CITIZEN');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('news_portal_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem('news_portal_submissions');
      if (saved) {
        const parsed: Submission[] = JSON.parse(saved);
        // Ensure new demo items exist
        const existingIds = new Set(parsed.map((s) => s.id));
        const missingInitial = INITIAL_SUBMISSIONS.filter((s) => !existingIds.has(s.id));
        if (missingInitial.length > 0) {
          return [...missingInitial, ...parsed];
        }
        return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_SUBMISSIONS;
  });

  // Citizen view state: 'PORTAL' | 'SUBMIT' | 'PROFILE' | 'APPLY_CTV'
  const [citizenView, setCitizenView] = useState<'PORTAL' | 'SUBMIT' | 'PROFILE' | 'APPLY_CTV'>('PORTAL');

  // Reputation score for citizen
  const [reputationScore, setReputationScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('news_portal_citizen_reputation');
      if (saved) return Number(saved);
    } catch (e) {
      console.warn(e);
    }
    return 95;
  });

  // CTV Application state
  const [ctvApplication, setCtvApplication] = useState<CTVApplication | null>(() => {
    try {
      const saved = localStorage.getItem('news_portal_ctv_application');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return null;
  });

  const handleSaveCTVApplication = (app: CTVApplication) => {
    setCtvApplication(app);
    try {
      localStorage.setItem('news_portal_ctv_application', JSON.stringify(app));
    } catch (e) {
      console.warn(e);
    }
  };

  // Expert Application state
  const [expertApplication, setExpertApplication] = useState<ExpertApplication | null>(() => {
    try {
      const saved = localStorage.getItem('news_portal_expert_application');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return null;
  });

  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  const handleApproveExpert = (app: ExpertApplication) => {
    setExpertApplication(app);
    try {
      localStorage.setItem('news_portal_expert_application', JSON.stringify(app));
    } catch (e) {
      console.warn(e);
    }

    const expertUser: AuthUser = {
      id: 'user-expert-01',
      name: app.citizenName,
      email: app.email,
      phone: app.phone,
      role: 'EXPERT',
      title: app.academicTitle,
      penName: app.citizenName,
      department: app.organization,
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    };

    setCurrentUser(expertUser);
    try {
      localStorage.setItem('news_portal_auth_user', JSON.stringify(expertUser));
    } catch (e) {
      console.warn(e);
    }

    setCurrentRole('EXPERT');
    setCitizenView('PORTAL');
  };

  // Modals
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingCodeToSearch, setTrackingCodeToSearch] = useState('');
  const [selectedDetailSubmission, setSelectedDetailSubmission] = useState<Submission | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('news_portal_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.warn(e);
    }
  }, [submissions]);

  // Sync reputation score to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('news_portal_citizen_reputation', String(reputationScore));
    } catch (e) {
      console.warn(e);
    }
  }, [reputationScore]);

  // Listen for custom event from components to switch role seamlessly
  useEffect(() => {
    const handleSwitchRole = (e: any) => {
      if (e.detail) {
        setCurrentRole(e.detail as Role);
        setCitizenView('PORTAL');
      }
    };
    window.addEventListener('app:switch-role', handleSwitchRole);
    return () => window.removeEventListener('app:switch-role', handleSwitchRole);
  }, []);

  // Update submission helper
  const handleUpdateSubmission = (updated: Submission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  // Add new submission from Citizen
  const handleCreateSubmission = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleOpenTrackModal = (code?: string) => {
    if (code) setTrackingCodeToSearch(code);
    setIsTrackingModalOpen(true);
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('news_portal_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    // Switch role to user's assigned role
    setCurrentRole(user.role);
    setCitizenView('PORTAL');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('news_portal_auth_user');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleOpenProfile = () => {
    if (currentRole === 'CITIZEN') {
      setCitizenView('PROFILE');
    } else {
      setIsEditProfileModalOpen(true);
    }
  };

  const handleSaveProfile = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('news_portal_auth_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn(e);
    }

    if (updatedUser.role === 'CITIZEN') {
      try {
        const existing = localStorage.getItem('news_portal_citizen_profile');
        const parsed = existing ? JSON.parse(existing) : {};
        const updatedCitizen = {
          ...parsed,
          name: updatedUser.name,
          phone: updatedUser.phone || parsed.phone,
          email: updatedUser.email,
          address: updatedUser.address || parsed.address,
          avatar: updatedUser.avatar || parsed.avatar,
        };
        localStorage.setItem('news_portal_citizen_profile', JSON.stringify(updatedCitizen));
        window.dispatchEvent(new CustomEvent('app:profile-updated', { detail: updatedCitizen }));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-red-500 selection:text-white">
      {/* Universal Header with Role Switcher & Stats */}
      <Header
        currentRole={currentRole}
        onSelectRole={(role: Role) => {
          setCurrentRole(role);
          setCitizenView('PORTAL');
        }}
        pendingCount={submissions.length}
        onOpenSubmit={() => {
          setCurrentRole('CITIZEN');
          setCitizenView('SUBMIT');
        }}
        onOpenTrack={() => handleOpenTrackModal()}
        onOpenProfile={handleOpenProfile}
        onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        reputationScore={reputationScore}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ROLE 1: CITIZEN */}
        {currentRole === 'CITIZEN' && (
          <div>
            {citizenView === 'SUBMIT' && (
              /* Form gửi tin nóng với Radio Button 3 Tiêu Chí Impact Score */
              <CitizenSubmissionForm
                onBack={() => setCitizenView('PORTAL')}
                onSubmitSuccess={(newSub) => {
                  handleCreateSubmission(newSub);
                  setReputationScore((prev) => Math.min(100, prev + 5));
                }}
              />
            )}

            {citizenView === 'PROFILE' && (
              /* Trang Hồ Sơ Người Dân & Điểm Uy Tín */
              <CitizenProfile
                onBack={() => setCitizenView('PORTAL')}
                onOpenApplyCTV={() => setCitizenView('APPLY_CTV')}
                onOpenApplyExpert={() => setIsExpertModalOpen(true)}
                onOpenSubmitNews={() => setCitizenView('SUBMIT')}
                onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
                submissions={submissions}
                ctvApplication={ctvApplication}
                expertApplication={expertApplication}
                reputationScore={reputationScore}
              />
            )}

            {citizenView === 'APPLY_CTV' && (
              /* Trang Điền Form Xin Xét Duyệt Cộng Tác Viên */
              <ReporterApplicationForm
                onBack={() => setCitizenView('PROFILE')}
                onSubmitSuccess={(app) => {
                  handleSaveCTVApplication(app);
                }}
                reputationScore={reputationScore}
                initialApplication={ctvApplication}
              />
            )}

            {citizenView === 'PORTAL' && (
              /* Dashboard Cổng Thông Tin Dân Sinh */
              <CitizenPortal
                onOpenSubmit={() => setCitizenView('SUBMIT')}
                onOpenTrack={(code) => handleOpenTrackModal(code)}
                onOpenProfile={() => setCitizenView('PROFILE')}
                onOpenApplyExpert={() => setIsExpertModalOpen(true)}
                onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
                reputationScore={reputationScore}
                submissions={submissions}
                onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
              />
            )}
          </div>
        )}

        {/* ROLE: EXPERT (CHUYÊN GIA) - Bao trọn function Người dân + Viết bài, Theo dõi bài & Chỉnh sửa bài */}
        {currentRole === 'EXPERT' && (
          <ExpertDesk
            submissions={submissions}
            onUpdateSubmission={handleUpdateSubmission}
            onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
            currentUser={currentUser}
            reputationScore={reputationScore}
            onOpenTrack={(code) => handleOpenTrackModal(code)}
          />
        )}

        {/* ROLE 2: EDITOR */}
        {currentRole === 'EDITOR' && (
          <EditorDesk
            submissions={submissions}
            onUpdateSubmission={handleUpdateSubmission}
            onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
          />
        )}

        {/* ROLE 3: REPORTER / CTV */}
        {currentRole === 'REPORTER' && (
          <ReporterDesk
            submissions={submissions}
            onUpdateSubmission={handleUpdateSubmission}
            onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
            onSwitchRole={(role) => setCurrentRole(role)}
          />
        )}

        {/* ROLE 4: DEPUTY EIC (PHÓ TỔNG BIÊN TẬP) */}
        {currentRole === 'DEPUTY_EIC' && (
          <LeadershipDesk
            currentRole="DEPUTY_EIC"
            submissions={submissions}
            onUpdateSubmission={handleUpdateSubmission}
            onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
          />
        )}

        {/* ROLE 5: EIC (TỔNG BIÊN TẬP) */}
        {currentRole === 'EIC' && (
          <LeadershipDesk
            currentRole="EIC"
            submissions={submissions}
            onUpdateSubmission={handleUpdateSubmission}
            onSelectSubmission={(sub) => setSelectedDetailSubmission(sub)}
            onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
          />
        )}
      </main>

      {/* Tòa soạn Footer */}
      <Footer />

      {/* Edit Profile Modal for ALL Roles */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        currentRole={currentRole}
        currentUser={currentUser}
        onSave={handleSaveProfile}
      />

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setTrackingCodeToSearch('');
        }}
        submissions={submissions}
        initialCode={trackingCodeToSearch}
      />

      {/* Full Submission Detail Modal */}
      <SubmissionDetailModal
        submission={selectedDetailSubmission}
        onClose={() => setSelectedDetailSubmission(null)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />

      {/* Expert Application & Accreditation Modal */}
      <ExpertApplicationModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        onApproveAndSwitch={handleApproveExpert}
        existingApplication={expertApplication}
      />
    </div>
  );
}
