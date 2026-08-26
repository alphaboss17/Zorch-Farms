import logo from '../assets/zorch_logo.jpg'

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className={`logo ${compact ? 'logo-compact' : ''}`}>
    <img src={logo} alt="Zorch Farms" />
    {!compact && <span><strong>Zorch Farms</strong><small>Admin portal</small></span>}
  </div>
}