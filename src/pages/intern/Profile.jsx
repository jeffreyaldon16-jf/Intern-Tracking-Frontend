import { User, Mail, Briefcase, Calendar as CalendarIcon, Award } from 'lucide-react';

export default function Profile() {
  const name = localStorage.getItem('userName') || 'Intern';
  const role = localStorage.getItem('userRole') || 'intern';
  const profileData = {
    name: name,
    role: role === 'admin' ? 'Super Admin' : 'Intern',
    email: name.toLowerCase() + '@interntrack.com',
    department: 'Software Development',
    joiningDate: '01-07-2026',
    mentor: 'Super Admin',
  };

  return (
    <div>
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences.</p>
        </div>
      </div>
      <div className="content-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '700px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#1f2937', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', margin: '0 auto 16px auto' }}>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>{profileData.name}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>{profileData.role}</p>
          </div>
          <div style={{ textAlign: 'left', borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FAFAFA', borderRadius: '8px' }}>
                <Mail size={18} color="#6b7280" /> <span style={{ color: '#6b7280', minWidth: '100px' }}>Email</span> <span style={{ fontWeight: '500' }}>{profileData.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FAFAFA', borderRadius: '8px' }}>
                <Briefcase size={18} color="#6b7280" /> <span style={{ color: '#6b7280', minWidth: '100px' }}>Department</span> <span style={{ fontWeight: '500' }}>{profileData.department}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FAFAFA', borderRadius: '8px' }}>
                <CalendarIcon size={18} color="#6b7280" /> <span style={{ color: '#6b7280', minWidth: '100px' }}>Joining Date</span> <span style={{ fontWeight: '500' }}>{profileData.joiningDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FAFAFA', borderRadius: '8px' }}>
                <Award size={18} color="#6b7280" /> <span style={{ color: '#6b7280', minWidth: '100px' }}>Mentor</span> <span style={{ fontWeight: '500' }}>{profileData.mentor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
