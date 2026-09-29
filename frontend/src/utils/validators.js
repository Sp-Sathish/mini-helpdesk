const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  }
  return errors
}

export function validateRegister({ fullName, email, password }) {
  const errors = {}
  const name = fullName.trim()
  if (name.length < 2 || name.length > 100) {
    errors.fullName = 'Name must be between 2 and 100 characters'
  }
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email.trim()) || email.trim().length > 150) {
    errors.email = 'Enter a valid email address'
  }
  if (password.length < 8 || password.length > 72) {
    errors.password = 'Password must be between 8 and 72 characters'
  }
  return errors
}

export const CATEGORY_OPTIONS = ['TECHNICAL', 'BILLING', 'ACCOUNT', 'GENERAL']
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
export const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

export function validateTicket({ title, description, category, priority }) {
  const errors = {}
  const trimmedTitle = title.trim()
  if (trimmedTitle.length < 3 || trimmedTitle.length > 150) {
    errors.title = 'Title must be between 3 and 150 characters'
  }
  const trimmedDescription = description.trim()
  if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
    errors.description = 'Description must be between 10 and 2000 characters'
  }
  const trimmedCategory = category.trim()
  if (trimmedCategory.length < 2 || trimmedCategory.length > 50) {
    errors.category = 'Category must be between 2 and 50 characters'
  }
  if (!PRIORITIES.includes(priority)) {
    errors.priority = 'Choose a priority'
  }
  return errors
}

export function showFormMessage(message, errors) {
  if (!message) {
    return false
  }
  return !(message === 'Validation failed' && Object.keys(errors).length > 0)
}

export function readApiError(error) {
  const data = error.response?.data
  if (!data) {
    return {
      message: 'Unable to reach the server. Check that the API is running.',
      errors: {},
    }
  }
  return {
    message: data.message || 'Request failed',
    errors: data.errors || {},
  }
}
