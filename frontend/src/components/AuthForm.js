import React from 'react';

export default function AuthForm({
  type,
  data,
  errors,
  loading,
  onChange,
  onSubmit,
  onSwitch,
}) {
  const isSignup = type === 'signup';

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">
          {isSignup ? '✨ Create Account' : '🔐 Welcome Back'}
        </h2>
        <p className="auth-subtitle">
          {isSignup
            ? 'Sign up to start creating and managing your notes.'
            : 'Log in to access your notes.'}
        </p>

        {errors.form && <div className="auth-error">{errors.form}</div>}

        <form className="auth-fields" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          {isSignup && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={data.firstName}
                  onChange={onChange}
                  placeholder="Enter first name"
                  disabled={loading}
                  required
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={data.lastName}
                  onChange={onChange}
                  placeholder="Enter last name"
                  disabled={loading}
                  required
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={onChange}
              placeholder="Enter email address"
              disabled={loading}
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={onChange}
              placeholder="Enter password"
              disabled={loading}
              required
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={onChange}
                placeholder="Confirm password"
                disabled={loading}
                required
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : isSignup ? '➕ Create Account' : '🔐 Login'}
          </button>
        </form>

        <div className="auth-switch">
          {isSignup ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => onSwitch('login')}
              >
                Log in here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => onSwitch('signup')}
              >
                Sign up here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
