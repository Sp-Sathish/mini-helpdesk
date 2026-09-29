import BrandMark from './BrandMark'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <p className="auth-product">
            <BrandMark />
            Mini Helpdesk
          </p>
          <h1>{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        {children}
        {footer && <p className="auth-footer">{footer}</p>}
      </div>
    </main>
  )
}
