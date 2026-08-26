import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons'
import { useCatalog } from '../context/CatalogContext'

export function Settings() {
  const [name, setName] = useState('Zorch Farms Admin')
  const [email, setEmail] = useState('admin@zorchfarms.com')
  const { showToast } = useCatalog()
  const navigate = useNavigate()
  return <div className="page settings-page"><div className="page-intro"><div><h2>Settings</h2><p>Manage your admin profile and account preferences.</p></div></div><section className="settings-panel panel"><div className="panel-heading"><div><p className="eyebrow">ADMIN PROFILE</p><h3>Your details</h3></div></div><div className="settings-form"><label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label></div><button className="button button-primary" onClick={() => showToast('Profile details saved')}>Save changes</button></section><section className="settings-panel panel"><div className="panel-heading"><div><p className="eyebrow">ACCOUNT</p><h3>Account actions</h3></div></div><div className="account-action"><div><span className="account-icon"><Icon name="lock" /></span><div><strong>Change Password</strong><p>Password changes will be available when authentication is connected.</p></div></div><button className="button button-secondary" onClick={() => showToast('Password management is not available in this prototype')}>Change Password</button></div><div className="account-action logout-action"><div><span className="account-icon"><Icon name="logout" /></span><div><strong>Logout</strong><p>End this admin session on this device.</p></div></div><button className="button button-danger-quiet" onClick={() => navigate('/login')}>Logout</button></div></section></div>
}